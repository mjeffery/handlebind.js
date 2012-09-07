var _ = require('underscore'),
	Handlebars = require('handlebars'),
	getTemplate = require('../bind/template'),
	MetamorphContext = require('./MetamorphContext');
	
var TemplateContext = MetamorphContext.extend({
		
	init: function(options) {
		this._super(options);
		
		_.defaults(options, { template: this._target });
		
		this._template = options.template;
		this._context = options.context;
	},
	
	//TODO must rephrase BindingContext#_bindTarget so that it can be used with disposal...
	target: function() {
		var disposalCandidates = _.pluck(this._subscriptions, 'target'),
			self = this,
			callback = function(target) {
				if(_.isSubscribable(target) && self.bind()) {
					var inOld = _.indexOf(disposalCandidates, target);
					if(inOld >= 0)
						disposalCandidates[inOld] = undefined; //Don't want to dispose this subscription, as it's still in use
					else
						self._subscriptions.push(target.subscribe(self.targetUpdated, self));
				}
			},
			value = {
				template: this._bindTarget(this._template, callback),
				context: this._bindTarget(this._context, callback)
			};
				
		return value;
	},
	
	renderContent: function(desc) {
		var template = getTemplate(desc.template),
		    context = desc.context;
		   
		if(_.isFunction(template)) 
			return template(context);
		else
			return 'Unknown template "' + desc.template + '"';
	}
});

module.exports = TemplateContext;