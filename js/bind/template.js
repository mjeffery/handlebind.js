define(['lib/underscore', 'lib/jquery', 'lib/handlebars'], function(_, $, Handlebars) {
	
	//TODO automatically detect if the runtime is being used and adjust the template loading accordingly
	
	var _compiledTemplates = {};
	
	function template(name) {
		var script, 
			compiled = _compiledTemplates[name];
		
		if(!compiled) {
			script = $('script#' + name).html();
			if(script !== null) {
				compiled = Handlebars.compile(script);
				_compiledTemplates[name] = compiled;
			}
		}
		
		return compiled;	
	}
	
	return template;
});
