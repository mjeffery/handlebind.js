var _ = require('underscore'),
	Handlebars = require('handlebars'),
	EventContext = require('../../context/EventContext'),
	context = require('../context');
	
Handlebars.registerHelper('events', function(options) {
	var event, handler, eventContext,
		parent = context(),
		data = parent.target(),
		id = _.uniqueId('hb');
	
	for(event in options.hash) {
		handler = options.hash[event];
		
		eventContext = new EventContext({
			event: event,
			target: handler,
			data: _.isFunction(data) ? data() : data, //TODO extract subscribable? 
			id: id,
			parent: parent
		});
	}
	
	return new Handlebars.SafeString(' event-bind="' + id + '" ');
});