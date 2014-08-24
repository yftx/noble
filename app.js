/**
 * Module dependencies.
 */

var express = require('express'),
    partials = require('express-partials'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    flash = require('connect-flash'),
    connect = require('connect');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(flash()).use(partials()).use(connect.favicon());
app.use(connect.logger());
app.use(connect.urlencoded());
app.use(connect.json());
app.use(connect.cookieParser());
app.use(connect.session({
    secret: '123456',
    cookie: {
        maxAge: 30000
    }
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
}); 

if ('development' == app.get('env')) {
    app.use(connect.errorHandler());
}

app.use(express.static(path.join(__dirname, 'public')));

app.listen(3001);

console.log('noble service listening on port 3001');

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

routes(app);
