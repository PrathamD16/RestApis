const mongoose = require('mongoose')

const Product = new mongoose.Schema({
    pid:{type:String, unique:true},
    name:{type:String},
    price:{type:Number, default:0}
})

module.exports = mongoose.model('products',Product)