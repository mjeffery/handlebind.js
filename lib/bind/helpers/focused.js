var Handlebars = require('handlebars'),
	FocusContext = require('../../context/FocusContext'),
	context = require('../context');

Handlebars.registerHelper('focused', function(target, options) {
	var ret,
		focusContext = new FocusContext({
			target: target,
			parent: context()
		});
	
	context(focusContext);
	ret = focusContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});
