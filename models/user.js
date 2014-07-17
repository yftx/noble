var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var UserSchema = new Schema({
	id: Number,
	name: String,
	rankType: String,
	balance: {
		type: Number,
		default: 0
	},
	sex: String,
	birthday: String,
	tel: String
});

var User = mongodb.mongoose.model("User",UserSchema);

var UserDAO = function(){};

UserDAO.prototype.findPagination = function(obj,callback) {
  var q=obj.search||{}
  var col=obj.columns;

  var pageNumber=obj.page.num||1;
  var resultsPerPage=obj.page.limit||5;

  var skipFrom = (pageNumber * resultsPerPage) - resultsPerPage;
  var query = User.find(q,col).sort('id').skip(skipFrom).limit(resultsPerPage);

  query.exec(function(error, results) {
    if (error) {
      callback(error, null, null);
    } else {
      User.count(q, function(error, count) {
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

UserDAO.prototype.save = function save(obj,callback) {
	var instance = new User(obj);
	instance.save(function(err){
		callback(err);
	});
};

UserDAO.prototype.update = function update(obj,callback) {
	User.update({id:obj.id},obj,function(err){
		callback(err);
	});
};

UserDAO.prototype.del = function(id,callback) { 
	User.findOne({id:id},function(err,doc){
		if(err) {
			callback(err)
			return;
		}
		doc.remove();
		callback();
	});
};

UserDAO.prototype.get = function(id, callback){
	User.findOne({id:id},function(err,doc){
		if(err) {
			callback(err)
			return;
		}
		callback(null,doc);
	});
};

UserDAO.prototype.getByName = function(name, callback){
	User.findOne({name:name},function(err,doc){
		if(err) {
			callback(err)
			return;
		}
		callback(null,doc);
	});
};

UserDAO.prototype.getByKey = function(key, callback){
	var query = {};
	query['name']=new RegExp(key);
	User.find(query,function(err,docs){
		if(err) {
			callback(err)
			return;
		}
		callback(null,docs);
	});
};

UserDAO.prototype.getAll = function(callback) {
	User.find(function(err,docs){
		if(err) {
			callback(err)
			return;
		}
		callback(null,docs);
	});
};

module.exports = new UserDAO();
