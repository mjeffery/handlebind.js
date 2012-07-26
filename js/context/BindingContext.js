define(['lib/underscore', 'util/BaseObject'], function(_, BaseObject) {
	
	var matchRoot = /^\$root\./i,	
		matchLeadingParent = /^\$parent\.*/i,	
		matchParentsIndexer = /^\$parents\[([0-9]){1,}\]\./i, // results[1] is the indexer value
		matchFuncCall = /(.*?)\(\)/i, // matches a call with no-parameters
		matchIndexer = /(.*?)\[([0-9]){1,}\]/i; // results[1] is property, results[2] is the index
	
	return BaseObject.extend({
		
		init: function(options) {
			
			_.defaults(options, {
				target: null,
				parent: null,
				bind: true
			});
			
			this._target = options.target;
			this._subscriptions = [];
			this.bind(options.bind);
			
			if(!!options['parent']) { //TODO check if 'parent' is an instance of BindingContext
				var parent = options['parent'];
				
				this['$rootContext'] = parent['$rootContext'];
				this['$parentContext'] = parent;
				this['$parent'] = parent.target();
				this['$parents'] = (parent['$parents'] || []).slice(0);
				this['$parents'].unshift(this['$parent']);
				this['$root'] = parent['$root'];
				
				parent['children'] = parent['children'] || [];
				parent['children'].push(this);
			}
			else {
				this['$rootContext'] = this;
				this['$parentContext'] = null;
				this['$parent'] = null;
				this['$parents'] = [];
				this['$root'] = this._target; //TODO anywhere this is accessed it needs to be parsed with tryPath
			}
			
			this.children = [];
            this._handlers = {};
            this._isDirty= false;
		},
		
		bind: function() {
			if(arguments.length > 0) {
				var parentBinding = !this.$parentContext ? true : this.$parentContext.bind();
				this._bind = parentBinding && !!arguments[0];
			}
			else
				return this._bind;
		},
		
		bound: function() {
			return this._subscriptions.length > 0 && this.bind();
		},

		isDirty: function()  {
			if(arguments.length > 0)
				this._isDirty = !!arguments[0];
			else
				return this._isDirty;
		},
		
		cleanChildren: function() { _.invoke(this.children, 'clean'); },
		
		clean: function() {
			this.isDirty(false);
			this.cleanChildren();
		},
		
		isDisposed: function() { return this._isDisposed; },
		
		disposeChildren: function() { _.invoke(this.children, 'dispose'); },
		
		dispose: function() {
			_.invoke(this._subscriptions, 'dispose');
			this._subscriptions.splice(0, this._subscriptions.length);
			
			this.disposeChildren();
			this._disposed = true;
		},
		
		target: function() { 
			var oldSubs = this._subscriptions, newSubs = [], value;
			
			_.invoke(oldSubs, 'dispose');      // TODO probably should not just dispose all of these
			oldSubs.splice(0, oldSubs.length);
			
			value = this._bindTarget(this._target, newSubs); 
			
			this._subscriptions = oldSubs.concat(newSubs);
			
			return value;
		},
		
		targetUpdated: function() {
			this.isDirty(true);
			this['$rootContext'].clean(); //TODO this assumes that clean on the 'root' context is throttled or defers
		},
		
		_bindTarget: function(value, subscriptions) {
			if(_.isString(value) && value.match(/^path::.*/i)) 
				value = this._bindTargetPath(value.substr("path::".length), subscriptions);
			
			this._subscribeToTarget(value, subscriptions);
				
			return value;
		},
		
		_bindTargetPath: function(path, subscriptions, context) {
			
			var matches;
			
			if(_.isString(path) && path.length > 0) {
				// the path should be a string of non-zero length
				
				if(context === undefined)
					context = this['$data'];

				if(path.charAt(0) === '$') {
					// path contains a control character-- check for context based 
					
					matches = path.match(matchRoot);
					if(matches) {
						// $root.
						path = path.substr(matches[0].length - 1);
						context = this['$root'];
						
						return this._bindTargetPath(path, subscriptions, context);
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
							return this._bindTargetPath(path, subscriptions, context);
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
							this._subscriveToTarget(context, subscriptions);
							if(context)
								context = context[matches[2]];
						}
						else {
							matches = element.match(matchFuncCall);
							if(matches) {
								// matches no-arg function call
								context = context[matches[1]];
								this._subscribeToTarget(context, subscriptions);
								context = context.call(context);
								this._subscribeToTarget(context, subscriptions);
							}
							else {
								context = context[element];
								this._subscribeToTarget(context, subscriptions);
							}
						}
					} // end context test block
				} // end for loop
				
				return context;
			}
			else
				return null;
		},
		
		_subscribeToTarget: function(target, subscriptions) {
			if(_.isSubscribable(target) && this.bind()) {
				if(_.pluck(subscriptions, 'target').indexOf(target) < 0) //TODO seems slow?
					subscriptions.push(target.subscribe(this.targetUpdated, this));
					
				return true;
			}
			
			return false;
		}
	});
	
});
