define(
['lib/underscore', 'lib/jquery', './BindingContext', './RenderContext'], 
function(_, $, BindingContext, RenderContext) {
	
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
				name: 'undefined_attribute'
			});
			
			this._bind_name = options.bind_name;
			this._bind_id = options.bind_id;
			this._name = options.name;
			
			this._subscribeToItems();
		},
		
		render: function() {
			var value = this._getAttributeValue();
			return (value !== null && value !== undefined) ? this._name + '="' + value + '"' : "";
		},
		
		rerender: function() {
			if(this.bound()) {
				this.disposeChildren();
				this._subscribeToItems();
				
				var value = this._getAttributeValue();
				$('['+ this._bind_name + '="' + this._bind_id + '"]').attr(this._name, value);				
			}
		},
		
		_getAttributeValue: function() {
			this.disposeChildren();
			
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
	
	return AttributeContext;
});
