define(['lib/underscore', 'lib/jquery', 'util/metamorph', './RenderContext', 'bind/context'], 
function(_, $, Metamorph, RenderContext, context) {
	return RenderContext.extend({
		
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
				context(oldContext);
			}
		},
		
		dispose: function() {
			delete this['_metamorph'];
			this._super();
		}
	});
});