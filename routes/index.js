/**
 * Created by belle on 5/24/17.
 */
'use strict';
let express = require('express');
let router = express.Router();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');
function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }
    else{
        req.flash('error_msg','you need to log in');
        res.redirect('/login');
    }
}

router.get('/',(req,res,next)=>{
    res.render('index');
})
router.get('/register',(req,res,next)=>{
    res.render('register');
});
router.get('/login',(req,res,next)=>{
    res.render('login');
})

router.post('/register',(req,res,next)=>{
    let name = req.body.name;
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    let conf_password = req.body.conf_password;

    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('email','Email is reqd').notEmpty();
    req.checkBody('email','not a valid email').isEmail();
    req.checkBody('password','password field is reqd').notEmpty();
    req.checkBody('conf_password','passwords must match').equals(req.body.password);

    //req express validator,takes all errors
  let errors = req.validationErrors();
    if(errors){
        res.render('register',{errors})
    }
    else{
        let newUser = new User({
            name,username,email,password
        });
        //check model for fns
        User.createUser(newUser,(err)=>{
            if(err) throw err;
            console.log('succesfully signed up');
        });
        req.flash('success_msg','u av succesfully logged in');
        res.redirect('/login');
    }
});
passport.use(new LocalStrategy(
    function (username,password,done) {
  
    //check models for fns
    User.getUserByUsername(username, function (err,user) {
        if (err) throw err;
        if(!user){ return done(null,false,{message : 'invalid username'})}
        User.comparePassword(password, user.password,function (err,isMatch) {
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            }
            else{
                return done(null, false, {message : 'invalid password'});
            }
        })
    })
    }
));
passport.serializeUser((user,done)=>{
   done(null,user.id)
});
passport.deserializeUser((id, done)=>{
    User.getUserById(id , function (err,user) {
      done(err,user);
    })
})
router.post('/login',passport.authenticate('local',{
    successRedirect:'/',failureRedirect : '/login',failureFlash:true
}),(req,res)=>{
    res.redirect('/');
});
router.get('/logout',(req,res,next)=>{
    req.logout();
    req.flash('success_msg','you are logged out')
    res.redirect('/')
});
router.get('/other',ensureAuthenticated,(req,res,next)=>{
   res.render('other');
})


module.exports = router;