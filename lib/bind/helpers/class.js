var _ = require('underscore'),
	Handlebars = require('handlebars'),
	context =require('../context'),
	AttributeContext = require('../../context/AttributeContext');
	
var ClassContext = AttributeContext.extend({
	init: function(options) {	
		options.bind_name = 'css-bind';
		options.bind_id = _.uniqueId('hb');
		options.name = 'class';
		this._super(options);
	},
	
	render: function() {
		var ret = this._super() + ' ';
		
		if(this.bound())
			ret += this._bind_name + '="' + this._bind_id + '" ';
		
		return new Handlebars.SafeString(ret);
	}
});

Handlebars.registerHelper('class', function(target, options) {
	var ret,
		classContext = new ClassContext({
			target: target,
			parent: context(),
			bind: !(options.hash['unbound'] === true)
		});
	
	context(classContext);
	ret = classContext.render();
	context.pop();
	
	return ret;
});

