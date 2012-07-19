define(
['lib/underscore', 'lib/handlebars', 'observe/subscribable', 'bind/template', './MetamorphContext'],
function(_, Handlebars, getTemplate, MetamorphContext) {
	return MetamorphContext.extend({
		
		init: function(options) {
			this._super(options);
			this._context_target = options.context;
		},
		
		target: function() {
			//TODO perform binding on target paths for both _target and _context_target
			//TODO return hash { name: ..., context: ... }
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
