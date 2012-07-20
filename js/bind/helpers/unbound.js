define(['lib/handlebars', 'context/RenderContext', 'bind/context'], function(Handlebars, RenderContext, context) {

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
