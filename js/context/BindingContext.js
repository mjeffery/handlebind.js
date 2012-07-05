define(['lib/underscore', 'lib/jquery', 'util/metamorph', 'observe/subscribable', 'bind/binder'], 
function(_, $, Metamorph, subscribable, binder) {
	
	function BindingContext(target, content) {
		
		this._bindingActive = !binder.ignoringBindings();
		
		if(_.isFunction(target)) {
			this.target = target;
			this._isBound = false;
			
			if(this._bindingActive && _.isSubscribable(target)) {
				this._isBound = true;
				this._subscription = target.subscribe(function() { this.rebind() }, this); //TODO delegate this out to the coalescing function
			}
		}
		else {
			this.target = function() { return target; }
			this._isBound = false;
		}
		
		this._isDirty = false;
		this._content = content; //TODO check that content is a function-- if not, functionify it
	}
	
	_.extend(BindingContext.prototype, {
		
		isDirty: function() {
			if(arguments.length > 0) 
				this._isDirty = arguments[0];
			else 
				return this._isDirty;
		},
		
		bindContent: function() {
			if(binder.context() !== this) //TODO this is a controversial check... maybe just error if the context isn't on top of the stack
				binder.pushContext(this);
				
			if(this._isBound) {
				if(!this['_metamorph']) {
					var html = Handlebars.Utils.escapeExpression(this._content(this.target()));
					this._metamorph = new Metamorph(html);	  
					     
	       			return new Handlebars.SafeString(this._metamorph.outerHTML());
	       		}
	       		else
	       			return this['_metamorph'].outerHTML();
	    	}	
	    	else {
	    		return Handlebars.Utils.escapeExpression(this._content(this.target()));
	    	} 
		},
		
		rebind: function() {
			if(this._isBound && this._metamorph) {
				this.disposeChildren();
				
				binder.resume(this);
				this._metamorph.html(Handlebars.Utils.escapeExpression(this._content(this.target()))); 
				binder.end();
			}
		},
		
		disposeChildren: function() {
			var children = this['children'];
			if(children && _.isArray(children)) {
				_.each(this['children'], function(child) { child.dispose() });
			}
		},
		
		dispose: function() {
			this.disposeChildren();
			if(this._isBound) {
				this._subscription.dispose();
				this._isBound = false;	
			}
		}
	});
	
	return BindingContext;
});
