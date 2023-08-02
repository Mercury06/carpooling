const { Schema, model, ObjectId } = require("mongoose");

const Dialog = new Schema(
  {
    participants: [{ type: ObjectId, ref: "User", required: true }],
    content: [
      {
        author: { type: ObjectId, ref: "User", required: true },
        body: { type: String, required: true },
        created_at: { type: Date },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Dialog", Dialog);
