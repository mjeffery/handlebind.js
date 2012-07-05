define(
	['lib/underscore', 'lib/jquery', 'lib/handlebars', './binder', 'observe/subscribable', 'observe/dependencyDetection'], 

function(_, $, Handlebars, binder, subscribable, dependencyDetection) {
	var utils = {
		
		wrap: function(context, fn, options) {
			var proceed = _.isFunction(fn) ? fn : function() { return "" }; 
			
			// context is a function.  Assume that the return value of the function should be displayed
			if(_.isFunction(context)) {
				// bindings are not ignored and the context is subscribable
				if(!binder.ignoringBindings() && _.isSubscribable(context)) {
					// This is the binding that will be used in the scripts
					var prefix = _.uniqueId("binding-"),
						startId = prefix + '-start',
						endId = prefix + '-end';
						
					var ret = "<script id='" + startId + "' type='text/x-placeholder'></script>";

					context.subscribe(function(subscription) {
						//TODO delegate this to the view-- will defer all changes to coalesce events
						var start = $('script#' + startId);
						$(start).nextUntil('script#' + endId).remove();
						start.append(Handlebars.Utils.escapeExpression(proceed(context(), options)));
					});
					ret = ret + Handlebars.Utils.escapeExpression(proceed(context(), options)); //ensure that the string is properly escaped
					
					return new Handlebars.SafeString(ret + "<script id='" + endId + "' type='text/x-placeholder'></script>"); 
					
				}
				// either bindings are not active or there is nothing to subscribe to
				else {
					return proceed(context(), options);
				}
			}
			// value is a 'vanilla' javascript construct
			else
				return proceed(context, options);
		}
	}
	
	_.bindAll(utils);
	
	return utils;
});
