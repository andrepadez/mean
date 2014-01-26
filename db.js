var mongoose = require('mongoose');

var DB = module.exports = {
	connect: function(dbUrl, callback){
		DB.db = mongoose.connect(dbUrl);
		mongoose.connection.on('open', function(){
			callback();
		});
	}
};

/*

mongoose.connection.on('open', function(err){
    if(err){console.log(err);return;}
    console.log('connected to mongodb');
	server.listen(server.get('port'), function(){
		console.log("Express server listening on port " + server.get('port'));
    });
});
*/