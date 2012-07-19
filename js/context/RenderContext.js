define(['lib/underscore', './BindingContext'], function(_, BindingContext) {
	return BindingContext.extend({

		render: function() { 
			var target = this.target(),
				value = _.isFunction(target) ? target() : target;
				
			if(value === null || value === undefined)
				return "";
			else
				return value.toString();
		},
		
		rerender: function() { },
		
		clean: function() {
			if(this.isDirty()) {
				this.rerender();
				this.isDirty(false);
			}
			else 
				this.cleanChildren();
		}
	});
});