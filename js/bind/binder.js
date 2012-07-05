define(['context/BindingContext'], function(BindingContext) {
	
	var _isBinding = false,
		_stack = [],
		_ignoreBindings = false;
	
	var Binder = function() {
		
		this.pushContext = function(context) {
			var topContext = null;
			if(_stack.length > 0) {
				topContext = _stack[_stack.length - 1];
							
				if(!topContext['children'])
					topContext['children'] = [];
				topContext['children'].push(context);	
			}
			
			_stack.push(context);
			
			context['$root'] = _stack[0];
			context['$parent'] = topContext;
			context['children'] = [];
		};
		
		this.popContext = function() { return _stack.length > 0 ? _stack.pop() : null };
		this.context = function() { return _stack.length > 0 ? _stack[_stack.length - 1] : null };
		
		
		this.start = function(context) {
			if(_isBinding)
				this.error("Cannot start binding a new context, Binder is already started");
			else {
				_isBinding = true;
				this.pushContext(context);
			}
		};
		
		this.resume = function(context) {
			if(_isBinding) 
				this.error("Cannot resume binding, Binder is already started");
			else {
				_stack = [];
				while(context['$parent'] != null) {
					_stack.push(context);
					context = context['$parent'];	
				}
				_stack = _stack.reverse();
				
				_isBinding = true;
			}
		};
		
		this.end = function() {
			if(!_isBinding)
				this.error("Cannot end binding, Binder is not binding any context.  Call binder.start(context) to begin binding a context");
			else {
				_isBinding = false;
				//TODO assemble View with root context from pop()
				this.popContext();
			}	
		};
		
		this.stopBinding = function() {
				_ignoreBindings = true;
		};
		
		this.resumeBinding = function() {
				_ignoreBindings = false;
		};
		
		this.ignoringBindings = function() { return _ignoreBindings }; 
		
		this.error = function(msg) {
			console.log(msg);
		};
	}
	
	return new Binder();
});
