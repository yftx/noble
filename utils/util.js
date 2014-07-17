var ranks = [{
      type : '水晶卡',
      discount : 0.9,
      discountName : '九折'
  },{
      type : '金卡',
      discount : 0.8,
      discountName : '八折'
  },{
      type : '铂金卡',
      discount : 0.7,
      discountName : '七折'
  },{
      type : '钻石卡',
      discount : 0.6,
      discountName : '六折'
  }];

exports.ranks = ranks

exports.getNowDate = function() {
    var data = new Date();  
    var year = data.getFullYear();  //获取年
    var month = data.getMonth() + 1;    //获取月
    var day = data.getDate(); //获取日
    var hours = data.getHours(); 
    var minutes = data.getMinutes();
   return year + "/" + month + "/" + day + " " + hours + ":" + minutes;
}

exports.getRank = function(rankType) {
  for(var i = 0 ; i < ranks.length ; i++) {
    if(ranks[i]['type'] == rankType)
      return ranks[i];
  }
}

/**
  过滤路径
*/
exports.filter = function(app,maps){
    

    var deal_path = function(rpath){
        var spos = rpath.lastIndexOf('/');
        var path_tail = rpath.substring(spos);
        rpath = rpath.substring(0,spos);
        spos = rpath.lastIndexOf('/');
        rpath = rpath.substring(0,spos) + path_tail;
        return rpath;
    };
    // 验证用户登录
    var verfiy_auth = function(req,res,next){
	    var pass = false;
      var rpath = req.path;
      var a_verify = config.path_access[rpath];
      if(!a_verify){
           rpath = deal_path(rpath); 
           a_verify = config.path_access[rpath];
      }


	    if(a_verify == config.ACCESS_VERIFY){

	        if(req.cookies[(config.auth_cookie_name)]){
	            var email = null;
	            try{
	                email = exports.decrypt(req.cookies[(config.auth_cookie_name)], config.session_secret);
	                
	            }catch(e){
	                console.log(e.message);
	            }
	            
	            if(email){
	                pass = true;
	            }
	        }
	    }else{
	        pass = true;
	    }
	    return pass;
    };
    
    var get_ctrl_func = function(path, method){
        method = method.toLowerCase();
        // 示例url /diary/add 或者/comment/add以及/diary/2131232dfsddsds/view
        var paths = path.split('/');
        var paths_obj = {};
        var dpath_len = paths.length;
        for(var i = 0; i < paths.length ;i++){

             if(paths[i] != ""){
                paths_obj[paths[i]] = 1;
             }else{

                dpath_len--;
             }

             if(paths[i].indexOf(':') == 0){
                dpath_len--;
             }
             
        }

        if(dpath_len >= 3 && path.length > 24){
           dpath_len--;
        }

        for(var i = 0, len = maps.length;i < len; i++){
             var objm = maps[i];
             if(path == objm.path && method == objm.method){
                 return objm.ctrl;
             }else if(path != objm.path && method == objm.method){
                var ops = objm.path.split('/');
                
                var march_count = 0;
                for(var j = 0;j < ops.length;j++){

                   if(paths_obj[ops[j]]){
                      march_count++;
                   }
                }

                // 如果最后一个是:page 而且当前paths_obj最后一个元素是数字也匹配
                if(ops && ops.length > 0 && paths && paths.length > 0){
                      if(ops[ops.length - 1] == ":page" && exports.isint(paths[paths.length - 1])){
                          march_count++;
                      }
                }
                
                if(march_count >= dpath_len){
                    return objm.ctrl;
                }else{
                  continue;
                }
             }else{
                continue;
             }
        }

     
    };
    
    for(var i = 0, len = maps.length;i < len; i++){
        var objm = maps[i];

        app[objm.method](objm.path, function(req,res,next){
            if(verfiy_auth(req, res, next)){
                var gcfunc = get_ctrl_func(req.path, req.method);
                
                if(gcfunc){
                    gcfunc(req,res,next);
                }else{
                    res.redirect('/');
                }
            }else{
                res.redirect('user/login?p='+req.path);
            }
        });
        
    }
   
};