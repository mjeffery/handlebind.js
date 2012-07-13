define(
['lib/underscore', 'lib/handlebars', 'observe/observable', 'bind/context', 'context/BindingContext'], 
function(_, Handlebars, observable, binder, BindingContext) {
	
	var HtmlContext = BindingContext.extend({
		renderContent: function() {
			return !!value ? new Handlebars.SafeString(value.toString()) : "";
		}
	});
	
	Handlebars.registerHelper('html', function(target, options) {
		var ret,
			htmlContext = HtmlContext.create({ 
				target: target, 
				parent: context(),
				bind: !(options.hash['unbound'] === true)
			});
		
		context(htmlContext);
		ret = htmlContext.render();
		context.pop();
		
		return ret;
	});
});