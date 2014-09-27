var mongoose = require('./mongodb').mongoose;

var TopupSchema = mongoose.Schema({
	id: Number,
	user: String,
	date: Date,
	money: Number
});

TopupSchema.methods.speak = function() {
	var greating = '亲爱的' + this.user + '，你在' + this.date + '充值了' + this.money + '元。';
	console.log(greating);
	return greating;
}

var Topup = mongoose.model('Topup',TopupSchema);

Topup.findPagination = function(obj,callback) {
	var q = obj.search||{};
	var pageNumber = obj.page.num || 1;
	var resultsPerPage = obj.page.limit || 10;

	var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
	var query = Topup.find(q).sort('date').skip(skipFrom).limit(resultsPerPage);

	query.exec(function(err,results){
		if(err) {
			callback(err,null,null);
		} else {
			Topup.count(q,function(err,count){
				var pageCount = Math.ceil(count / resultsPerPage);
				callback(null,pageCount,results);
			});
		}
	});
}

module.exports = Topup;
