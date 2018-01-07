'use strict';
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let exbhs = require('express-handlebars');
let flash = require('connect-flash');
let session = require('express-session');
let expressValidator = require('express-validator')
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
let db = mongoose.connection;

let routes = require('./routes/index');
let app = express();

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exbhs({defaultLayout : 'layout'}));
app.set('view engine','handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname,'public')));

//express session
app.use(session({
    secret :'secret',
    saveUninitialized : true,
    resave : true
}));

//passport
app.use(passport.initialize());
app.use(passport.session());


app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));

app.use(flash());
app.use(function (req,res,next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
app.use('/',routes);
app.set('port',(process.env.PORT || 3000));
app.listen(app.get('port'),function(){
    console.log('listening on '+ app.get('port'));
});