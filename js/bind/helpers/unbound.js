define(['lib/handlebars', 'bind/binder'], function(Handlebars, binder) {
	Handlebars.registerHelper('unbound', function(options) {
		binder.stopBinding();
		var ret = options.fn(this);
		binder.resumeBinding();
		
		return ret;
	});
});
