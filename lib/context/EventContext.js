var _ = require('underscore'),
	$ = require('jquery'),
	BindingContext = require('./BindingContext');
	
var EventContext = BindingContext.extend({
	
	init: function(options) {
		this._super(options);
		
		_.defaults(options, { event: 'click', id: _.uniqueId('hb') });
		
		var data = options.data
			target = this.target(),
			event = options.event,
			id = options.id;
			
		if(this.$rootContext.registerEvent)
			this.$rootContext.registerEvent(id, event, target, data);
		
		this._data = data;
		this._event = event;
		this._bind_id = id;
	},
	
	dispose: function() {
		this._super();
		
		var id = this._bind_id,
			event = this._event;
		
		if(this.$rootContext.disposeEvent)
			this.$rootContext.disposeEvent(id, event);
	},
	
	targetUpdated: function() {
		var data = this._data,
			target = this.target(), //TODO update target to resolve paths for both data and the method
			event = this._event,
			id = this._bind_id;
		
		if(this.$rootContext.registerEvent)
			this.$rootContext.registerEvent(id, event, target, data);
	}
});

module.exports = EventContext;