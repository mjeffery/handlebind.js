define(['lib/underscore', 'lib/jquery', 'util/nullSafe', './BindingContext'], function(_, $, nullSafe, BindingContext) {
	
	var VALID_TYPES = ['text', 'password', 'hidden'],
		VALID_UPDATES = ['change', 'keypress', 'keyup', 'afterkeydown']
	
	var InputContext = BindingContext.extend({
		
		_id: undefined,
		_type: 'text',
		_updatePolicy: 'change',
		
		init: function(options) {
			this._super(options);
			
			_.defaults(options, {
				type: 'text',
				update: 'change'	
			});
			
			
			
			if(!_.include(VALID_TYPES, options.type)) 
				throw new Error('type="' + options.type + '" is not supported by {{input}}');
			if(!_.include(VALID_UPDATES, options.update))
				throw new Error('The update policy "' + options.update + '" is not supported by {{input}}');
				
			this._id = _.uniqueId('input');
			this._type = options.type;
			this._updatePolicy = options.update;	
			
			if(this.bound()) {
				this.on('attach', function() {
					var element = $('[handlebind~="' + this._id + '"]');
					
					if()
					
				}, this);
			}
		},
		
		render: function() {
			var target = this.target(),
				value = _.isFunction(target) ? target() : target,
				ret = "";
			
			ret += '<input handlebind="' + this._id + '" ';
			ret += 'type="' + this._type + '" ';
			
			value = nullSafe.toString(value);
			if(value.length > 0)
				ret += 'value="' + value + '"'
			
			ret += '></input>';
			
			return ret;
		}
	});
});