var Handlebars = require('handlebars'),
	MetamorphContext = require('./MetamorphContext')

var TextContext = MetamorphContext.extend({
	renderContent: function(value) {
		return !!value ? Handlebars.Utils.escapeExpression(value.toString()) : "";
	},
	
	targetUpdated: function() {
		this._super(); //XXX: this is just a debugging hook
	}
});

module.exports = TextContext;