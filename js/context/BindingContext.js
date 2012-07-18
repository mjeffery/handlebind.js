define(['lib/underscore', 'lib/jquery', 'util/metamorph', 'observe/subscribable', './RenderContext', 'bind/context'], 
function(_, $, Metamorph, subscribable, RenderContext, context) {
	return RenderContext.extend({

		init: function(options) {
			this._super(options);

            this._subscriptions = [];
            this._metamorph =  undefined;
			
			if(_.isSubscribable(this._target)) {
				this._subscriptions.push(
					this._target.subscribe(function() {
						this.isDirty(true);
						this['$rootContext'].clean(); //TODO this assumes that clean on the 'root' context is throttled or defers
					}, this)
				);
			}
		},
		
		bound: function() {
			return this._subscriptions.length > 0 && this.bind();
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
			
			if(this.bound()) {
				if(!this._metamorph) {
					this._metamorph = new Metamorph(this.renderContent(value));	  
	       			return new Handlebars.SafeString(this._metamorph.outerHTML());
	       		}
	       		else
	       			return this._metamorph.outerHTML();
	    	}	
			else
				return this.renderContent(value);	
		},
		
		rerender: function() {
			if(this._metamorph) {
				var oldContext = context(),
				    target = this.target(),
				    value = _.isFunction(target) ? target() : target; 
				
				context(this);
				this.disposeChildren();	
				this._metamorph.html(Handlebars.Utils.escapeExpression(this.renderContent(value)));

                this.trigger("attach");
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

