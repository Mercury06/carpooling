const { Schema, model, ObjectId } = require('mongoose');

const Ask = new Schema(
  {
    localityFrom: {
      localityName: { type: String, required: true },
      id: { type: ObjectId, ref: 'Locality', required: true },
    },
    destination: {
      localityName: { type: String, required: true },
      id: { type: ObjectId, ref: 'Locality', required: true },
    },
    points: [
      {
        localityName: { type: String },
        mongoId: { type: ObjectId, ref: 'Locality' },
        _id: false,
      },
    ],
    direction: { type: String, required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    seats: { type: Number, default: 1 },
    date: { type: Date, required: true },
    offers: [],
    completed: { type: Boolean, default: false }, // ride status
    //time: [{type: String, ref: 'Role'}],
    comment: { type: String, minlength: 5 },
  },
  { timestamps: true },
);

module.exports = model('Ask', Ask);
