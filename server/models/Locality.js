const {Schema, model} = require ("mongoose")

const Locality = new Schema ({
    locality: {type: String, unique: true},
    clarification: {type: String}
})

module.exports = model('Locality', Locality)