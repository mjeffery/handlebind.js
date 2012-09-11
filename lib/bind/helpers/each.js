var Handlebars = require('handlebars'),
	MetamorphContext = require('../../context/MetamorphContext'),
	context = require('../context');
	
Handlebars.helpers['_nobind_each'] = Handlebars.helpers['each'];
Handlebars.registerHelper('each', function(target, options) {
	
	var self = this,
		fn = options.fn, 
		inverse = options.inverse,
		ItemContext = MetamorphContext.extend({ //TODO init() --  assign the index property to the value of options[index]
			renderContent:	function(item) {
				return new Handlebars.SafeString(fn(item));
			}
		}),
		eachContext = MetamorphContext.extend({
			renderContent: function(items) {
				
				var itemContext, ret = "";
				
				if(items && items.length > 0) {
					for(var i=0, j=items.length; i<j; i++) {
						itemContext = ItemContext.invoke({
							target: items[i],
							parent: context(),
							index: i,
							symbol: options.hash['itemSymbol']
						});
						
						context(itemContext);
						ret = ret + itemContext.render();
						context.pop();
					}
				} 
				else 
		   			ret = inverse(self);
				
				return new Handlebars.SafeString(ret);
			}
		}).invoke({
			target: target,
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			symbol: options.hash['symbol']
		}),
		ret = "";
	
	context(eachContext);
	ret = eachContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});