var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var SerialSchema = new Schema({
	id: Number,
	vip: String,
	date: Date,
	project: String,
	discount: String,
	price: Number,
	balance: Number,
	artist: String
});

var Serial = mongodb.mongoose.model("Serial",SerialSchema);

var SerialDAO = function(){};

SerialDAO.prototype.findPagination = function(obj,callback) {
  var q=obj.search||{};
  var col=obj.columns;

  var pageNumber=obj.page.num||1;
  var resultsPerPage=obj.page.limit||5; 

  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = Serial.find(q,col).sort({date: -1}).skip(skipFrom).limit(resultsPerPage);

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      Serial.count(q, function(error, count) {
        if (error) {
          callback(error, null, null);
        } else {
          var pageCount = Math.ceil(count / resultsPerPage);
          callback(null, pageCount, results);
        }
      });
    }
  });
}

SerialDAO.prototype.getAll = function(callback) {
	Serial.find({},function(err,docs){
	   callback(err,docs);
    });
};

SerialDAO.prototype.save = function(obj, callback) {
	var instance = new Serial(obj);
	instance.save(function(err){
		callback(err);
	});
};

SerialDAO.prototype.del = function(id,callback) {
	Serial.findOne({id:id},function(err,doc){
        if (err) {
        	callback(err);
        	return;
        }
        doc.remove();
        callback(null);
  });
}

module.exports = new SerialDAO();