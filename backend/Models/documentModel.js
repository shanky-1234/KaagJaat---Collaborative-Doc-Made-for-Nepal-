const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "New Document",
    },

    description: {
      type: String,
    },

    content: {
      type: [mongoose.Schema.Types.Mixed],
      default: () => [
        {
          type: "paragraph",
          children: [{ text: "" }],
        },
      ],
    },

    settings:{
        pageSize:{
            type:String,
            enum:['A4','A5','A3','LETTER'],
            default:'A4'
        },

        orientation:{
            type:String,
            enum:['portrait','landscape'],
            default:'portrait'
        },

        margin:{
            top:{
                type:Number,
                default: 25
            },
            bottom:{
                type:Number,
                default:25
            },
             left:{
                type:Number,
                default: 25
            },
            right:{
                type:Number,
                default:25
            },
        }
    },


    createdAt: {
      type: Date,
      default: Date.now(),
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        role: {
          type: String,
          enum: ["viewer", "editor"],
          default: "viewer",
        },
      },
    ],
    
    ownerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("documents", DocumentSchema);
