var Handlebars = require('handlebars'),
	PropertyContext = require('../../context/PropertyContext'),
	context = require('../context');

Handlebars.registerHelper('disabled', function(target, options) {
	var ret,
		disabledContext = new PropertyContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			name: 'disabled'
		});
	
	context(disabledContext);
	ret = disabledContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});