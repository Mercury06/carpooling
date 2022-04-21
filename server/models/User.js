const {Schema, model} = require ("mongoose")

const User = new Schema ({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String},
    email: {type: String},
    //dateOfBirth: {type: Date},
    age: {type: Number}, //? заменить на function от dateOfBirth
    avatar: {type: String},
    rate: {type: Number, default: 5},
    feedbacks: [{type: String}],    
    roles: [{type: String, ref: 'Role'}] //указываем ссылку на сущность роли
}, {timestamps: true}) //User.createdAt; User.updatedAt

module.exports = model ('User', User)