var User = require('../models/user.js');
var Serial = require('../models/serial.js');
var Artist = require('../models/artist.js');
var Project = require('../models/project.js');
var Topup = require('../models/topup.js');
var Utils = require('../utils/util.js');
var project = require('../routes/project.js');
var o3o = require('o3o');
var async = require('async');

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            title: '主页'
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            layout: false,
            title: '登录'
        });
    });

    app.post('/login', function(req, res) {
        if (req.body['account'] == null) {
            req.flash('error', '账号不能为空');
            return res.redirect('/logout');
        }

        if (req.body['account'] == 'laijie' && req.body['password'] == '123456') {
            var user = {
                name: '赖婕 ' + o3o('smile')
            };
            req.session.user = user;
            return res.send(user);
        } else {
            req.flash('error', '用户名或密码错误');
            return res.redirect('/logout');
        }
    });

    app.get('/logout', function(req, res) {
        req.session.user = null;
        res.redirect('/');
    });

    //会员管理

    app.get('/user/query', checkLogin);
    app.get('/user/query', function(req, res) {
        var keyword = req.query.keyword || "";
        var num = req.query.num || 1;
        var limit = req.query.limit || 10;
        var obj = {
            search: {
                name: new RegExp(keyword)
            },
            page: {
                num: num,
                limit: limit
            }
        };
        User.findPagination(obj, function(err, pageCount, users) {
            res.render('vip/list', {
                layout: false,
                title: '会员管理',
                num: num,
                pageCount: pageCount,
                users: users
            });
        });
    });

    app.get('/vipadd', function(req, res) {
        res.render('vip/add', {
            layout: false,
            title: '添加会员',
            ranks: Utils.ranks
        });
    });

    app.post('/vipadd', function(req, res) {
        var user = req.body.user;
        if (user['name'] == null) {
            return res.send({
                error: '名称不能为空'
            });
        }
        user.id = new Date().getTime();
        User.save(user, function(err) {
            return res.send({
                error: err
            });
        });
    });

    app.get('/vipdel/:id', function(req, res) {
        var id = req.params.id;
        if (id == null) {
            return res.send({
                error: 'id不能为空'
            });
        }
        User.del(parseInt(id), function(err) {
            return res.send({
                error: err
            });
        });
    });

    app.get('/vipupdate/:id', function(req, res) {
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        }
        User.get(parseInt(id), function(err, user) {
            res.render('vip/edit', {
                layout: false,
                title: '修改会员',
                u: user,
                ranks: Utils.ranks
            });
        });
    });

    app.post('/vipupdate', function(req, res) {
        var id = req.body.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        }
        var user = {
            id: parseInt(id),
            name: req.body.name,
            rankType: req.body.rankType,
            sex: req.body.sex,
            birthday: req.body.birthday,
            tel: req.body.tel
        };
        User.update(user, function(err) {
            return res.send({
                error: err
            });
        });
    });

    app.post('/viptopup/:id', function(req, res) {
        var id = req.params.id;
        var value = req.body.value;
        if (value == null) {
            return res.send({
                error: '充值金额不能为空'
            });
        }
        User.get(parseInt(id), function(err, user) {
            if (err) {
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
                instance.save(function(err) {
                    return res.send({
                        error: err
                    });
                });
            });
        });
    });

    app.get('/vipsearch', function(req, res) {
        var key = req.query.key;
        User.getByKey(key, function(err, users) {
            res.send(users);
        });
    });

    //充值记录
    app.get('/topup/query', checkLogin);
    app.get('/topup/query', function(req, res) {
        var keyword = req.query.keyword || "";
        var num = parseInt(req.query.num) || 1;
        var limit = req.query.limit || 10;
        var obj = {
            search: {
                user: new RegExp(keyword)
            },
            page: {
                num: num,
                limit: limit
            }
        }
        Topup.findPagination(obj, function(err, pageCount, topups) {
            res.render('vip/topups', {
                layout: null,
                title: '充值记录管理',
                num: num,
                pageCount: pageCount,
                topups: topups
            });
        });
    });

    app.get('/topup/del/:id', function(req, res) {
        var id = req.params.id;
        if (id == null) {
            req.flash('error', 'id不能为空');
            return res.redirect('/vip');
        }
        Topup.remove({
            id: parseInt(id)
        }, function(err, user) {
            res.redirect('/topup/query');
        });
    });

    //美甲师管理
    app.get('/artist', checkLogin);
    app.get('/artist', function(req, res) {
        Artist.find(function(err, artists) {
            res.render('artist/list', {
                layout: false,
                title: '美甲师管理',
                artists: artists
            });
        });
    });
    app.get('/artistadd', function(req, res) {
        res.render('artist/add', {
            layout: false,
            title: '添加美甲师'
        });
    });
    app.post('/artistadd', function(req, res) {
        if (req.body['name'] == null) {
            req.flash('error', '名称不能为空');
            return res.redirect('/vipadd');
        }
        var artist = new Artist({
            id: new Date().getTime(),
            name: req.body.name,
            sex: req.body.sex,
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
        var keyword = req.query.keyword || "";
        var num = req.query.num || 1;
        var limit = req.query.limit || 20;
        var obj = {
            search: {
                vip: new RegExp(keyword)
            },
            page: {
                num: num,
                limit: limit
            }
        };
        Serial.findPagination(obj, function(err, pageCount, serials) {
            res.render('serial/list', {
                layout: false,
                title: '流水管理',
                num: num,
                pageCount: pageCount,
                serials: serials
            });
        });
    });

    app.get('/serialadd', checkLogin);
    app.get('/serialadd', function(req, res) {
        async.parallel([

            function(callback) {
                Project.getAll(function(err, projects) {
                    callback(err, projects);
                });
            },
            function(callback) {
                Artist.getAll(function(err, artists) {
                    callback(err, artists);
                });
            }
        ], function(err, result) {
            res.render('serial/add', {
                layout: false,
                title: '新增流水',
                projects: result[0],
                artists: result[1]
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
        Serial.save(serial, function(err) {
            if (err) {
                req.flash('error', err);
                return res.send({
                    error: err
                });
            }
            User.getByName(serial.vip, function(err, user) {
                if (err) {
                    req.flash('error', err);
                    return res.send({
                        error: err
                    });
                }
                user.balance = user.balance - serial.price;
                user.save(function(err) {
                    if (err) {
                        req.flash('error', err);
                        return res.send({
                            error: err
                        });
                    }
                    return res.send({
                        success: true
                    });
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
        User.getByName(userName, function(err, user) {
            var rankType = user.rankType;
            var rank = Utils.getRank(rankType);
            Project.getByName(projectName, function(err, project) {
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
        if (!req.session.user) {
            req.flash('error', '未登入');
            return res.redirect('/login');
        }
        next();
    }

};
