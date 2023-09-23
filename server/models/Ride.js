const { Schema, model, ObjectId } = require("mongoose");

const Ride = new Schema(
  {
    localityFrom: {
      localityName: { type: String, required: true },
      id: { type: ObjectId, ref: "Locality", required: true },
    },
    destination: {
      localityName: { type: String, required: true },
      id: { type: ObjectId, ref: "Locality", required: true },
    },
    points: [
      {
        localityName: { type: String },
        mongoId: { type: ObjectId, ref: "Locality" },
        _id: false,
      },
    ],
    direction: { type: String, required: true },
    user: { type: ObjectId, ref: "User", required: true },
    seats_declared: { type: Number, default: 1 },
    seats_available: { type: Number, default: 1 }, //if 0 all seats booked
    asks: [],
    passengers: [],
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false }, // ride status
    //time: [{type: String, ref: 'Role'}],
    comment: { type: String, minlength: 5 },
  },
  { timestamps: true }
);

module.exports = model("Ride", Ride);
