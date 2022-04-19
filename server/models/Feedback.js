const {Schema, model, ObjectId} = require ("mongoose")

const Feedback = new Schema ({
    value: {type: String},
    author: {type: ObjectId, ref: 'User'},
    recipient: {type: ObjectId, ref: 'User'},
    ride: {type: ObjectId, ref: 'Ride'}
})

module.exports = model('Feedback', Feedback)