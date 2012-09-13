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
		this._postRenderCallbacks = [];
		//this.clean = _.throttle(this.clean, 1); //TODO testing-- does this defer correctly?
	},
	
	clean: function() {
		this._super();
		this._updateFocus();
		this._postRender();
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
	
	_getEventBindings: function(element) {
		var attrs = ['event-bind', 'update-bind', 'value-bind', 'focus-bind', 'selected-bind'], 
			ids = [], id,
			i, len = attrs.length;
		
		for(i = 0; i < len; i++) {
			id = element.attr(attrs[i]);
			if(_.isString(id))
				ids.push(id);
		}
		
		return ids;
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
	
	_postRender: function() {
		var callbacks = this._postRenderCallbacks.splice(0, this._postRenderCallbacks.length);
		_.each(callbacks, function(postRender) {
			postRender.callback.call(postRender.context);
		});
	}
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
					var callbacksById, element, ids, i, len, info, ret;
					
					callbacksById = rootContext._events[event.type];
					if(callbacksById === undefined)
						return;
					
					element = $(event.target);
					while(!element.is(rootElement)) {
						ids = rootContext._getEventBindings(element);
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
		rootContext._updateFocus();
		rootContext._postRender();
		
		this._context = rootContext;
	}
});

module.exports = View;