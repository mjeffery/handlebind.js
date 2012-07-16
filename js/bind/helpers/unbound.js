define(['lib/handlebars', 'bind/binder'], function(Handlebars, binder) {

	Handlebars.registerHelper('unbound', function(options) {
		var unboundContext = RenderContext.extend({
				render: function() { return options.fn(this); },
			}).invoke({
				target: null,
				bind: false,
				parent: context()
			}),
			ret;
		
		context(unboundContext);
		ret = unboundContext.render();
		context.pop();
		
		return ret;
	});
});
