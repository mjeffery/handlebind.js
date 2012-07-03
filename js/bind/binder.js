define(['context/BindingContext'], function(BindingContext) {
	
	var Binder = function() {
		this.isBinding = false;
		
		this.rootContext = null;
		this.parentContext = null;
		this.currentContext = null;
		
		this.contextualize = function(model) {
			
		};
		
		this.start = function(context) {
			if(this.isBinding)
				this.error("Cannot start binding a new context, Binder is already started.  Call binder.end() before binding a new context");
			else {
				this.isBinding = true;
				this.rootContext = context;
				this.currentContext = context;
			}
		};
		
		this.end = function() {
			if(!this.isBinding)
				this.error("Cannot end binding, Binder is not binding any context.  Call binder.start(context) to begin binding a context");
			else {
				this.isBinding = false;
			}	
		};
		
		this.error = function(msg) {
			console.log(msg);
		};
	}
	
	return new Binder();
});
