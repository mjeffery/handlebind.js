define(['lib/underscore', 'lib/handlebars', 'bind/context', 'context/AttributeContext'], function(_, Handlebars, context, AttributeContext) {
	
	var ClassContext = AttributeContext.extend({
		init: function(options) {	
			options.bind_name = 'css-bind';
			options.bind_id = _.uniqueId('hb');
			options.name = 'class';
			this._super(options);
		},
		
		render: function() {
			var ret = "";
			
			if(this.bound())
				ret += this._bind_name + '="' + this._bind_id + '" ';
			ret += this._super();
			
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
});
