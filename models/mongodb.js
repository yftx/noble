var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/noble');
exports.mongoose = mongoose;