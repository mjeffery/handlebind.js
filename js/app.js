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
					return this.firstName + ' ' + this.lastName;
				}, this);
			}
			
		var view = new View('test-template', new ViewModel());
		view.appendTo('body');
	});
})