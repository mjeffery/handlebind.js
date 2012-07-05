define(
['lib/underscore', 'lib/handlebars', 'observe/observable', 'bind/binder', 'context/BindingContext'], 
function(_, Handlebars, observable, binder, BindingContext) {
	Handlebars.registerHelper('value', function(context, options) {
		
		var unbound = !!(options.hash['unbound']) || binder.ignoringBindings();

		if(!!context && _.isSubscribable(context) && !unbound) {
			var binding = new BindingContext(context, function(value) {
				return !!value ? Handlebars.Utils.escapeExpression(value.toString()) : "";
			});
			
			binder.pushContext(binding);
			var ret = binding.bindContent();
			binder.popContext();
			
			return ret;
		}
		else {
			if(!context) 
				return "";
			else {
				var ret = _.isFunction(context) ? context().toString() : context.toString();
				return Handlebars.Utils.escapeExpression(ret);
			}
		}
	})
});
