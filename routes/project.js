var Project = require('../models/project.js');

exports.projectList = function(req, res) { 
    Project.getAll(function(err,projects){
        res.render('project/list', {
            layout: false,
            title: '项目管理',
            projects : projects
        }); 
    });
}

exports.projectAdd = function(req, res) {
   res.render('project/add', {
        layout: false,
        title: '添加项目'
    });
}

exports.doProjectAdd = function(req, res) {
    if (req.body.proj['name'] == null) {
        req.flash('error', '名称不能为空');
        return res.redirect('/vipadd');
    } 
    req.body.proj.id = new Date().getTime();
    Project.save(req.body.proj,function(err){
		if (err) {
            req.flash('error', err);
            return res.send({error: '项目名称重复！'});
        }
        res.send({success: true});
    });
}

exports.projectDel = function(req, res) {
	var id = req.params.id
	Project.del(id,function(err){
		if (err) {
            req.flash('error', err);
        }
        res.send({success: true});
	});  
}
