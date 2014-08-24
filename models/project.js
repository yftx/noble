var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;

var ProjectSchema = new Schema({
    id: Number,
    name: String,
    price: {
        type: Number,
        default: 0
    }
});

var Project = mongodb.mongoose.model("Project", ProjectSchema);

var ProjectDAO = function() {};

ProjectDAO.prototype.save = function(obj, callback) {
    var instance = new Project(obj);
    instance.save(function(err) {
        callback(err,instance);
    });
};

ProjectDAO.prototype.del = function(id, callback) {
    Project.findOne({
        id: id
    }, function(err, doc) {
        if (err) {
            callback(err);
            return;
        }
        doc.remove();
        callback(null);
    });
}

ProjectDAO.prototype.getAll = function(callback) {
    Project.find({}, function(err, docs) {
        callback(err, docs);
    });
}

ProjectDAO.prototype.getByName = function(name, callback) {
    Project.findOne({
        name: name
    }, function(err, docs) {
        callback(err, docs);
    });
}

module.exports = new ProjectDAO();
