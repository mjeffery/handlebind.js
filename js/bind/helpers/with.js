define(
['lib/handlebars', 'context/BindingContext', 'bind/context'], 
function(Handlebars, BindingContext, context) {
	Handlebars.helpers['_nobind_with'] = Handlebars.helpers['with'];
	Handlebars.registerHelper('with', function(target, options) {

		var ret,
			withContext = new BindingContext.extend({
				renderContent: function(value) {
					return options.fn(value);
				}
			})({
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
