define(
['lib/handlebars', 'context/MetamorphContext', 'bind/context'], 
function(Handlebars, MetamorphContext, context) {
	Handlebars.helpers['_nobind_with'] = Handlebars.helpers['with'];
	Handlebars.registerHelper('with', function(target, options) {

		var ret,
			withContext = MetamorphContext.extend({
				renderContent: function(value) {
					if(value)
						return options.fn(value);
					else
						return options.inverse(value);
				}
			}).invoke({
				target: target,
				parent: context(),
				bind: !(options.hash['unbound'] === true)
			});
			
		context(withContext);
		ret = withContext.render();
		context.pop();
		
		return ret;
	});
});
