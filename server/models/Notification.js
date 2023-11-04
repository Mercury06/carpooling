const { Schema, model, ObjectId } = require("mongoose");

const Notification = new Schema(
  {
    author: { type: ObjectId, ref: "User", required: true },
    recipient: { type: ObjectId, ref: "User", required: true },
    reference: { type: String },
    status: { type: Boolean, default: false },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Notification", Notification);
