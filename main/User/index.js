var path = require('path');
var passport = require('passport');
var express = require('express');
var app = module.exports = express();

var User = require('./model');

app.set('views', path.join(__dirname, '_views'));

require('../../config/passport')(passport);

var users = require('./controller');

app.get('/signin', users.signin);
app.get('/signup', users.signup);
//app.get('/signup/done', users.signupDone)
//app.get('/signup/activate/:id', users.activate);
app.get('/signout', users.signout);
app.get('/users/me', users.me);


//Setting up the users api
app.post('/users', users.create);

//Setting the local strategy route
app.post('/users/session', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
}), users.session);

//Setting the facebook oauth routes
app.get('/auth/facebook', passport.authenticate('facebook', {
    scope: ['email', 'user_about_me'],
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/signin'
}), users.authCallback);

//Setting the github oauth routes
app.get('/auth/github', passport.authenticate('github', {
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/signin'
}), users.authCallback);

//Setting the twitter oauth routes
app.get('/auth/twitter', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.signin);

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/signin'
}), users.authCallback);

//Setting the google oauth routes
app.get('/auth/google', passport.authenticate('google', {
    failureRedirect: '/signin',
    scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]
}), users.signin);

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/signin'
}), users.authCallback);

//Finish with setting up the userId param
app.param('userId', users.user);