require.config({    // load backbone as a shim
	paths: {
        jquery: 'jquery-1.11.0'
    },
    shim: {
        'bootstrap': {
            //The underscore script dependency should be loaded before loading backbone.js
            deps: ['jquery']
        },
        'bootstrap-paginator': {
        	deps: ['bootstrap']
        },
        'highcharts': {
        	deps: ['jquery']
        }
    }
});

require(['jquery','dialog/src/dialog','jquery-ui','bootstrap','noble','knockout-3.0.0','highcharts'],function($,dialog){
	window.dialog = dialog;
	
	var autoItem = $("#autocomplete" ).autocomplete({
      focus: function( event, ui ) {
        $("#autocomplete").val(ui.item.name);
        return false;
      },
	  source: function(req,res){
	  	if(req.term) {
	  		$.get('/vipsearch', {key:req.term}, function(data){
	  			var result = [];
	  			for(var i = 0 ; i < data.length; i++) {
	  				result.push(data[i]);
	  			}
	  			res(result);
          	});
	  	} 
	  },
	  select: function(event, ui) {
	  	var userName = ui.item.name;
	  	$("#autocomplete").val(userName);
		var projectName = $('#project').val();	
		if(userName && projectName) {
			loadValue(userName,projectName);
		}
		return false;
	  }
	}).data( "ui-autocomplete");

	if(autoItem) {
		autoItem._renderItem = function( ul, item ) {
	      return $( "<li>" )
	        .append( "<a>" + item.name + "<br />" + item.rankType + "-余额（"+ item.balance +"）</a>" )
	        .appendTo( ul );
	    };
	}

	function loadValue(userName,projectName) { 
		$.get('/serialcalc',{userName:userName,projectName:projectName}, function(data){
  			$('#rankType').val(data.rankType);
  			$('#discount').val(data.discountName);
  			$('#beforePrice').val(data.beforePrice);
  			$('#price').val(data.price);
  			$('#balance').val(data.balance);
  			if(data.balance < 0) {
  				var d = dialog({
	              content: '余额不足，请充值！',
	              quickClose: true
	            });
	            d.show(document.getElementById('user-topup'));
  			}
        });
	}

	$("#project").change(function(){ 
		var projectName = $(this).val();//对象值 
		var userName =  $('#autocomplete').val();
		if(userName && projectName) {
			loadValue(userName,projectName);
		}
	}); 
});