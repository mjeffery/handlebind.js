define(['lib/handlebars', 'context/BindingContext', 'bind/binder'], function(Handlebars, BindingContext, binder) {
	
	Handlebars.helpers['_nobind_each'] = Handlebars.helpers['each'];
	Handlebars.registerHelper('each', function(context, options) {
		
		var unbound = !!(options.hash['unbound']) || binder.ignoringBindings(),
			ret = "";
			
		if(context) {
			var self = this,
			    binding = new BindingContext(context, function(items) {
					var fn = options.fn, inverse = options.inverse;
					var ret = "";
					
					if(items && items.length > 0) {
						for(var i=0, j=items.length; i<j; i++) {
							var itemBinding = new BindingContext(items[i], function(item) {
								return new Handlebars.SafeString(fn(item));
							});
							
							binder.pushContext(itemBinding);
							ret = ret + binder.bindContent();
							binder.popContext();
						}
					} 
					else 
			   			ret = inverse(self);
					
					return ret;
				});
			binding.doNotBind = unbound;
				
			binder.pushContext(binding);
			ret = binding.bindContent();
			binder.popContext();
		}
		else 
			ret = Handlebars.helpers['_nobind_each'].call(this, context, options);
			
		return ret;
	});
});