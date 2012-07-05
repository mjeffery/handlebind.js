define(
	['lib/underscore', 'lib/handlebars', 'observe/observable', 'context/BindingContext', 'bind/binder'], 
	function(_, Handlebars, observable, BindingContext, binder) {
	
	Handlebars.helpers['_nobind_with'] = Handlebars.helpers['with'];
	Handlebars.registerHelper('with', function(context, options) {
		var ret = "";
		if(context) {
			var binding = new BindingContext(context, function(value) {
				return options.fn(value);
			});
			
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
