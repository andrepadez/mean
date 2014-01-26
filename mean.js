process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/config');
var DB = require('./db');
var server = require('./express');

console.log('Application Start: ' + new Date());

DB.connect(config.db, function(){
	if(!DB.db){ process.exit(); }
	console.log('connected to', config.db);
	server.runConfiguration(function(){
		server.listen(server.get('port'), function(){
			console.log("Express server listening on port " + server.get('port'));
	    });
	});
});