var User = require('../models/user.js');
var Serial = require('../models/serial.js');
var Artist = require('../models/artist.js');
var Project = require('../models/project.js');
var Topup = require('../models/topup.js');
var Utils = require('../utils/util.js');
var project = require('../routes/project.js');

module.exports = function(app) {
	app.get('/', function(req, res) {
		res.render('index', {
			title: '主页'
		});
	});
    app.get('/login', function(req, res) {
        res.render('login', {
            title: '登录' 
        });
    });
    app.post('/login',function(req,res) {
        if (req.body['account'] == null) {
            req.flash('error', '账号不能为空');
            return res.redirect('/login');
        } 

        if(req.body['account'] == 'laijie' && req.body['password'] == '123456') {
            var user = {
                name : '赖婕'
            }; 
            req.session.user = user;
            res.render('index', {
                title: '主页',
                user: user
            });
        } else {
            req.flash('error','用户名或密码错误'); 
            return res.redirect('/login'); 
        }
    });
    app.get('/logout', function(req, res) {
        req.session.user = null;
        req.flash('success', '登出成功');
        res.redirect('/');
    });

    //会员管理

    app.get('/user/query', checkLogin);
    app.get('/user/query', function(req, res) { 
        var keyword = req.query.keyword || "";
        var num = req.query.num||1;
        var limit = req.query.limit||10;
        var obj = {
            search: {
                name: new RegExp(keyword)
            },
            page: {
                num: num,
                limit: limit
            } 
        };
        User.findPagination(obj,function(err,pageCount,users){
            res.render('vip/list', {
                title: '会员管理',
                num: num,
                pageCount: pageCount,
                users : users
            }); 
        });
    });

	app.get('/vipadd', function(req, res) {
		res.render('vip/add', {
			title: '添加会员',
            ranks : Utils.ranks
		});
	});

    app.post('/vipadd', function(req, res) {
        var user = req.body.user;
        if (user['name'] == null) {
            req.flash('error', '名称不能为空');
            return res.redirect('/vipadd');
        } 
        user.id = new Date().getTime();
        User.save(user,function(err) {
            if (err) {
                req.flash('error', '用户名重复！');
                return res.redirect('/vipadd');
            }
            res.redirect('/user/query');
        });
    });

    app.get('/vipdel/:id', function(req, res) { 
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        } 
        User.del(parseInt(id), function(err) {
            res.redirect('/user/query'); 
        });
    });

    app.get('/vipupdate/:id', function(req, res) {
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        } 
        User.get(parseInt(id),function(err,user){
            res.render('vip/edit', {
                title: '修改会员',
                u : user,
                ranks : Utils.ranks
            });
        });
    });

    app.post('/vipupdate/:id', function(req, res) {
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        } 
        var user = {
            id : parseInt(id),
            name: req.body.name,
            rankType : req.body.rankType,
            sex : req.body.sex,
            birthday: req.body.birthday,
            tel : req.body.tel
        };
        User.update(user,function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/user/query');
            }
            res.redirect('/user/query');
        });
    });

    app.post('/viptopup/:id', function(req, res) {
        var id = req.params.id;
        var value = req.body.value;
        if (value == null) {
            req.flash('error', '充值金额不能为空');
            return res.redirect('/user/query');
        } 
        User.get(parseInt(id),function(err,user){
            if(err) {
                req.flash('error', err);
                return res.redirect('/vip');
            }
            var money = parseInt(value);
            user.balance = (user.balance ? user.balance : 0) + money;
            user.save(function(err) {
                var instance = new Topup({
                    id: new Date().getTime(),
                    date: new Date(),
                    user: user.name,
                    money: money
                });
                instance.save(function(err){ 
                    if (err) {
                        req.flash('error', err);
                        return res.redirect('/user/query');
                    }
                    res.redirect('/user/query');
                });
            });
        });
    });

    app.get('/vipsearch', function(req, res) { 
        var key = req.query.key;
        User.getByKey(key,function(err,users){
            res.send(users); 
        });
    });

    //充值记录
    app.get('/topup/query', checkLogin);
    app.get('/topup/query',function(req,res){
        var num = parseInt(req.query.num) || 1;
        var limit = req.query.limit || 10;
        var obj = {
            search: '',
            page: {
                num: num,
                limit: limit
            }
        }
        Topup.findPagination(obj,function(err,pageCount,topups){
            res.render('vip/topups', {
                title: '充值记录管理',
                num: num,
                pageCount: pageCount,
                topups : topups
            }); 
        });
    });

    app.get('/topup/del/:id',function(req,res){
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        }
        Topup.remove({id : parseInt(id)}, function(err, user) {
            res.redirect('/topup/query'); 
        });
    });

    //美甲师管理
    app.get('/artist', checkLogin);
    app.get('/artist', function(req, res) { 
        Artist.getAll(function(err,artists){
            res.render('artist/list', {
                title: '美甲师管理',
                artists : artists
            }); 
        });
    });
    app.get('/artistadd', function(req, res) {
        res.render('artist/add', {
                title: '添加美甲师'
            });
    });  
    app.post('/artistadd', function(req, res) {
        if (req.body['name'] == null) {
            req.flash('error', '名称不能为空');
            return res.redirect('/vipadd');
        } 
        var artist = new Artist({
            id : new Date().getTime(),
            name: req.body.name,
            sex : req.body.sex,
            birthday: req.body.birthday,
            tel: req.body.tel
        });
        artist.save(function(err) {
            if (err) {
                req.flash('error', '用户名重复！');
                return res.redirect('/artistadd');
            }
            res.redirect('/artist');
        });
    });
    app.get('/artistdel/:id', function(req, res) { 
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/artist');
        } 
        Artist.del(parseInt(id), function(err, a) {
            res.redirect('/artist'); 
        });
    });
    //项目管理
    app.get('/project', checkLogin);
    app.get('/project', project.projectList);
    app.get('/projectadd', project.projectAdd);
    app.post('/projectadd', project.doProjectAdd);
    app.get('/projectdel/:id', project.projectDel);
    //流水管理
    app.get('/serial/query', checkLogin);
    app.get('/serial/query', function(req, res) { 
        var num = req.query.num || 1;
        var limit = req.query.limit || 10;
        var obj = {
            search: "",
            page: {
                num: num,
                limit: limit
            } 
        };
        Serial.findPagination(obj,function(err,pageCount,serials){
            res.render('serial/list', {
                title: '流水管理',
                num: num,
                pageCount: pageCount,
                serials : serials
            }); 
        });
    });

    app.get('/serialadd', checkLogin);
    app.get('/serialadd', function(req, res) { 
        Project.getAll(function(err,projects){
            Artist.getAll(function(err,artists){
                res.render('serial/add', {
                    title: '新增流水',
                    projects : projects,
                    artists : artists
                });
            }); 
        }); 
    });

    app.post('/serialadd', function(req, res) { 
        var serial = req.body.serial;
        if (serial['vip'] == null) {
            req.flash('error', '会员不能为空');
            return res.redirect('/serial');
        } 
        serial.id = new Date().getTime();
        serial.date = new Date();
        Serial.save(serial,function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/serialadd');
            }
            User.getByName(serial.vip,function(err,user){
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/serialadd');
                }
                user.balance = user.balance - serial.price;
                user.save(function(err){
                     if (err) {
                        req.flash('error', err);
                        return res.redirect('/serialadd');
                    }
                    return res.redirect('/serial/query?num=1');
                }); 
            });
        });   
    });

    app.get('/serialdel/:id', function(req, res) { 
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        }
        Serial.del(parseInt(id), function(err, user) {
            res.redirect('/serial/query'); 
        });
    });

    app.get('/serialcalc', function(req, res) { 
        var userName = req.query.userName;
        var projectName = req.query.projectName;
        User.getByName(userName,function(err,user){
            var rankType = user.rankType;
            var rank = Utils.getRank(rankType);
            Project.getByName(projectName,function(err,project){
                var price = Math.round(rank.discount * project.price);
                var balance = user.balance - price;
                var result = {
                    rankType: rankType,
                    discountName: rank.discountName,
                    beforePrice: project.price,
                    price: price,
                    balance: balance
                };
                res.send(result);   
            }); 
        });
    });

    function checkLogin(req, res, next) { 
        next();
        return;
        if (!req.session.user) {
            req.flash('error', '未登入');
            return res.redirect('/login');
        }
        next(); 
    }

};