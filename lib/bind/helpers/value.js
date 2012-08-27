var _ = require('underscore'),
	Handlebars = require('handlebars'),
	ValueContext = require('../../context/ValueContext'),
	context = require('../context');

Handlebars.registerHelper('value', function(target, options) {
	var ret,
		valueContext = new ValueContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			update: options.hash['update']
		});
	
	context(valueContext);
	ret = valueContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});