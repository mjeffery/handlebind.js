define(['lib/underscore', 'lib/jquery', 'util/metamorph', 'observe/subscribable', './RenderContext', 'bind/context'], 
function(_, $, Metamorph, subscribable, RenderContext, context) {
	return RenderContext.extend({
		
		_subscriptions: [],
		_metamorph: undefined,
		
		init: function(options) {
			this._super(options);
			
			if(_.isSubscribable(this._target)) {
				this._subscriptions.push(
					this._target.subscribe(function() {
						this.isDirty(true);
						this['$root'].clean(); //TODO this assumes that clean on the 'root' context is throttled or defers
					}, this)
				);
			}
		},
		
		renderContent: function(value) {
			if(value === null || value === undefined)
				return "";
			else
				return value.toString();
		},
		
		render: function() {
			var target = this.target(),
			    value = _.isFunction(target) ? target() : target; 
			
			if(this._subscriptions.length > 0 && this.bind()) {
				if(!this._metamorph) {
					this._metamorph = new Metamorph(this.renderContext(value));	  
	       			return new Handlebars.SafeString(this._metamorph.outerHTML());
	       		}
	       		else
	       			return this._metamorph.outerHTML();
	    	}	
			else
				return this.renderContext(value);	
		},
		
		rerender: function() {
			if(this._metamorph) {
				var oldContext = context(),
				    target = this.target(),
				    value = _.isFunction(target) ? target() : target; 
				
				context(this);
				this.disposeChildren();	
				this._metamorph.html(Handlebars.Utils.escapeExpression(this.renderContext(value)));
				context(oldContext);
			}
		},
		
		dispose: function() {
			_.each(this._subscriptions, function(subscription) { subscription.dispose(); });
			this._subscriptions.splice(0, this._subscriptions.length);
			
			delete this['_metamorph'];
			
			this._super();
		}
	});
});

