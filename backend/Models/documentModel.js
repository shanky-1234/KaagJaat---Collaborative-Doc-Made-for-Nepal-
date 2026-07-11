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
        pageSetting:{
            type:String,
            enum:['A4','legal','letter'],
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
                default: 72
            },
            bottom:{
                type:Number,
                default:72
            },
             left:{
                type:Number,
                default: 72
            },
            right:{
                type:Number,
                default:72
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

    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users',
          required: true
        },

        role: {
          type: String,
          enum: ['viewer', 'editor'],
          default: 'viewer'
        }
      }
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
