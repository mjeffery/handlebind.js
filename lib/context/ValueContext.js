var _ = require('underscore'),
	$ = require('jquery'),
	nullSafe = require('../util/nullSafe'),
	RenderContext = require('./RenderContext');

var VALID_UPDATES = ['change', 'keypress', 'keyup']; // 'afterkeydown' should be here for immediate updating
	
var ValueContext = RenderContext.extend({
		
	init: function(options) {
		this._super(options);
		
		_.defaults(options, { update: 'change' });
		
		if(!_.include(VALID_UPDATES, options.update))
			throw new Error('The update policy "' + options.update + '" is not supported by {{value}}');
			
		this._bind_id = _.uniqueId('hb');
		this._updatePolicy = options.update;	
	},
	
	render: function() {
		var target = this.target(),
			value = nullSafe.toString(_.isFunction(target) ? target() : target)
			id = this._bind_id;
		
		this._registerEvent(target);
		
		return ' value-bind="' + id + '" value="' + value + '"';
	},
	
	rerender: function() {
		if(this.bound()) {					
			var target = this.target(),
				value = nullSafe.toString(_.isFunction(target) ? target() : target),
				id = this._bind_id,
				event = this._updatePolicy;
			
			this._disposeEvent();
			this._registerEvent(target);
			
			$('[value-bind="' + this._bind_id + '"]').attr('value', value);
		}
	},
	
	dispose: function() {
		this._disposeEvent();
		this._super();
	},
	
	_registerEvent: function(target) { //TODO set this up to handle 'afterkeydown' delegation
		var id = this._bind_id,
			event = this._updatePolicy;
		
		if(this.$rootContext.registerEvent && _.isSubscribable(target)) {
			this.$rootContext.registerEvent(id, event, function() {
				target($('[value-bind="' + id +'"]').attr('value'));
			});
		}
	},
	
	_disposeEvent: function() {
		var id = this._bind_id,
			event = this._updatePolicy; // 'afterkeydown' === this._updatePolicy ? 'keydown' : this._updatePolicy; 
		
		if(this.$rootContext.disposeEvent)
			this.$rootContext.disposeEvent(id, event);
	}
});

module.exports = ValueContext;