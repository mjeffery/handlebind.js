define(['lib/handlebars', 'context/BindingContext', 'bind/binder'], function(Handlebars, BindingContext, binder) {
	
	Handlebars.helpers['_nobind_if'] = Handlebars.helpers['if'];
	Handlebars.registerHelper('if', function(context, options) {
		
		var unbound = !!(options.hash['unbound']) || binder.ignoringBindings(),
			ret = "";
			
		if(context) {
			var binding = new BindingContext(context, function(value) {
				if(!value || Handlebars.Utils.isEmpty(value)) {
			    	return options.inverse(this);
			  	} else {
			    	return options.fn(this);
			  	}
			});
			binding.doNotBind = unbound;
				
			binder.pushContext(binding);
			ret = binding.bindContent();
			binder.popContext();

			return ret;
		}
		else 
			ret = Handlebars.helpers['_nobind_if'].call(this, context, options);
			
		return ret;
	});

});