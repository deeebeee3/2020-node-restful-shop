const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');


router.get('/', async(req, res, next) => {
    try {
        const products = await Product.find().exec();

        console.log(products);
        res.status(200).json({ products });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

router.post('/', async (req, res, next) => {
    //product object created with help of mongoose
    //special object we can call methods on
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    try{
        //save method provided by mongoose, which we can use on mongoose models
        const result = await product.save();

        console.log(result);
    }catch(err){
        console.log(err)
    }

    res.status(201).json({
        message: 'Handling POST requests to /products',
        createdProduct: product
    });
});

router.get('/:productId', async (req, res, next) => {
    const id = req.params.productId;

    try{
        //findById - static method on Product
        //exec() - returns a true promise - available on most mongoose async methods - see api
        const product = await Product.findById(id).exec();

        if(product){
            console.log(product);
            res.status(200).json({ product });
        }else{
            res.status(404).json({ message: 'No valid product found for provided ID' });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ err });
    }
});

router.patch('/:productId', async (req, res, next) => {
    try {
        const id = req.params.productId;

        const updateOps = {};

        for(const key in req.body){
            updateOps[key] = req.body[key];
        }

        const updated = await Product.update({ 
            _id: id 
        }, {
            $set: updateOps
        }).exec();

        console.log(updated);
        res.status(200).json({ message: `${JSON.stringify(updated)} successfully updated` });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

router.delete('/:productId', async (req, res, next) => {
    try {
        const id = req.params.productId;
        const deleted = await Product.remove({ _id: id }).exec();

        console.log(deleted);
        res.status(200).json({ message: `${JSON.stringify(deleted)} successfully deleted` });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

module.exports = router;