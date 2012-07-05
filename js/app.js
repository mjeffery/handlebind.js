require.config({
	shim: {
		'lib/underscore': {
			deps: [],
			exports: '_'
		},
		'lib/jquery': {
			deps: [],
			exports: '$'
		},
		'lib/handlebars': {
			deps: [],
			exports: 'Handlebars'
		}
	}
})

require(['lib/jquery', 'bind/View', 'hb'], function($, View, hb) {
	$(document).ready(function() {
		var ViewModel = function() {
				this.firstName = hb.observable("tim");
				this.lastName =  hb.observable("schaffer");
				this.fullName =  hb.computed(function() {
					return this.firstName() + ' ' + this.lastName();
				}, this);
			}
		
		var viewModel = new ViewModel();
		var view = new View('test-template', viewModel);
		view.appendTo('#app-container');
		
		$('#toggle-names').on('click', function() {
			var first = viewModel.firstName();
			if(first === 'belinda')
				viewModel.firstName('tim');
			else
				viewModel.firstName('belinda');
				
			console.log('first: ' + viewModel.firstName());
			console.log('name: ' + viewModel.fullName());
		})
	});
})