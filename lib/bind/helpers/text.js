var _ = require('underscore'),
	Handlebars = require('handlebars'),
	MetamorphContext = require('../../context/MetamorphContext')
	context = require('../context');
 
var ValueContext = MetamorphContext.extend({
	renderContent: function(value) {
		return !!value ? Handlebars.Utils.escapeExpression(value.toString()) : "";
	}
});

Handlebars.registerHelper('text', function(target, options) {
	var ret,
		valueContext = new ValueContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true)
		});
	
	context(valueContext);
	ret = valueContext.render();
	context.pop();
	
	return ret;
});