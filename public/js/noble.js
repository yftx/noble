function searchUser(thiz) {
    var keyword = $('#user-name')[0].value;
    $.get('/user/query', {
        keyword: keyword
    }, function(data) {
        $('#user_query').html(data);
    });
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

function listProject(num) {
    $.get('/project', {
        num: num
    }, function(data) {
        $('#project').html(data);
    });
}

function toAddProject() {
    $.get('/projectadd', {}, function(data) {
        $('#project').html(data);
    });
}

function listSerial(num) {
    $.get('/serial/query', {
        num: num
    }, function(data) {
        $('#serial_query').html(data);
    });
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

        if (autoItem) {
            autoItem._renderItem = function(ul, item) {
                return $("<li>")
                    .append("<a>" + item.name + "<br />" + item.rankType + "-余额（" + item.balance + "）</a>")
                    .appendTo(ul);
            };
        }

        function loadValue(userName, projectName) {
            $.get('/serialcalc', {
                userName: userName,
                projectName: projectName
            }, function(data) {
                $('#rankType').val(data.rankType);
                $('#discount').val(data.discountName);
                $('#beforePrice').val(data.beforePrice);
                $('#price').val(data.price);
                $('#balance').val(data.balance);
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

function delConfirm(url, content) {
    var d = dialog({
        title: '提示',
        content: content || '确定删除这条记录吗？',
        width: 300,
        ok: function() {
            $.get(url, {}, function(data) {
                window.location.reload();
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
        ok: function() {
            var value = $('#user-topup').val();
            if (value) {
                $.post(uid, {
                    value: value
                }, function(data) {
                    var d = dialog({
                        content: '充值成功！',
                        width: 200
                    });
                    d.show();
                    setTimeout(function() {
                        d.close().remove();
                        window.location.reload();
                    }, 1000);
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
        },
        okValue: '确定',
        cancelValue: '取消',
        cancel: true
    });
    d.show();
}
