var _ = require('underscore'),
	$ = require('jquery'),
	RenderContext = require('./RenderContext');

var PropertyContext = RenderContext.extend({
	
	init: function(options) {
		
		this._super(options);
		
		_.defaults(options, {
			bind_name: 'prop-bind',
			bind_id: _.uniqueId('hb'),
			name: _.uniqueId('undefined_prop')
		});
		
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
		this._name = options.name;
	},
	
	render: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target;
			
		return ' ' + this._bind_name + '="' + this._bind_id + '" ' + (!!value ? this._name + " " : " ");
	},
	
	rerender: function() {
		if(this.bound()) {
			var target = this.target(),
				value = _.isFunction(target) ? target() : target;
				
			$('['+ this._bind_name + '="' + this._bind_id + '"]').prop(this._name, !!value);				
		}
	}
});

module.exports = PropertyContext;