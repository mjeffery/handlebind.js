define(['lib/handlebars', 'bind/context', 'context/ActionContext'], function(Handlebars, context, ActionContext) {
	Handlebars.registerHelper('action', function(target, options) {

		var fn = options['fn'];
		if(!fn) {
			
			
			var actionContext = new ActionContext({
				target: target,
				parent: context(),
				event: options.hash['event'] || 'click'//,
				//data: context().$data,
			});
			
			context(actionContext);
			var ret = actionContext.render(); 
			context.pop();
			
			return ret;
		}
		else {
			// Block helper mode -- combine the action with all other class bindings in the block
		}
	});
});
