const {Schema, model, ObjectId} = require ("mongoose")

const Ride = new Schema ({
    // localityFrom: {type: ObjectId, ref: 'Locality', required: true},
    // destination: {type: ObjectId, ref: 'Locality', required: true},
    localityFrom: {type: String, required: true},
    destination: {type: String, required: true},
    user: {type: ObjectId, ref: 'User'},
    seats: {type: Number, default: 1},
    date: {type: Date, required: true},
    completed: {type: Boolean, default: false}, // ride status
    //time: [{type: String, ref: 'Role'}],
    comment: {type: String, minlength: 5}
}, {timestamps: true})

module.exports = model ('Ride', Ride)