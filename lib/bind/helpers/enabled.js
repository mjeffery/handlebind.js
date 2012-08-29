var Handlebars = require('handlebars'),
	PropertyContext = require('../../context/PropertyContext'),
	context = require('../context');

var AntiPropertyContext = PropertyContext.extend({
	target: function() {
		var target = this._super(),
			value = _.isFunction(target) ? target() : target;
		return !value;
	}
});

Handlebars.registerHelper('enabled', function(target, options) {
	var ret,
		EnabledContext = new AntiPropertyContext({ 
			target: target, 
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			name: 'disabled'
		});
	
	context(EnabledContext);
	ret = EnabledContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});
