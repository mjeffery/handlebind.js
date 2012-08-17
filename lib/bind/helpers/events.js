var _ = require('underscore'),
	Handlebars = require('handlebars'),
	EventContext = require('../../context/EventContext'),
	context = require('../context');
	
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
	
	return new Handlebars.SafeString(' event-bind="' + id + '" ');
});