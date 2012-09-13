var Handlebars = require('handlebars');

Handlebars.registerHelper('action', function(target, options) {
	var ret = '<a href="javascript:void(0)" ',
		label = options.hash['label'];
	
	ret += Handlebars.helpers['events'].call(this, {hash:{click:target}});
	ret +='>';
	ret += Handlebars.helpers['text'].call(this, label, {hash:{}});
	ret += '</a>';
	
	return new Handlebars.SafeString(ret);
});