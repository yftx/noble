var mongodb = require('./db');

function Artist(user) {
	this.id = user.id;
	this.name = user.name;
	this.sex = user.sex;
	this.birthday = user.birthday;
	this.tel = user.tel;
};

module.exports = Artist;

Artist.prototype.save = function save(callback) {
	var user = this;

	mongodb.open(function(err,db){
		if(err) {
			return callback(err);
		}

		db.collection('artists',function(err,collection){
			if(err) {
				mongodb.close();
			}

			collection.ensureIndex('name',{
				unique: true
			});

			collection.insert(user,{safe: true},function(err,user){
				mongodb.close();
				callback(err,user);
			});
		});
	});
};

Artist.prototype.update = function update(callback) {
	var user = this;

	mongodb.open(function(err,db){
		if(err) {
			return callback(err);
		}

		db.collection('artists',function(err,collection){
			if(err) {
				mongodb.close();
			}
			collection.update({id:user.id},{$set:user},function(err,user){
				mongodb.close();
				callback(err,user);
			});
		});
	});
};

Artist.del = function(id,callback) {  
	mongodb.open(function(err,db){
		if(err) {
			return callback(err);
		} 
		db.collection('artists',function(err,collection){
			if(err) {
				mongodb.close();
			}  
			collection.remove({id: id},1,function(err,user){
				mongodb.close();
				callback(err,user);
			});
		});
	});
};

Artist.get = function(id, callback){
	mongodb.open(function(err, db){
	    if(err){
	        return callback(err);
	    }

	    db.collection('artists', function(err, collection){
	        if(err){
	            mongodb.close();
	            return callback(err);
	        }
	        collection.findOne({
	            id: id
	        },function(err, doc){
	            mongodb.close();
	            if(doc){
	                var user = new Artist(doc);
	                callback(err, user);
	            } else {
	                callback(err, null);
	            }
	        });
	    });
    });
};

Artist.getAll = function(callback) {
	mongodb.open(function(err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('artists', function(err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.find().toArray(function(err,docs) {
				mongodb.close();
				if (err) {
					callback(err, null);
				}
				callback(null, docs);
			});
		});
	});
};