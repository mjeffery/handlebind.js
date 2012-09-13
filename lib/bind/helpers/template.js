var Handlebars = require('handlebars'),
	TemplateContext = require('../../context/TemplateContext'),
	context = require('../context');

Handlebars.registerHelper('template', function(target, options) {
	var ret,
		templateContext = new TemplateContext({
			target: target,
			context: options.hash['context'] || this,
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			symbol: options.hash['symbol']
		});
		
	context(templateContext);
	ret = templateContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});