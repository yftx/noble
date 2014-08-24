function toIndex() {
   $('#myTab a[href="#home"]').tab('show')  
}
 
function listUser(num) {
    $.get('/user/query', {
        num: num
    }, function(data) {
        $('#user_query').html(data);
    });
}

function toAddUser() {
    $.get('/vipadd', {}, function(data) {
        $('#user_query').html(data);
    });
}

function toUpdateUser(url) {
    $.get(url,{},function(data){
        $('#user_query').html(data);
        $('#userupdate_form').ajaxForm(function(data) {
          if(!data.error) {
            listUser(1);
          } else {
            showDialog(data.error);
          }
        });
    });
}

function showDialog(msg) {
    var d = dialog({
        content: msg,
        quickClose: true,
        width: 200
    });
    d.show();
}

function listTopup(num) {
    $.get('/topup/query', {
        num: num
    }, function(data) {
        $('#topup_query').html(data);
    });
}

function listArtist(num) {
    $.get('/artist', {
        num: num
    }, function(data) {
        $('#artist').html(data);
    });
}

function toAddArtist() {
    $.get('/artistadd', {}, function(data) {
        $('#artist').html(data);
    });
}

function OverallViewModel() {
    var self = this;
    
    self.name = ko.observable("未登录");

    self.projects = ko.observableArray([]);

    self.isLogin = ko.computed(function() {
        return this.name() !== "未登录";
    },self);

    self.addProject = function(pro) {
        self.projects.push(pro);
    }

    self.listProject = function() {
        $('#myTab a[href="#project"]').tab('show');
        $.get('/project', {}, function(data) {
            self.projects(data);
        });
    }

    self.toIndex = function() {
        $('#project').show();
    }
}

function listSerial(num) {
    $.get('/serial/query', {
        num: num
    }, function(data) {
        $('#serial_query').html(data);
    });
}

function Serial() {
    this.discount = ko.observable();
    this.beforePrice = ko.observable();
    this.price = ko.observable();
    this.balance = ko.observable();

    this.setValues = function(data){
        this.discount(data.discountName);
        this.beforePrice(data.beforePrice);
        this.price(data.price);
        this.balance(data.balance);
    }
}

function toAddSerial() {
    $.get('/serialadd', {}, function(data) {
        $('#serial_query').html(data);
        $('#serial_form').ajaxForm(function(data) {
          if(!data.error) {
            listSerial(1);
          } else {
            var d = dialog({
                content: data.error,
                quickClose: true,
                width: 200
            });
            d.show();
          }
        });
        var serial = new Serial();
        ko.applyBindings(serial,$('#serial_form').get(0));

        var autoItem = $("#autocomplete").autocomplete({
            focus: function(event, ui) {
                $("#autocomplete").val(ui.item.name);
                return false;
            },
            source: function(req, res) {
                if (req.term) {
                    $.get('/vipsearch', {
                        key: req.term
                    }, function(data) {
                        var result = [];
                        for (var i = 0; i < data.length; i++) {
                            result.push(data[i]);
                        }
                        res(result);
                    });
                }
            },
            select: function(event, ui) {
                var userName = ui.item.name;
                $("#autocomplete").val(userName);
                var projectName = $('#projectName').val();
                if (userName && projectName) {
                    loadValue(userName, projectName);
                }
                return false;
            }
        }).data("ui-autocomplete");

        autoItem. _renderItem = function(ul, item) {
            return $("<li>")
                .append("<a>" + item.name + "<br />" + item.rankType + "-余额（" + item.balance + "）</a>")
                .appendTo(ul);
        };

        function loadValue(userName, projectName) {
            $.get('/serialcalc', {
                userName: userName,
                projectName: projectName
            }, function(data) {
                serial.setValues(data);
                if (data.balance < 0) {
                    var d = dialog({
                        content: '余额不足，请充值！',
                        quickClose: true
                    });
                    d.show(document.getElementById('user-topup'));
                }
            });
        }

        $("#projectName").change(function() {
            var projectName = $(this).val(); //对象值 
            var userName = $('#autocomplete').val();
            if (userName && projectName) {
                loadValue(userName, projectName);
            }
        });
    });
}

function delConfirm(url, content,callback) {
    var d = dialog({
        title: '提示',
        content: content || '确定删除这条记录吗？',
        width: 300,
        ok: function() {
            $.get(url, {}, function(data) {
                callback(1);
            });
            return true;
        },
        okValue: '确定',
        cancelValue: '取消',
        cancel: true
    });
    d.show();
}

function topupVip(uid) {
    var d = dialog({
        title: '用户充值',
        content: '<input type="number" class="form-control" id="user-topup" placeholder="请输入充值金额" />',
        width: 300,
        okValue: '确定',
        cancelValue: '取消',
        cancel: true,
        ok: function() {
            var value = $('#user-topup').val();
            if (value) {
                $.post(uid, {
                    value: value
                }, function(data) {
                    showDialog('充值成功！');
                    listUser(1);
                });
                return true;
            } else {
                var d = dialog({
                    content: '请输入大于1的数值',
                    quickClose: true
                });
                d.show(document.getElementById('user-topup'));
                return false;
            }
        }
    });
    d.show();
}
