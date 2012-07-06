define(['context/BindingContext'], function(BindingContext) {
	
	var _isBinding = false,
		_stack = [],
		_ignoreBindings = false,
		_run_queue = [];
	
	var Binder = function() {
		
		this.pushContext = function(context) {
			var topContext = null;
			if(_stack.length > 0) {
				topContext = _stack[_stack.length - 1];
							
				if(!topContext['children'])
					topContext.children = [];
				topContext.children.push(context);	
				
				//TODO all these $ accessors should be added to the context['$data'] field-- otherwise the viewmodel doesn't work
				//	   alternative: modify handlebars.js to pull $ fields from the context instead of 'this'
				
				context['$parent'] = topContext['$data'];
				context['$parents'] = (topContext['$parents'] || []).slice(0);
				context['$parents'].unshift(context['$parent']);
			}
			else {
				context['$parent'] = null;
				context['$parents'] = [];
			}
			
			_stack.push(context);
			
			context.parent = topContext;
			context.children = [];
			
			context['$root'] = _stack[0]['$data'];
		};
		
		this.popContext = function() { return _stack.length > 0 ? _stack.pop() : null };
		this.context = function() { return _stack.length > 0 ? _stack[_stack.length - 1] : null };
		
		
		this.start = function(context) {
			if(_isBinding)
				this.error("Cannot start binding a new context, Binder is already started");
			else {
				_isBinding = true;
				_run_queue = [];
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
				_run_queue = [];
				_isBinding = true;
			}
		};
		
		this.afterBinding = function(callback, target, options) {
			_run_queue.push({
				callback: callback,
				target: target,
				options: options
			});
		};
		
		this.end = function() {
			if(!_isBinding)
				this.error("Cannot end binding, Binder is not binding any context.  Call binder.start(context) to begin binding a context");
			else {
				_isBinding = false;
				this.popContext();
				
				var queue = _run_queue.slice(0);
				for(var i = 0, j=queue.length; i < j; i++) {
					var to_run = queue[i];
					to_run.callback.call(to_run.target, to_run.options);
				}
				_run_queue = [];
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
