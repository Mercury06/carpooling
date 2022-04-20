const {Schema, model} = require ("mongoose")

const User = new Schema ({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    avatar: {type: String},
    rate: {type: Number},
    feedbacks: [{type: String}],    
    roles: [{type: String, ref: 'Role'}] //указываем ссылку на сущность роли
}, {timestamps: true}) //User.createdAt; User.updatedAt

module.exports = model ('User', User)