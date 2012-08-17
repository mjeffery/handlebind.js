var _ = require('underscore'),
	$ = require('jquery'),
	Handlebars = require('handlebars'),
	RenderContext = require('../../context/RenderContext'),
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
					element = $('[' + this._bind_name + '="' + this._bind_id + '"]');
					value ? element.focus() : element.blur();
				}
			}
		},
		
		_bindEvents: function(target) {	//TODO detect target changing?		
			this.disposeChildren();
			
			function focusUpdated(isFocused) {
				var activeElement = $( document.activeElement ),
					element = $('[' + this._bind_name + '="' + this._bind_id + '"]');
					
				isFocused = element.is(activeElement);
				
				if(_.isSubscribable(target)) {		
					this._updating_target = true;		
					target(isFocused);
					this._updating_target = false;
				}
			}
			
			function bindEvent(event, callback) {
				new EventContext({
					id: this._bind_id,
					event: event,
					target: callback,
					parent: this
				});
			}
			
			var focus = focusUpdated.bind(this, true),
				blur = focusUpdated.bind(this, false),
				bind = bindEvent.bind(this);
		
			bind('focus', focus);
			bind('focusin', focus);
			bind('blur', blur);
			bind('focusout', blur);
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
