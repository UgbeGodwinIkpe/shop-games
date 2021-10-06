const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const csrfProtection = csrf();
router.use(csrfProtection);
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order = require('../models/order');

// Getting home hape
router.get('/', (req, res, next) => {
    const successMsg = req.flash('success')[0];
    Product.find((err, docs) => {
        var productChunks = [];
        const chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessage: !successMsg });
    });
});
router.get('/user/signup', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/user/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/signin',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/user/profile', isLoggedIn, (req, res, next) => {
    res.render('user/profile');
});

router.get('/user/signin', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});
router.get('/user/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    res.redirect('/');
});
router.get('/add-to-cart/:id', (req, res, nex) => {
    let productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : { items: {} });
    Product.findById(productId, function(err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id);
        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
});
router.get('/shopping-cart', (req, res, next) => {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { product: null });
    }
    let cart = new Cart(req.session.cart);
    res.render('shop/shopping-cart', { products: cart.generateArray(), totalPrice: cart.totalPrice });
});
router.get('/checkout', (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    let cart = new Cart(req.session.cart);
    let errMsg = req.flash('error')[0];
    res.render('shop/checkout', { total: cart.totalPrice, errMsg: errMsg, noError: !errMsg });

})
router.post('/user/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));
router.post('/checkout', (req, res, next) => {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    let cart = new Cart(req.session.cart);
    const stripe = require('stripe')('sk_test_51IaKWrF3UDMLO7wfqQEiLyjP3VGQx60rLq5h7Zj4CZr9y1EDlS3e280vaxoot2fSsto5XMK8b022ioS5h5TCr3Jw00ZbCM4rux');
    stripe.charge.create({
        amount: cart.totalPrice * 100,
        currency: 'usd',
        source: req.body.stripeToken,
        description: 'Charge for shopping cart'
    }, (ree, charge) => {
        //async called here
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/checkout');
        }
        const order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });
        order.save((err, result) => {
            req.flash('success', 'Successfully bought product!');
            req.session.cart = null;
            res, redirect('/')

        });
    });
});

// Exporting router
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}