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
				var self = this;
			
				this.firstName = hb.observable("tim");
				this.lastName =  hb.observable("schaffer");
				this.fullName =  hb.computed(function() {
					return '<b>' + this.firstName() + ' ' + this.lastName() + '</b>';
				}, this);
				
				this.showNested = hb.observable(true);
				
				this.toggleNames = function() {
					var first = self.firstName();
					if(first === 'belinda')
						self.firstName('tim');
					else
						self.firstName('belinda');
						
					console.log('first: ' + viewModel.firstName());
					console.log('name: ' + viewModel.fullName());
				};
				
				this.toggleNested = function() {
					self.showNested(!self.showNested());
					console.log('show:' + self.showNested());
				};
				
				this.nested = {
					firstName: hb.observable('lola'),
					lastName: hb.observable('perkins')
				}
				this.nested.fullName=  hb.computed(function() {
					return '<b>' + this.firstName() + ' ' + this.lastName() + '</b>';
				}, this.nested);
			}
		
		var viewModel = new ViewModel();
		var view = new View('test-template', viewModel);
		view.appendTo('#app-container');
	});
})