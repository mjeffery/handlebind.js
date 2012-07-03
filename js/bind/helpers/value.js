define(
['lib/underscore', 'lib/handlebars', 'observe/observable', 'bind/util'], 
function(_, Handlebars, observable, util) {
	Handlebars.registerHelper('value', function(context, options) {
		return util.wrap(context, function(context, options) {
			return context.toString();
		})
	})
});
