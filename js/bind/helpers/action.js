define(['lib/handlebars', 'bind/binder', 'context/Action'], function(Handlebars, binder, Action) {
	Handlebars.registerHelper('action', function(context, options) {
		var event = options.hash['event'] || 'click',
			data = binder.context()['$data'],
			fn = options['fn'];
		
		//TODO ensure that context is a function?
		
		if(!fn) {
			// Normal helper mode -- bind the action as a css class 
			var action = new Action(event, context, data);
			
			binder.context().children.push(action);
			binder.afterBinding(action.bind, action); //TODO does this need 'action' as a target?
			
			return new Handlebars.SafeString('class="' + action.id() + '"');
		}
		else {
			// Block helper mode -- combine the action with all other class bindings in the block
		}
	});
});
