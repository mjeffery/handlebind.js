var _ = require('underscore'),
	$ = require('jquery'),
	Handlebars = require('handlebars'),
	RenderContext = require('../../context/RenderContext'),
	EventContext = require('../../context/EventContext'),
	context = require('../context');
	
var HasFocusContext = RenderContext.extend({
	
		init: function(options) {
			this._super(options);
			
			_.defaults(options, { 
				bind_name: 'focus-bind',
				bind_id: _.uniqueId('hb') 
			});
			
			this._bind_name = options.bind_name;
			this._bind_id = options.bind_id;
			
			this._updating_target = false;
		},
		
		render: function() {
			var target = this.target(),
				value = _.isFunction(target) ? target() : target;
			
			if(this.bound())
				this._bindEvents(target);
			
			//if(!!value //TODO 
			
			return new Handlebars.SafeString(this._bind_name + '="' + this._bind_id + '" ');
		},
		
		rerender: function() { // This is not a very 'descriptive' name for what is happening here
			if(!this._updating_target) {
				var target = this.target(),
					value = _.isFunction(target) ? target() : target,
					element;
					
				this._bindEvents(target);
				
				if(this.bound()) {
					element = $('[' + this._bind_name + '="' + this._bind_id + '"]').get(0);
					value ? element.focus() : element.blur();
				}
			}
		},
		
		_bindEvents: function(target) {	//TODO detect target changing?		
			var self = this;
			
			this.disposeChildren();
			
			function focusUpdated(isFocused) {
				var activeElement = $( document.activeElement ),
					element = $('[' + self._bind_name + '="' + self._bind_id + '"]').get(0);
					
				isFocused = element.is(activeElement);
				
				if(_.isSubscribable(target)) {		
					self._updating_target = true;		
					target(isFocused);
					self._updating_target = false;
				}
			}
			
			function bindEvent(event, callback) {
				new EventContext({
					id: self._bind_id,
					event: event,
					target: callback,
					parent: self
				});
			}
		
			bindEvent('focus', function() { focus(true) });
			bindEvent('blur', function() { focus(false) });
		}
	});

Handlebars.registerHelper('hasFocus', function(target, options) {
	var ret,
		focusContext = new HasFocusContext({
			target: target,
			parent: context()
		});
	
	context(focusContext);
	ret = focusContext.render();
	context.pop();
	
	return ret;
});
