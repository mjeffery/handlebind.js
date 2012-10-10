var _ = require('underscore'),
	humble = require('humble');	

var matchRoot = /^\$root\./i,	
	matchLeadingParent = /^\$parent\.*/i,	
	matchParentsIndexer = /^\$parents\[([0-9]){1,}\]\./i, // results[1] is the indexer value
	matchLabel = /^\$([@#\$_%\d\w]+)\./i,
	matchFuncCall = /(.*?)\(\)/i, // matches a call with no-parameters
	matchIndexer = /(.*?)\[([0-9]){1,}\]/i; // results[1] is property, results[2] is the index

var BindingContext = humble.Object.extend({
	
	init: function(options) {
		
		_.defaults(options, {
			target: null,
			parent: null,
			bind: true
		});
		
		this._target = options.target;
		this._subscriptions = [];
		this.bind(options.bind);
		
		// attach to tree
		if(!!options['parent']) { 
			//TODO check if 'parent' is an instance of BindingContext
			var parent = options['parent'];
			
			this['$rootContext'] = parent['$rootContext'];
			this['$parentContext'] = parent;
			
			//TODO move this out into a function so leaf nodes can throw errors
			parent['children'] = parent['children'] || [];
			parent['children'].push(this);
		}
		else {
			this['$rootContext'] = this;
			this['$parentContext'] = null;
		}
		
		this.children = [];
        this._isDirty = false;
		
		// Handle any labels
		if(!!options['symbol']) {
			if(_.isString(options['symbol'])) {
				var i, len, label, labels = options.symbol.split(',');
				for(i = 0, len = labels.length; i < len; i++) {
					label = labels[i];
					
					if(!/^[@#\$_%\d\w]+$/.test(label))
						throw new Error('"' + label + '" is not a valid symbol!');
					
					switch(label) {
						case "root":
						case "parent":
						case "parents":
							throw new Error('"' + label + '" is reserved and cannot be used as a symbol');
							break;
					}
				}
				
				this.$symbols = labels;
			}
		}
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
		
		//TODO just make this a computed value?
		
		var disposalCandidates = _.pluck(this._subscriptions, 'target'),
			self = this,
			value = this._bindTarget(this._target, function(target) {
				if(_.isSubscribable(target) && self.bind()) {
					var inOld = _.indexOf(disposalCandidates, target);
					if(inOld >= 0)
						disposalCandidates[inOld] = undefined; //Don't want to dispose this subscription, as it's still in use
					else
						self._subscriptions.push(target.subscribe(self.targetUpdated, self));
				}
			}); 
		
		// For each subscription no longer being used, remove it from the active subscriptions list and dispose it
		for(var i = disposalCandidates.length - 1; i >= 0; i--) {
			if (disposalCandidates[i])
				this._subscriptions.splice(i, 1)[0].dispose();
		}
				
		return value;
	},
	
	targetUpdated: function() {
		this.isDirty(true);
		this['$rootContext'].scheduleClean(); 
	},
	
	_bindTarget: function(value, callback) {
		if(_.isString(value) && value.match(/^path::.*/i)) 
			value = this._bindTargetPath(value.substr("path::".length), callback);
		
		callback(value);

		return value;
	},
	
	_bindTargetPath: function(path, callback, context) {
		
		var matches;
		
		if(_.isString(path) && path.length > 0) {
			// the path should be a string of non-zero length

			if(path.charAt(0) === '$') {
				// path contains a control character-- check for context based 
				
				matches = path.match(matchRoot);
				if(matches) {
					// $root.
					path = path.substr(matches[0].length);
					context = this['$rootContext'].target();
					
					return this._bindTargetPath(path, callback, context);
				}
				else {					
					var parent_index = 0;	//index from 1 
					
					// $parents[i]. indexer
					matches = path.match(matchParentsIndexer);
					if(matches) {
						path = path.substr(matches[0].length);	
						parent_index += Number(matches[1]) + 1;	//index starts at 1		
					}
					
					// count parent indices using $parent.$parent
					matches = path.match(matchLeadingParent);
					while(matches) {
						parent_index++;
						path = path.substr(matches[0].length);						
						matches = path.match(matchLeadingParent);
					}
					
					if(parent_index > 0) {
						var i, currContext = this; 
						for(i = 0; i < parent_index; i++) {
							currContext = currContext['$parentContext'];
							if(!currContext)
								throw new Error("Cannot bind path. $parent was null or undefined");
						}
						
						context = currContext.target();
						return this._bindTargetPath(path, callback, context);
					}
					
					// find a matching label
					matches = path.match(matchLabel);
					if(matches) {
						//look up through the node's parents trying to find the specified label
						var node = this;
						while(node) {
							if(_.isArray(node['$symbols']) && 				// is an array
							    _.contains(node['$symbols'], matches[1]))	// contains the label
							{
								break;
							}
							node = node['$parentContext'];
						}
						
						//if no node was found, then its an error
						if(!node)
							throw new Error('Could not find the label "' + matches[1] + '"');
						
						//use the label as the context
						path = path.substr(matches[0].length);
						context = node.target();
						return this._bindTargetPath(path, callback, context);
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
						callback(context);
						if(context)
							context = context[matches[2]];
					}
					else {
						matches = element.match(matchFuncCall);
						if(matches) {
							// matches no-arg function call
							context = context[matches[1]];
							callback(context);
							context = context.call(context);
							callback(context);
						}
						else {
							context = context[element];
							callback(context);
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

module.exports = BindingContext;