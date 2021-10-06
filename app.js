const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHBs = require('express-handlebars');
const dotenv = require('dotenv');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const passport = require('passport');
const validator = require('express-validator');
const flash = require('connect-flash');
const MongoStore = require('connect-mongodb-session')(session);
const routes = require('./routes/index');
// const user = require('./routes/users');
const db = require('./config/key').MongoURI;
const app = express();

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

require('./config/passport');

// setting up view engine
app.engine('.hbs', expressHBs({ handlebars: allowInsecurePrototypeAccess(Handlebars), defaultLayout: 'layout', extname: '.hbs' }));
// app.engine('.hbs', expressHBs({ defaultLayout: 'layout', extname: '.hbs' }))
app.set('view engine', 'hbs');

// unconnent after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static('./public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'securitor',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connect
    }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});
app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handle
app.use(function(req, res, next) {

})

const port = process.env.PORT || 4000;

app.listen(port, (err, res) => {
    if (err) throw err;
    console.log("App running of port " + port);
})