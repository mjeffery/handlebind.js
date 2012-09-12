var Handlebars = require('handlebars'),
	context = require('../context'),
	MetamorphContext = require('../../context/MetamorphContext');

Handlebars.registerHelper('html', function(target, options) {
	var ret,
		htmlContext = new MetamorphContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true)
		});
	
	context(htmlContext);
	ret = htmlContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});