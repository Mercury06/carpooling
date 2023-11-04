const { Schema, model, ObjectId } = require("mongoose");
const uuid = require("uuid");

const Dialog = new Schema(
  {
    participants: [{ type: ObjectId, ref: "User", required: true }],
    // referedRide: { type: ObjectId, ref: "Ride", required: true },
    referedAsk: { type: ObjectId, ref: "Ask", required: true },
    body: [
      {
        id: { type: String, unique: true, default: uuid.v4 },
        author: { type: ObjectId, ref: "User", required: true },
        content: { type: String },
        created_at: { type: Date },
        read: { type: Boolean, default: false },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Dialog", Dialog);
