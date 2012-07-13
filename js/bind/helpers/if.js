define(['lib/handlebars', 'context/BindingContext', 'bind/binder'], function(Handlebars, BindingContext, binder) {
	
	Handlebars.helpers['_nobind_if'] = Handlebars.helpers['if'];
	Handlebars.registerHelper('if', function(target, options) {
		
		var ret = "",
			ifContext = new BindingContext.extend({
				renderContent: function(value) {
					var result = "";
					if(!value || Handlebars.Utils.isEmpty(value))
				    	result = options.inverse(self);
				  	else 
				    	result = options.fn(self);
				    	
				    return new Handlebars.SafeString(result);
				}
			})({
				target: target,
				parent: context(),
				bind: !(options.hash['unbound'] === true) 
			});

		context(ifContext);
		ret = ifContext.render();
		context.pop();
		
		return ret;
	});
});