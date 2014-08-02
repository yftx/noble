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

require(['jquery', 'dialog/src/dialog', 'jquery-ui', 'bootstrap', 'noble', 'knockout-3.0.0', 'jquery.form', 'highcharts'], function($, dialog) {
    window.dialog = dialog;

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
            case "#project":
                listProject(1);
                break;
            case "#serial_query":
                listSerial(1);
                break;
        }
    });
});
