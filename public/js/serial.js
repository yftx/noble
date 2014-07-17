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
        }
    }
});

require(['jquery','bootstrap','bootstrap-paginator'],function($){
	var options = {
		currentPage:2,
		totalPages:5,
		numberOfPages:5
	};
	$('#page1').bootstrapPaginator(options);
});