var _ = require('underscore'),
	Handlebars = require('handlebars'),
	AttributeContext = require('../../context/AttributeContext'),
	context = require('../context');	

Handlebars.registerHelper('attrs', function(options) {
	var attr, attrContext,
		parent = context(),
		id = _.uniqueId('hb'),
		ret = ' attr-bind="' + id + '" ';
	
	for(attr in options.hash) {
		attrContext = new AttributeContext({ 
			target: options.hash[attr], 
			parent: parent,
			name: attr,
			bind_name: 'attr-bind',
			bind_id: id,
			sharing_bind: true
		});
		
		context(attrContext);
		ret += attrContext.render();
		context.pop();
	}
	
	return new Handlebars.SafeString(ret);
});
