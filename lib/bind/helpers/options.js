var _ = require('underscore'),
	$ = require('jquery'),
	Handlebars = require('handlebars'),
	OptionsContext = require('../../context/OptionsContext'),
	context = require('../context');

Handlebars.registerHelper('options', function(target, options) {
	var ret,
		selectContext = new OptionsContext({
			target: target,
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			text: options.hash['text'],	
			caption: options.hash['caption'],
			selected: options.hash['selected']
		});
		
	context(selectContext);
	ret = selectContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});
