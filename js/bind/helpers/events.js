define(
['lib/underscore', 'lib/handlebars', 'context/EventContext', 'bind/context'], 
function(_, Handlebars, EventContext, context) {
	Handlebars.registerHelper('events', function(options) {
		var event, handler, eventContext, id = _.uniqueId('hb');
		
		for(event in options.hash) {
			handler = options.hash[event];
			
			eventContext = new EventContext({
				event: event,
				target: handler,
				id: id,
				parent: context()
			});
		}
		
		return ' event-bind="' + id + '" ';
	});
})
