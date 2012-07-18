define(['lib/underscore', 'lib/jquery', 'observe/subscribable', 'context/BindingContext'], function(_, $, subscribable, BindingContext) {

	var nullSafe = {
		toString: function(value) {
			if(value !== undefined && value !== null)
				return value.toString();
			return "";
		}
	};
	
	var AttributesContext = BindingContext.extend({
	
		_attribute: undefined,
		_id: undefined,
		
		init: function(options) {
			this._super(options);
			
			_.defaults(options, { attr: "unknown"});
			this._attribute = options.attr;
			
			if(this.bind())
				this._id = _.uniqueId('attr');
		},
		
		foo: function(attributes) {
			if(attributes === null || attributes === undefined || attrbiutes)
			if(_.isString(attributes)) {
				return {
					html: this._attribute + '="' + attributes + '"',
					attrs: [this._attribute]
				}
			}
			else {
				var html = "", key, value, keys = [];
				
				for(key in attributes) {
					if(!attributes.hasOwnProperty(key)) continue;
					
					value = attributes[key];
					
					if(_.isArray(value)) 
						value = _.reject(value, function(item) { return item === undefined || item === null }).join(' ');
					else
						value = nullSafe.toString(attributes[key]);
						
					html += key + '="' + value + '" ';
					keys.push(key);
				}
				
				return { html: html, attrs: keys }
			}
		},
	
		render: function() {
			var target = this.target(),
				value = _.isFunction(target) ? target() : target,
				ret = "";
				
			
			
			if(this._subscriptions.length > 0 && this.bind()) 
				ret += ' handlebind="' + this._id + '"';
			
			return ret;
		},
		
		rerender: function() {
			var element = $('[handlebind~="' + this._id + '"]');
			element
		}
	});

	return AttributesContext;
});