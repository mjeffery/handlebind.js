define(['lib/underscore', 'lib/handlebars', 'context/AttributesContext', 'bind/context'], function(_, Handlebars, AttributesContext, context) {
	Handlebars.registerHelper('attributes', function(target, options) {
		
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
});
