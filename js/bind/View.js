define(
['lib/underscore', 
 'lib/jquery',
 'lib/handlebars', 
 'context/TemplateContext',
 'bind/context',
 'bind/helpers/value'], 
function(_, $, Handlebars, TemplateContext, context) {
	
	var ViewContext = TemplateContext.extend({
		init: function(options) {
			this._super(options);
		},
		
		bind: function() { return true; }
	});
	
	var View = function(templateOrSelector, modelview) {
		
		//ensure that the template is compiled
		if(!_.isFunction(templateOrSelector)) {
			if(_.isString(templateOrSelector)) {
				//TODO check a local cache of templates
				var source = $('script#' + templateOrSelector + '[type="text/x-handlebars"]').html() || templateOrSelector;
				this._template = Handlebars.compile(source);
				//TODO add template to the cache
			}
			else {
				//TODO report error
				this._template = Handlebars.compile("<b>Invalid Template!</b>"); 
			} 
		}
		else {
			this._template = templateOrSelector;
		}
		
		this._context = new TemplateContext({ target: modelview });
		this._attachedToDom = false;
	}
	
	View.prototype.appendTo = function(elementOrSelector) {
		if(!this._attachedToDom) {
			
			//TODO bind/util wrap this for high level changes?  
			
			context(this._context);
			$(this._template(this._context.target())).appendTo(elementOrSelector);
			context.pop();
			
			this._context.trigger('attach');
			this._attachedToDom = true;
			//TODO add a removedFromDom handler here to update status
		}
		else {
			//TODO remove from existing position and rebind to 
		}
	}
	
	return View;
});
