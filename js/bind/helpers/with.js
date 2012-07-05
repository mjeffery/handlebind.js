define(['lib/handlebars', 'context/BindingContext', 'bind/binder'], function(Handlebars, BindingContext, binder) {
	
	Handlebars.helpers['_nobind_with'] = Handlebars.helpers['with'];
	Handlebars.registerHelper('with', function(context, options) {
		
		var unbound = !!(options.hash['unbound']) || binder.ignoringBindings(),
			ret = "";
			
		if(context) {
			var binding = new BindingContext(context, function(value) {
				return options.fn(value);
			});
			binding.doNotBind = unbound;
				
			binder.pushContext(binding);
			ret = binding.bindContent();
			binder.popContext();

			return ret;
		}
		else 
			ret = Handlebars.helpers['_nobind_with'].call(this, context, options);
			
		return ret;
	});
});
