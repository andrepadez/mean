var fs = require('fs');
var path = require('path');
var express = require('express');
var passport = require('passport');
var app = module.exports = express();

app.set('views', path.join(__dirname, '_views'));

app.get('/', function(req, res){
	res.render('index', {
		user: req.user ? JSON.stringify(req.user) : 'null'
	});
});

//bootstrap all the components
fs.readdir(__dirname, function(err, files){
	files.forEach(function(file, index, files){
		var filePath = path.join(__dirname, file);
		fs.stat(filePath, function(err, stats){
			if(stats.isDirectory() && !file.match(/^_/)){
				app.use(require(filePath));
			}
		});
	})
});