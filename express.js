var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');
var passport = require('passport');
var mongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');
var helpers = require('view-helpers');
var config = require('./config/config');

var DB = require('./db');

//var main = require('./main');

//instantiates a new express application
var app = express();

//has to wait for DB to be connected to run
app.runConfiguration = function(callback){
	app.configure(expressConfig);
	callback();
}

//exposes the app object to the outside
module.exports = app;

var expressConfig = function(){
    //sets the listening port to 3000, if there is none configured as an environment variable
    app.set('port', process.env.PORT || 3000);
    //Sets up Swig as the templating engine
    app.set('views', config.root + '/main/_views');
    app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	swig.setDefaults({
		cache: false ,
		autoescape: false
	});

	//cookieParser should be above session
    app.use(express.cookieParser());

    // request body parsing middleware should be above methodOverride
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(express.methodOverride());

    //express/mongo session storage
    app.use(express.session({
        secret: 'MEAN',
        store: new mongoStore({
            db: DB.db.connection.db,
            collection: 'sessions'
        })
    }));

    // Dynamic helpers
    app.use(helpers(config.app.name));

    // Use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //connect flash for flash messages
    app.use(flash());    
    
    //Setting the fav icon and static folder
    app.use(express.favicon());
    app.use(express.static(config.root + '/public'));

    //requiring the main application, containing all the components
    app.use(require('./main'));

    //bootstrap passport config
	//require('./config/passport')(passport);

    // Assume "not found" in the error msgs is a 404. this is somewhat
    // silly, but valid, you can do whatever you like, set properties,
    // use instanceof etc.
    app.use(function(err, req, res, next) {
        // Treat as 404
        if (~err.message.indexOf('not found')) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
}