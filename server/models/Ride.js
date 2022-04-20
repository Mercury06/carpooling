const {Schema, model, ObjectId} = require ("mongoose")

const Ride = new Schema ({
    localityFrom: {type: ObjectId, ref: 'Locality'},
    destination: {type: ObjectId, ref: 'Locality'},
    user: {type: ObjectId, ref: 'User'},
    seats: {type: Number},
    data: {type: Date},
    time: [{type: String, ref: 'Role'}],
    comment: {type: String, minlength: 5}
}, {timestamps: true})

module.exports = model ('Ride', Ride)