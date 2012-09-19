var _ = require('underscore'),
	Handlebars = require('handlebars'),
	AttributesContext = require('../../context/AttributeContext'),
	context = require('../context');	

Handlebars.registerHelper('attrs', function(target, options) {
	
	var ret,
		attributesContext = new AttributesContext({
			target: target === undefined ? (options.hash || {}) : target,
			parent: context
		});
	
	context(attributesContext);
	ret = attributesContext.render();
	context.pop();
	
	return ret;
});
