var Handlebars = require('handlebars'),
	PropertyContext = require('../../context/PropertyContext'),
	context = require('../context');

Handlebars.registerHelper('props', function(options) {
	var prop, propContext,
		parent = context(),
		id = _.uniqueId('hb'),
		ret = ' props-bind="' + id + '" ';
	
	for(prop in options.hash) {
		propContext = new PropertyContext({ 
			target: options.hash[prop], 
			parent: parent,
			name: prop,
			bind_name: 'props-bind',
			bind_id: id,
			sharing_bind: true
		});
		
		context(propContext);
		ret += propContext.render();
		context.pop();
	}
	
	return new Handlebars.SafeString(ret);
});