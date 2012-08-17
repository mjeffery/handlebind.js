var _ = require('underscore'),
	$ = require('jquery'),
	Handlebars = require('handlebars'),
	humble = require('humble'),
	TemplateContext = require('../context/TemplateContext'),
	context = require('./context');
	
	
var ViewContext = TemplateContext.extend({
	init: function(options) {
		this._super(options);
		
		this._events = {};
		this._handledEvents = [];
		
		this._isAttached = false;
		//this.clean = _.throttle(this.clean, 1); //TODO testing-- does this defer correctly?
	},

	registerEvent: function(id, event, callback) {
		var callbacksById = this._events[event];
		if(callbacksById === undefined) 
			this._events[event] = callbacksById = {};
		
		callbacksById[id] = callback;
		
		if(this._isAttached)
			this._updateEvents();
	},
	
	disposeEvent: function(id, event) {
		var callbacksById = this._events[event];
		if(callbacksById !== undefined && callbacksById.hasOwnProperty(id)) 
			delete callbacksById[id];
			
		if(this._isAttached)
			this._updateEvents();
	},
	
	_getEventBindings: function(element) {
		var attrs = ['event-bind', 'value-bind'], //TODO externalize?
			ids = [], id,
			i, len = attrs.length;
		
		for(i = 0; i < len; i++) {
			id = element.attr(attrs[i]);
			if(_.isString(id))
				ids.push(id);
		}
		
		return ids;
	},
});

var View = humble.Object.extend({
	
	init: function(template, modelview) {
		this._template = template;
		this._modelview = modelview;
	},
	
	appendTo: function(elementOrSelector) {
		
		var rootElement = $(elementOrSelector),
			rootContext = ViewContext.extend({
			
				_eventHandler: function(event) {
					var callbacksById, element, ids, i, len, callback, ret;
					
					callbacksById = rootContext._events[event.type];
					if(callbacksById === undefined)
						return;
					
					element = $(event.target);
					while(!element.is(rootElement)) {
						ids = rootContext._getEventBindings(element);
						for(i = 0, len = ids.length; i < len; i++) {
							callback = callbacksById[ids[i]];
							ret = false;
							
							if(_.isFunction(callback)) { //TODO probably need to instrument event with proper target, currentTarget info
								ret = callback(event) || ret;
								if(event.isPropagationStopped())
									ret = false;
							}
						}
						
						if(ret !== true)
							return false;
						else
							element = element.parent(); 
					}
			},
			
			_updateEvents: function() {
				var oldEvents = this._handledEvents,
					newEvents = _.keys(this._events),
					toAdd = _.difference(newEvents, oldEvents),
					toRemove = _.difference(oldEvents, newEvents);
				
				if(toRemove.length > 0)
					rootElement.off(toRemove.join(' '));
				if(toAdd.length > 0)
					rootElement.on(toAdd.join(' '), this._eventHandler);
				
				this._handledEvents = newEvents;
			}
		}).invoke({
			target: this._modelview,
			template: this._template,
			context: this._modelview
		});
			
		context(rootContext);
		$(rootContext.render()).appendTo(rootElement);
		context.pop();
		
		rootContext._isAttached = true;
		rootContext._updateEvents();
		
		this._context = rootContext;
	}
});

module.exports = View;