var Handlebars = require('handlebars'),
	PropertyContext = require('../../context/PropertyContext'),
	context = require('../context');

Handlebars.registerHelper('checked', function(target, options) {
	var ret,
		CheckedContext = new PropertyContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			name: 'checked'
		});
	
	context(CheckedContext);
	ret = CheckedContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});