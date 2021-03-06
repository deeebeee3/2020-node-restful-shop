const mongoose = require('mongoose');

const Product = require('../models/product');

exports.products_get_all = async(req, res, next) => {
    try {
        const results = await Product
            .find()
            .select('name price _id productImage')
            .exec();

        const response = {
            count: results.length,
            products: results.map(result => {
                return {
                    name: result.name,
                    price: result.price,
                    productImage: `http://localhost:3000/${result.productImage}`,
                    _id: result._id, 
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${result._id}`
                    }
                }
            })
        };

        res.status(200).json(response);

    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}

exports.products_create_product = async (req, res, next) => {
    //product object created with help of mongoose
    //special object we can call methods on
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    try{
        //save method provided by mongoose, which we can use on mongoose models
        //don't need to chain on exec - as save() returns a real promise by default
        const result = await product.save();

        res.status(201).json({
            message: 'Product created successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _ide: result._id,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        });

    }catch(err){
        console.log(err)
        res.status(500).json({ err });
    }
}

exports.products_get_product = async (req, res, next) => {
    const id = req.params.productId;

    try{
        //findById - static method on Product
        //exec() - returns a true promise - available on most mongoose async methods - see api
        const product = await Product
            .findById(id)
            .select('name price _id productImage')
            .exec();

        if(product){
            res.status(200).json({
                product,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            });
        }else{
            res.status(404).json({ message: 'No valid product found for provided ID' });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ err });
    }
}

exports.products_update_product = async (req, res, next) => {
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

        res.status(200).json({ 
            message: `${JSON.stringify(updated)} successfully updated`,
            request: {
                type: 'GET',
                url: `http://localhost:3000/products/${id}`
            } 
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
}

exports.products_delete_product = async (req, res, next) => {
    try {
        const id = req.params.productId;
        const deleted = await Product.remove({ _id: id }).exec();

        console.log(deleted);
        
        res.status(200).json({ 
            message: `${JSON.stringify(deleted)} successfully deleted Product`,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number' }
            }
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}