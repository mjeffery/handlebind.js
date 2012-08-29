var _ = require('underscore'),
	$ = require('jquery'),
	RenderContext = require('./RenderContext');
	
var UpdatingContext = RenderContext.extend({
		
	init: function(options) {
		this._super(options);
		
		_.defaults(options, { 
			bind_name: 'update-bind',
			bind_id: _.uniqueId('hb'),
			update: 'change' 
		});
	
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
		this._updatePolicy = options.update;	
		this._is_updating = false;
	},
	
	renderValue: function(value) {
		throw new Error('UpdatingContext is an abstract type and does not implement method "renderValue"');
	},
	
	pushValue: function(value) {
		throw new Error('UpdatingContext is an abstract type and does not implement method "pushValue"');
	},
	
	pullValue: function() {
		throw new Error('UpdatingContext is an abstract type and does not implement method "pullValue"');
	},
	
	render: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target,
			name = this._bind_name,
			id = this._bind_id;
		
		this._registerEvent(target);
		
		return ' ' + name + '="' + id + '" ' + this.renderValue(value);
	},
	
	rerender: function() {
		if(this.bound() && !this._is_updating) {					
			var target = this.target(),
				value = _.isFunction(target) ? target() : target;
			
			this._disposeEvent();
			this._registerEvent(target);
			
			this.pushValue(value);
		}
	},
	
	dispose: function() {
		this._disposeEvent();
		this._super();
	},
	
	_registerEvent: function(target) {
		var id = this._bind_id,
			event = this._updatePolicy,
			self = this;
			
		if(this.$rootContext.registerEvent && _.isSubscribable(target)) {
			this.$rootContext.registerEvent(id, event, function() {
				self._is_updating = true;
				target(self.pullValue());
				self._is_updating = false;
				
				return true;
			});
		}
	},
	
	_disposeEvent: function() {
		var id = this._bind_id,
			event = this._updatePolicy;
		
		if(this.$rootContext.disposeEvent)
			this.$rootContext.disposeEvent(id, event);
	}
});

module.exports = UpdatingContext;