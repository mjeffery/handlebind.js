define(
['lib/underscore', 'lib/handlebars', 'context/BindingContext', 'bind/context'], 
function(_, Handlebars, BindingContext, context) {
	
	var ValueContext = BindingContext.extend({
		renderContent: function(value) {
			return !!value ? Handlebars.Utils.escapeExpression(value.toString()) : "";
		}
	});
	
	Handlebars.registerHelper('value', function(target, options) {
		var ret,
			valueContext = new ValueContext({ 
				target: target, 
				parent: context(),
				bind: !(options.hash['unbound'] === true)
			});
		
		context(valueContext);
		ret = valueContext.render();
		context.pop();
		
		return ret;
	});
});
