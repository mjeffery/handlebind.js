var _ = require('underscore'),
	Handlebars = require('handlebars'),
	observable = require('../../observe/observable'),
	context = require('../context'),
	MetamorphContext = require('../../context/MetamorphContext');

var HtmlContext = MetamorphContext.extend({
	renderContent: function(value) {
		return !!value ? new Handlebars.SafeString(value.toString()) : "";
	}
});

Handlebars.registerHelper('html', function(target, options) {
	var ret,
		htmlContext = new HtmlContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true)
		});
	
	context(htmlContext);
	ret = htmlContext.render();
	context.pop();
	
	return ret;
});