define(['lib/underscore'], function(_) {
	var nullSafe = {
		toString: function(value) {
			if(value !== undefined && value !== null)
				return value.toString();
			return "";
		}
	};
	
	return nullSafe;
})

