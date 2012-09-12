var Handlebars = require('handlebars'),
	TextContext = require('../../context/TextContext')
	context = require('../context');

Handlebars.registerHelper('text', function(target, options) {
	var ret,
		textContext = new TextContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true)
		});
	
	context(textContext);
	ret = textContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});