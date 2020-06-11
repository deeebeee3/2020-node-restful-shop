const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

//if we reach this line and make it past the above 2 middlewares - 
//no routes in the previous two middle wares were able to handle the request
//so we can handle errors by catching all requests that make it past the above middlewares
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error)
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

module.exports = app;