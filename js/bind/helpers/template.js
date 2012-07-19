define(['lib/handlebars', 'context/TemplateContext', 'bind/context'], function(Handlebars, TemplateContext, context) {
	Handlebars.registerHelper('template', function(target, options) {
		var ret,
			templateContext = new TemplateContext({
				target: target,
				context: options.hash['context'] || this,
				parent: context(),
				bind: !(options.hash['unbound'] === true)
			});
			
		context(templateContext);
		ret = templateContext.render();
		context.pop();
		
		return ret;
	});
});
