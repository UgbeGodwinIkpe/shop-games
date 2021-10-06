const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/signup', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signup', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/signin',
    failureRedirect: '/user/signup',
    failureFlash: true
}));
router.get('/signin', (req, res, next) => {
    const messages = req.flash('error');
    res.render('user/signin', { csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0 });
});

router.get('/profile', isLoggedIn, (req, res, next) => {
    res.render('/profile');
});

router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}));
router.get('/logout', (req, res, next) => {
        req.logout();
        res.redirect('/');
    })
    // Exporting router
module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticateed()) {
        return next();
    }
    res.redirect('/');
}