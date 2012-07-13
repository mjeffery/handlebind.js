define(['lib/underscore', 'context/RenderContext'], function(_, RenderContext) {

	var _TOP = null;
	function context() {
		if(arguments > 0) {
			//TODO verify that arguments[0] is an instance of RenderContext
			_TOP = arguments[0];	
		}
		return _TOP; 
	}	
	
	_.extend(context.prototype, {	
		pop: function() {
			var top = context();
			if(top)
				context(top['$parentContext']);
			return top;
		}
	});
	
	return context;
});
