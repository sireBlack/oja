const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb+srv://node-shop-rest:'+  process.env.MONGO_ATLAS_PW +'@node-rest-shop-xbwmf.mongodb.net/test?retryWrites=true', {useNewUrlParser: true});

mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Autorization");
    if (req.method === 'OPTIONS'){
        res.header("Acess-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({
        });
    }
    next();
});

app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next)=>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    });
})

module.exports = app;