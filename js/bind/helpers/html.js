define(
['lib/underscore', 'lib/handlebars', 'observe/observable', 'bind/binder', 'context/BindingContext'], 
function(_, Handlebars, observable, binder, BindingContext) {
	Handlebars.registerHelper('html', function(context, options) {
		if(!!context && _.isSubscribable(context) && !binder.ignoringBindings()) {
			var binding = new BindingContext(context, function(value) {
				return !!value ? new Handlebars.SafeString(value.toString()) : "";
			});
			
			binder.pushContext(binding);
			var ret = binding.bindContent();
			binder.popContext();
			
			return ret;
		}
		else {
			if(!context) 
				return "";
			else 
				return new Handlebars.SafeString((_.isFunction(context)) ? context().toString() : context.toString());
		}
	})
});