const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    if (password.length < 6) {
        return done(null, false, { message: 'Password must be atleast 6 characters long' });
    }
    User.findOne({ 'email': email }, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Email is already in use' });
        }
        hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(5));
        const newUser = new User();
        newUser.email = email;
        newUser.password = hashPassword;
        newUser.save((err, result) => {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, email, password, done) => {
    if (!email || !password) {
        return done(null, false, { message: 'Please fill in all fields' });
    }
    User.findOne({ 'email': email }, async(err, user) => {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message: 'User not found. Please check the email and try again' });
        } else {
            let isMatch = await bcrypt.compare(password, user.password);
            console.log(isMatch, password, user.password);

            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password entered' });

            } else {

                console.log(user)
                return done(null, user);
            }
        }
    });
}));