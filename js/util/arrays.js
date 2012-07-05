define(['lib/underscore'], function(_) {
	var arrays = {
		remove: function(array, itemToRemove) {
			var index = _.indexOf(array, itemToRemove);
			if(index >= 0)
				array.splice(index, 1);
		}
	}
	
	_.mixin(arrays);
	
	return arrays;
});
