function delConfirm(url,content){
  var d = dialog({
      title: '提示',
      content: content || '确定删除这条记录吗？',
      width: 300,
      ok: function () {
          $.get(url, {}, function(data){
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
      ok: function () {
          var value = $('#user-topup').val();
          if(value) {
            $.post(uid, {value:value}, function(data){ 
                var d = dialog({
                    content: '充值成功！',
                    width: 200
                });
                d.show();
                setTimeout(function () {
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