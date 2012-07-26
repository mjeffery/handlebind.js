define(
['lib/underscore', 
 'lib/jquery',
 'lib/handlebars', 
 'util/BaseObject',
 'context/TemplateContext',
 'bind/context'], 
function(_, $, Handlebars, BaseObject, TemplateContext, context) {
	
	var ViewContext = TemplateContext.extend({
		init: function(options) {
			
			this._super(options);
			
			this._events = {};
			this._handledEvents = [];
			
			this._updateEvents = _.throttle(this._updateEvents, 0);
			this.clean = _.throttle(this.clean, 0);
		},

		registerEvent: function(id, event, callback) {
			var callbacksById = this._events[event];
			if(callbacksById === undefined) 
				this._events[event] = callbacksById = {};
			
			callbacksById[id] = callback;
			
			this._updateEvents();
		},
		
		disposeEvent: function(id, event) {
			var callbacksById = this._events[event];
			if(callbacksById !== undefined && callbacksById.hasOwnProperty(id)) 
				delete callbacksById[id];
				
			this._updateEvents();
		},
		
		_getEventBindings: function(element) {
			var attrs = ['event-id'], //TODO externalize?
				ids = [], id,
				i, len = attrs.length;
			
			for(i = 0; i < len; i++) {
				id = element.attr(attrs[i]);
				if(!_.isString(id))
					ids.push(id);
			}
			
			return ids;
		}
		
	});
	
	var View = BaseObject.extend({
		
		init: function(template, modelview) {
			this._template = template;
			this._modelview = modelview;
		},
		
		appendTo: function(elementOrSelector) {
			
			var rootElement = $(elementOrSelector),
				rootContext = ViewContext.extend({
				
					_eventHandler: function(event) {
						var callbacksById, element, ids, i, len, callback, ret;
						
						callbacksById = this._events[event.type];
						if(callbacksById === undefined)
							return;
						
						element = event.target;
						while(!element.is(rootElement)) { //TODO 'root' refers to nothing-- should be the view element
							ids = this._getEventBinding();
							for(i = 0, len = ids.length; i < len; i++) {
								callback = callbacksById[ids[i]];
								ret = false;
								
								if(_.isFunction(callback)) {
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
						toRemove = _.difference(newEvents, oldEvents),
						toAdd = _.difference(oldEvents, newEvents);
					
					rootElement.off(toRemove.join(' '));
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
			
			this._context = rootContext;
			this._attachedToDom = true; //?? Should this use JQuery to check?
		}
	});
	
	return View;
});
