var Handlebars = require('handlebars'),
	PropertyContext = require('../../context/PropertyContext'),
	context = require('../context');

Handlebars.registerHelper('disabled', function(target, options) {
	var ret,
		DisabledContext = new PropertyContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			name: 'disabled'
		});
	
	
	context(DisabledContext);
	ret = DisabledContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});