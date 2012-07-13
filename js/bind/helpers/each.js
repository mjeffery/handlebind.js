define(
['lib/handlebars', 'context/BindingContext', 'bind/context'], 
function(Handlebars, BindingContext, context) {
	Handlebars.helpers['_nobind_each'] = Handlebars.helpers['each'];
	Handlebars.registerHelper('each', function(target, options) {
		
		var self = this,
			fn = options.fn, 
			inverse = options.inverse,
			ItemContext = BindingContext.extend({
				renderContent:	function(item) {
					return new Handlebars.SafeString(fn(item));
				}
			}),
			eachContext = BindingContext.extend({
				renderContent: function(items) {
					
					var itemContext, ret = "";
					
					if(items && items.length > 0) {
						for(var i=0, j=items.length; i<j; i++) {
							itemContext = ItemContext.create({
								target: items[i],
								parent: context(),
							});
							
							context(itemContext);
							ret = ret + itemContext.render();
							context.pop();
						}
					} 
					else 
			   			ret = inverse(self);
					
					return ret;
				}
			}).create({
				target: target,
				parent: context(),
				bind: !(options.hash['unbound'] === true)
			}),
			ret = "";
		
		context(eachContext);
		ret = eachContext.render();
		context.pop();
		
		return ret;
	});
});