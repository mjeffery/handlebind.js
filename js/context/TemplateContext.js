define(
['lib/underscore', 'lib/handlebars', 'bind/template', './MetamorphContext'],
function(_, Handlebars, getTemplate, MetamorphContext) {
	return MetamorphContext.extend({
		
		init: function(options) {
			this._super(options);
			this._context_target = options.context;
		},
		
		target: function() {
			var oldSubs = this._subscriptions, newSubs = [], value;
			
			_.invoke(oldSubs, 'dispose');      // TODO probably should not just dispose all of these
			oldSubs.splice(0, oldSubs.length);
			
			value = {
				template: this._bindTarget(this._target, newSubs),
				context: this._bindTarget(this._context_target, newSubs)
			}
			
			oldSubs.concat(newSubs);
			
			return value;
		},
		
		renderContent: function(templateDesc) {
			var template = getTemplate(templateDesc.name),
			    context = templateDesc.context;
			   
			if(_.isFunction(template)) 
				return template(context);
			else
				return 'Unknown template "' + templateDesc.name + '"';
		}
	});
});
