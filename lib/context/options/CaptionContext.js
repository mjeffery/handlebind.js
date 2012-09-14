var _ = require('underscore'),
	RenderContext = require('../RenderContext'),
	dom = require('../../util/dom');

var CaptionContext = RenderContext.extend({
	init: function(options) {
		this._super(options);
	
		//TODO we do this alot it seems...
		_.defaults(options, {
			bind_name: 'caption-bind',
			bind_id: _.uniqueId('hb') 
		});
		
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
	},
	
	render: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target,
			ret ="";
		
		//TODO convert the value safely to an empty string when its undefined
		
		ret += '<option value="-1"';
		if(this.bind()) 
			ret += this._bind_name + '="' + this._bind_id + '"'
		ret += '>' + value + '</option>'
			
		return ret;
	},
	
	rerender: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target;
		dom.boundElement(this).text(value);
	}
});	

module.exports = CaptionContext;