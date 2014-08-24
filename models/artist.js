var mongodb = require('./mongodb');
var mongoose = mongodb.mongoose;

var Artist = mongoose.model('Artist',{
	id: Number,
	name: String,
	sex: String,
	birthday: Date,
	tel: String
});

module.exports = Artist;