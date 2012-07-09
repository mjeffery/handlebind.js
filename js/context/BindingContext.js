define(['lib/underscore', 'lib/jquery', 'util/metamorph', 'observe/subscribable', 'bind/binder'], 
function(_, $, Metamorph, subscribable, binder) {
	
	var matchRoot = /^\$root\./i,	
		matchLeadingParent = /^\$parent\.*/i,	
		matchParentsIndexer = /^\$parents\[([0-9]){1,}\]\./i, // results[1] is the indexer value
		matchFuncCall = /(.*?)\(\)/i, // matches a call with no-parameters
		matchIndexer = /(.*?)\[([0-9]){1,}\]/i; // results[1] is property, results[2] is the index
	
	function BindingContext(target, content) {
		
		this['$data'] = target;
		this._doNotBind = binder.ignoringBindings();
		
		if(_.isFunction(target)) {
			this._isBound = false;
			
			if(!this._doNotBind && _.isSubscribable(target)) {
				this._isBound = true;
				this._subscriptions = [];
				this._subscriptions.push(target.subscribe(function() { this.rebind() }, this)); //TODO delegate this out to the coalescing function
			}
		}
		else 
			this._isBound = false;

		this._isDirty = false;
		this._content = content; //TODO check that content is a function-- if not, functionify it
	}
	

	_.extend(BindingContext.prototype, {
		
		target: function() {
			var target = this['$data'];
			return _.isFunction(target) ? target() : target;
		},
		
		isDirty: function() {
			if(arguments.length > 0) 
				this._isDirty = arguments[0];
			else 
				return this._isDirty;
		},
		
		get: function(path, context) {
			if(_.isString(path) && path.length > 0) {
				// the path should be a string of non-zero length

				var matches;
				
				if(context === undefined)
					context = this['$data'];

				if(path.charAt(0) === '$') {
					// path contains a control character-- check for context based 
					
					matches = path.match(matchRoot);
					if(matches) {
						// $root.
						path = path.substr(matches[0].length - 1);
						context = this['$root'];
						
						return this.get(path, context);
					}
					else {
						// count parent indices using $parent.$parent
						var parent_index = 0;	//index from 1 
						matches = path.match(matchLeadingParent);
						while(matches) {
							parent_index++;
							path = path.substr(matches[0].length - 1);						
							matches = path.match(matchLeadingParent);
						}
						
						matches = path.match(matchParentsIndexer);
						if(matches) {
							// $parents[i]. indexer
							path = path.substr(matches[0].length - 1);	
							parent_index += matches[1] + 1;	//index starts at 1		
						}
						
						if(parent_index - 1 > 0) { //subtract 1 for actual index
							context = this['$parents'][parent_index];
							return this.get(path, context);
						}
					} // end matchers block
				} // end '$' block
				
				var elements = path.split('.'), 
					element;
				for(var i=0, j=elements.length; i < j; i++) {
					if(context === null || context === undefined)
						return context;
					else {
						element = elements[i];
						
						matches = element.match(matchIndexer);
						if(matches) {
							// matches indexer
							context = context[matches[1]];
							if(context)
								context = context[matches[2]];
						}
						else {
							matches = element.match(matchFuncCall);
							if(matches) {
								// matches no-arg function call
								context = context[matches[1]].call(context);
							}
							else
								context = context[element];
						}
					} // end context test block
				} // end for loop
				
				//if context is a function (such as an observable)  evaluated it with no arguments
				return _.isFunction(context) ? context() : context;
			}
			else 
				return null;
		},
		
		bindContent: function() {
			if(binder.context() !== this) //TODO this is a controversial check... maybe just error if the context isn't on top of the stack
				binder.pushContext(this);
			if(this._doNotBind)
				binder.stopBinding();	
	
			var ret = "";

			if(this._isBound) {
				if(!this['_metamorph']) {
					var html = this._content(this.target());
					this._metamorph = new Metamorph(html);	  
					     
	       			ret = new Handlebars.SafeString(this._metamorph.outerHTML());
	       		}
	       		else
	       			ret = this['_metamorph'].outerHTML();
	    	}	
	    	else 
	    		ret = this._content(this.target());
	    	
	    	if(this._doNotBind)
	    		binder.resumeBinding();
	    		
	    	return ret;
		},
		
		rebind: function() {
			if(this._isBound && this._metamorph) {
				this.disposeChildren();
				
				binder.resume(this);
				if(this._doNotBind)
					binder.stopBinding();
					
				this._metamorph.html(Handlebars.Utils.escapeExpression(this._content(this.target())));
				
				if(this._doNotBind)
					binder.resumeBinding(); 
				binder.end();
			}
		},
		
		disposeChildren: function() {
			var children = this['children'].slice(0);
			if(children && _.isArray(children)) {
				_.each(this['children'], function(child) { child.dispose() });
			}
			this['children'].splice(0, children.length);
		},
		
		dispose: function() {
			this.disposeChildren();
			if(this._isBound) {
				_.each(this._subscriptions, function(subscription) { subscription.dispose() });
				this._isBound = false;	
			}
		}
	});
	
	return BindingContext;
});
