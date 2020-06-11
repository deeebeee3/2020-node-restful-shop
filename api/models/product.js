const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

module.exports = mongoose.model('Product', productSchema);

//wrap schema in a model which gives back a 
//constructor which we can use to build objects based on the schema