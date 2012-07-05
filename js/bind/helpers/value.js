define(
['lib/underscore', 'lib/handlebars', 'observe/observable', 'bind/binder', 'context/BindingContext'], 
function(_, Handlebars, observable, binder, BindingContext) {
	Handlebars.registerHelper('value', function(context, options) {
		if(!!context && _.isSubscribable(context) && !binder.ignoringBindings()) {
			var binding = new BindingContext(context, function(value) {
				return !!value ? value.toString() : "";
			});
			
			binder.pushContext(binding);
			var ret = binding.bindContent();
			binder.popContext();
			
			return ret;
		}
		else
			return !!context ? context.toString() : "";
	})
});
