const express = require('express');
const transliterate = require('@cloudrumbles/indic-transliterate')

const router = express.Router();

const transliterator = new transliterate.IndicTransliterator()

let initialized = false

router.get("/", async (req, res) => {
  try {
    const text = String(req.query.text || "");

    if (!text) {
      return res.json([]);
    }

    if(!initialized){
        await transliterator.initialize();
        initialized=true
    }

    const result = await transliterator.transliterate(text, "ne");

    res.json(result);
  } catch (error) {
    console.error("Transliteration error:", error);
    res.status(500).json({
      message: "Transliteration failed",
    });
  }
});

module.exports = router
