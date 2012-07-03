define(
['lib/underscore', 
 'lib/handlebars', 
 'context/BindingContext',
 'bind/binder',
 'bind/helpers/value'], 
function(_, Handlebars, BindingContext, binder) {
	
	var View = function(template, modelview) {
		
		//ensure that the template is compiled
		if(!_.isFunction(template)) {
			if(_.isString(template)) 
				this._template = Handlebars.compile(template);
			else {
				//TODO report error
				this._template = Handlebars.compile("<b>Invalid Template!</b>"); 
			} 
		}
		
		this.context = new BindingContext(modelview);
		this._attachedToDom = false;
	}
	
	View.prototype.appendTo = function(elementOrSelector) {
		if(!this._attachedToDom) {
			
			//TODO bind/util wrap this for high level changes?  
			
			binder.start(this._context);
			$(template(this._context.target)).appendTo(elementOrSelector);
			binder.end(); //TODO pass 'this' to end so it can perform the after insertion tasks
			
			this._attachedToDom = true;
			//TODO add a removedFromDom handler here to update status
		}
		else {
			//TODO remove from existing position and rebind to 
		}
	}
});
