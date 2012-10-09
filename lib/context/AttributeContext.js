var _ = require('underscore'),
	$ = require('jquery'),
	BindingContext = require('./BindingContext')
	RenderContext = require('./RenderContext');
	
var ValueContext = BindingContext.extend({
	targetUpdated: function() {
		this.$parentContext.isDirty(true);
		this._super();
	}
});

var AttributeContext = RenderContext.extend({
	
	init: function(options) {
		
		this._super(options);
		
		_.defaults(options, {
			bind_name: 'attr-bind',
			bind_id: _.uniqueId('hb'),
			name: _.uniqueId('undefined_attr'),
			sharing_bind: false
		});
		
		this._sharing_bind = options.sharing_bind;
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
		this._name = options.name;
	},
	
	render: function() {
		var value = this._getAttributeValue(),
			ret = ' ';
			
		if(!this._sharing_bind) 
			ret += this._bind_name + '="' + this._bind_id + '" ';
		if(value !== null && value !== undefined)
			ret += this._name + '="' + value + '"';
		
		return ret;
	},
	
	rerender: function() {
		if(this.bound()) {
			var value = this._getAttributeValue();
			$('['+ this._bind_name + '="' + this._bind_id + '"]').attr(this._name, value);				
		}
	},
	
	_getAttributeValue: function() {
		this.disposeChildren();
		this._subscribeToItems();
		
		var target = this.target(),
			value = _.isFunction(target) ? target() : target;
			
		if(_.isArray(value)) {	
			value = _.chain(value)
			 		 .map(function(item) { return _.isFunction(item) ? item() : item })
			 		 .reject(function(item) { return item === undefined || item === null })
			 		 .map(function(item) { return item.toString() })
			 		 .value()
			 		 .join(' ');		
		}
		else
			value = (value !== null && value !== undefined) ? value.toString() : "";
		
		return value;
	},
	
	disposeChildren: function() {
		this._super();
		this.children.splice(0, this.children.length);
	},
	
	_subscribeToItems: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target;
			
		if(_.isArray(value) && this.bind()) {
			_.each(value, function(item) {
				if(_.isSubscribable(item)) 
					new ValueContext({ parent: this, target: item});
			});
		}
	}
});

module.exports = AttributeContext;