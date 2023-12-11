const { Schema, model, ObjectId } = require("mongoose");

const Notification = new Schema(
  {
    recipient: { type: ObjectId, ref: "User", required: true },
    initiator: { type: String },
    event: { type: String },
    data: { type: String },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = model("Notification", Notification);
