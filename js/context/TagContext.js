define(['lib/underscore', './RenderContext'], function(underscore, RenderContext) {
	var TagContext = RenderContext.extend({
		_tag: undefined,
		
		init: function(options) {
			this._super(options);
			_.defaults(options, { 
				tag: 'div',
				renderContent: function() { return ""; }  });
			
		}
		
	});
	
	return TagContext;
});

