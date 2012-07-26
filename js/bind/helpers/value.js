define(
['lib/underscore', 'lib/handlebars', 'context/ValueContext', 'bind/context'], 
function(_, Handlebars, ValueContext, context) {
	
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
		
		return new Handlebars.SafeString(ret);
	});
});
