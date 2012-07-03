define(
	['lib/underscore', 'lib/handlebars', 'observe/observable', 'context/BindingContext', 'bind/binder'], 
	function(_, Handlebars, observable, BindingContext, binder) {
	
	Handlebars.helpers['_nobind_with'] = Handlebars.helpers['with'];
	Handlebars.registerHelper('with', function(context, options) {
		var ret = "";
		if(context) {

			if(_.isFunction(context)) {
				if(_.isObservable(context)) {
					
				}
					
			}
			
			var newContext = new BindingContext(context);
			binder.pushContext(newContext);
			
			//TODO listen for dependencies?
			
			ret = options.fn(context);
			
			//TODO stop listening for dependencies
			
			binder.popContext();
		}
		else 
			ret = Handlebars.helpers['_nobind_with'].call(this, context, options);
			
		return ret;
	});
});
