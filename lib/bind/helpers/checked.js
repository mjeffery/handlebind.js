var Handlebars = require('handlebars'),
	dom = require('../../util/dom'),
	UpdatingContext = require('../../context/UpdatingContext'),
	context = require('../context');

var CheckedContext = UpdatingContext.extend({
	
	renderValue: function(value) {
		return !!value ? ' checked ' : ' ';
	},
	
	pushValue: function(value) {
		dom.boundElement(this).prop('checked', !!value);
	},
	
	pullValue: function() {
		return dom.boundElement(this).prop('checked');
	}
});

Handlebars.registerHelper('checked', function(target, options) {
	var ret,
		checkContext = new CheckedContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true)
		});
	
	context(checkContext);
	ret = checkContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});