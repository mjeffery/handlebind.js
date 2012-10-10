var _ = require('underscore'),
	$ = require('jquery'),
	humble = require('humble'),
	TemplateContext = require('./TemplateContext');

var EVENT_ATTRS = ['event-bind', 'update-bind', 'value-bind', 'focus-bind', 'selected-bind'];

function getEventBindings(element) {
	var attrs = EVENT_ATTRS, 
		ids = [], id,
		i, len = attrs.length;
	
	for(i = 0; i < len; i++) {
		id = element.attr(attrs[i]);
		if(_.isString(id))
			ids.push(id);
	}
	
	return ids;
}

function createEventHandler(context) {
	var eventHandler = function(event) {
		var callbacksById, element, ids, i, len, info, ret;
		
		callbacksById = context._events[event.type];
		if(callbacksById === undefined)
			return;
		
		element = $(event.target);
		while(!element.is(context._element)) {
			ids = getEventBindings(element);
			for(i = 0, len = ids.length; i < len; i++) {
				info = callbacksById[ids[i]];
				ret = undefined;
				
				if(info && _.isFunction(info.callback)) { //TODO probably need to instrument event with proper target, currentTarget info
					ret = info.callback(event, info.data);
				}
			}
			
			if(ret === false)
				return false;
			else if(event.isPropagationStopped())
				return;
			else {
				element = element.parent(); 
				if(element.length == 0) //element has no parent (for some reason)
					return;
			}
		}
	};
	
	return eventHandler;
}

var ViewContext = TemplateContext.extend({
	init: function(options) {
		this._super(options);
		
		this._element = options.element;
		this._events = {};
		this._handledEvents = [];
		
		this._isAttached = false;
		this._postRenderCallbacks = [];
		//this.clean = _.throttle(this.clean, 1); //TODO testing-- does this defer correctly?
		
		this._eventHandler = createEventHandler(this);
	},
	
	clean: function() {
		this._super();
		this._updateFocus();
		this._postRender();
	},
	
	dispose: function() {
		//clean up all event listeners
		this._events = {};
		this._updateEvents();
		
		//remove the surrounding metamorph
		var metamorph = this._metamorph;
		if(metamorph && !metamorph.isRemoved()) 
			metamorph.remove();
		
		this._super();
	},

	registerEvent: function(id, event, callback, data) {
		var callbacksById = this._events[event];
		if(callbacksById === undefined) 
			this._events[event] = callbacksById = {};
		
		callbacksById[id] = { 
			callback: callback,
			data: data 
		};
		
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
	
	setFocus: function(elementOrSelector) {
		//TODO verify this is a DOM element, JQuery element with length > 0 (???), or a string
		this._toFocus = elementOrSelector;
	},
	
	doPostRender: function(callback, context) {
		if(_.isFunction(callback)) {
			this._postRenderCallbacks.push({
				callback: callback,
				context: context
			});
		}
	},
	
	_updateFocus: function() {
		if(this._toFocus) {
			var activeElement = $( document.activeElement ),
				element = $(this._toFocus).get(0), //TODO this may index out of bounds?
				isFocused = activeElement.is(element);
			
			if(!isFocused)
				element.focus();
				
			this._toFocus = null;
		}
	},

	_updateEvents: function() {
		var oldEvents = this._handledEvents,
			newEvents = _.keys(this._events),
			toAdd = _.difference(newEvents, oldEvents),
			toRemove = _.difference(oldEvents, newEvents);
		
		if(toRemove.length > 0)
			this._element.off(toRemove.join(' '));
		if(toAdd.length > 0)
			this._element.on(toAdd.join(' '), this._eventHandler);
		
		this._handledEvents = newEvents;
	},
		
	_postRender: function() {
		var callbacks = this._postRenderCallbacks.splice(0, this._postRenderCallbacks.length);
		_.each(callbacks, function(postRender) {
			postRender.callback.call(postRender.context);
		});
	}
});

module.exports = ViewContext;