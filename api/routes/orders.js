const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const { 
    orders_get_all, 
    order_create_order,
    order_get_order,
    order_delete_order 
} = require('../controllers/orders');

router.get('/', checkAuth, orders_get_all);

router.post('/', checkAuth, order_create_order);

router.get('/:orderId', checkAuth, order_get_order);

router.delete('/:orderId', checkAuth, order_delete_order);

module.exports = router;