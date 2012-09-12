var Handlebars = require('handlebars'),
	MetamorphContext = require('./MetamorphContext')

var TextContext = MetamorphContext.extend({
	renderContent: function(value) {
		return !!value ? Handlebars.Utils.escapeExpression(value.toString()) : "";
	}
});

module.exports = TextContext;