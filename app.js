/**
 * Module dependencies.
 */

var express = require('express'),
    partials = require('express-partials'),
    routes = require('./routes'),
    path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var errorhandler = require('errorhandler');
var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '123456',
    cookie: {
        maxAge: 3000000
    },
    saveUninitialized: true,
    resave: true
}));

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
}); 

if ('development' == app.get('env')) {
    app.use(errorhandler());
}

routes(app);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

Date.prototype.format = function(fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = app;
