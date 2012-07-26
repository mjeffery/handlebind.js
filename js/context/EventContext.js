define(['lib/underscore', 'lib/jquery', './BindingContext'], function(_, $, BindingContext) {
	return BindingContext.extend({
		
		init: function(options) {
			this._super(options);
			
			_.defaults(options, { event: 'click', id: _.uniqueId('hb') });
			
			//TODO attach event at ID
			var target = this.target(),
				event = options.event,
				id = options.id;
				
			if(this.$rootContext.registerEvent)
				this.$rootContext.registerEvent(id, event, target);
			
			this._event = options.event;
			this._bind_id = options.id;
		},
		
		dispose: function() {
			this._super();
			
			var id = this._bind_id,
				event = this._event;
			
			if(this.$rootContext.disposeEvent)
				this.$rootContext.disposeEvent(id, event);
		},
		
		targetUpdated: function() {
			var target = this.target(),
				event = this._event,
				id = this._bind_id;
			
			if(this.$rootContext.registerEvent)
				this.$rootContext.registerEvent(id, event, target);
		}
	});
});
