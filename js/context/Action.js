define(['lib/underscore'], function(_) {
	
	
	
	function Action(event, handler, data) {
		this._id = _.uniqueId('action');
		
		this._event = event || 'click'; //TODO make sure that event is a string
		this._handler = handler; //TODO make sure that this a function
		this._data = data; 
		
		this._isAttached = false;
	};
	
	_.extend(Action.prototype, {
		
		id: function() {return this._id },
		
		bind: function() {
			$('[handlebind~="' + this._id + '"]').on(this._event, this._data, this._handler);
			this._isAttached = true;
		},
		
		dispose: function() {
			$('[handlebind~="' + this._id + '"]').on(this._event, this._data, this._handler);
		}
	});
	
	return Action;
});
