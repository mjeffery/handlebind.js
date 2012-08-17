var _ = require('underscore');

var _TOP = null;
function context() {
	if(arguments.length > 0) {
		//TODO verify that arguments[0] is an instance of RenderContext
		_TOP = arguments[0];	
	}
	return _TOP; 
}	

_.extend(context, {	
	pop: function() {
		var top = context();
		if(top)
			context(top['$parentContext']);
		return top;
	}
});
	
module.exports = context;