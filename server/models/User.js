const { Schema, model } = require("mongoose");

const User = new Schema(
  {
    firstName: { type: String, minlength: 2, maxlength: 11, required: true },
    lastName: { type: String, minlength: 2, maxlength: 11, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    created: { type: Date },
    dateOfBirth: { type: Date },
    avatar: { type: String },
    rate: { type: Number, default: 5 },
    feedbacks: [{ type: String }],
    roles: [{ type: String, ref: "Role" }], //role entity reference
    accessFailedCount: { type: Number },
    notifications: [
      {
        initiator: { type: String, required: true },
        event: { type: String, required: true },
        data: { type: String },
        notified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
); //User.createdAt; User.updatedAt

module.exports = model("User", User);
