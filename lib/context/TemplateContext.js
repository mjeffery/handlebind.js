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
	
	target: function() {
		var oldSubs = this._subscriptions, newSubs = [], value;
		
		_.invoke(oldSubs, 'dispose');      // TODO probably should not just dispose all of these
		oldSubs.splice(0, oldSubs.length);
		
		value = {
			template: this._bindTarget(this._template, newSubs),
			context: this._bindTarget(this._context, newSubs)
		}
		
		oldSubs.concat(newSubs);
		
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