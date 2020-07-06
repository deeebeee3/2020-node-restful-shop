const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', checkAuth, async (req, res, next) => {
    try {
        const results = await Order
            .find()
            .select('product quantity _id')
            .populate('product', 'name') //product comes from order model's property
            .exec();

        res.status(201).json({
            count: results.length,
            orders: results.map(result => {
                return {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity,
                    request: {
                        type: 'GET',
                        url: `http:localhost:3000/orders/${result._id}`
                    }
                }
            })
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.post('/', checkAuth, async (req, res, next) => {
        try{
            const productExists = await Product.findById(req.body.productId).exec();

            if(!productExists){
                throw new Error('Product does not exist')
            }

            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.quantity
            });

            const result = await order.save();
    
            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: `http:localhost:3000/orders/${result._id}`
                }
            });
        }catch(err){
            //console.log(err.message);
            res.status(500).json({ error: err.message });
        }  
    


});

router.get('/:orderId', checkAuth, async (req, res, next) => {
    try{
        const order = await Order
            .findById(req.params.orderId)
            .select('product quantity _id')
            .populate('product')
            .exec();

        if(order){
            res.status(200).json({
                order,
                request: {
                    type: 'GET',
                    description: 'Get all orders',
                    url: 'http://localhost:3000/orders'
                }
            });
        }else{
            res.status(404).json({ message: 'No valid order found for provided ID' });
        }

    }catch(err){
        console.log(err);
        res.status(500).json({ err });
    }
});

router.delete('/:orderId', checkAuth, async (req, res, next) => {
    try {
        const id = req.params.orderId;
        const deleted = await Order.remove({ _id: id }).exec();

        console.log(deleted);

        res.status(200).json({ 
            message: `${JSON.stringify(deleted)} successfully deleted Order`,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { productId: 'mongoose.Schema.Types.ObjectId', quantity: 'Number' }
            }
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
});

module.exports = router;