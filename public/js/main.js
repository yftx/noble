require.config({ // load backbone as a shim
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
        },
        'jquery.form': {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'dialog/src/dialog', 'jquery-ui', 'bootstrap', 'noble', 'knockout-3.0.0', 'jquery.form'], function($, dialog, jquery_ui, bootstrap, noble, ko) {
    window.dialog = dialog;
    window.ko = ko;

    var overallViewModel = new OverallViewModel();
    ko.applyBindings(overallViewModel);

    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
        switch (e.target.hash) {
            case "#user_query":
                listUser(1);
                break;
            case "#topup_query":
                listTopup(1);
                break;
            case "#artist":
                listArtist(1);
                break; 
            case "#serial_query":
                listSerial(1);
                break;
        }
    });


    $('#login_form').ajaxForm(function(data) {
        overallViewModel.name(data.name);
        $('#login_form').hide();
    });

    $('#project_form').ajaxForm(function(data) {
        if(!data.error) {
          $('#myTab a[href="#project"]').tab('show')
        } else {
          var d = dialog({
              content: data.error,
              quickClose: true,
              width: 200
          });
          d.show();
        }
    });
});
