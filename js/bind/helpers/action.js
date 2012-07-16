define(['lib/handlebars', 'bind/context', 'context/Action'], function(Handlebars, context, Action) {
	Handlebars.registerHelper('action', function(target, options) {
		var event = options.hash['event'] || 'click',
			data = context()['$data'],
			fn = options['fn'];
		
		//TODO ensure that context is a function?
		
		if(!fn) {
			// Normal helper mode -- bind the action as a css class 
			var action = new Action(event, target, data);
			
			//context().children.push(action);
			//binder.afterBinding(action.bind, action);
			
			return new Handlebars.SafeString('handlebind="' + action.id() + '"');
		}
		else {
			// Block helper mode -- combine the action with all other class bindings in the block
		}
	});
});
