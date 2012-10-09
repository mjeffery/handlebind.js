var $ = require('jquery'),
	humble = require('humble'),
	ViewContext = require('../context/ViewContext')
	context = require('./context');
	
var View = humble.Object.extend({
	
	init: function(template, modelview) {
		this._template = template;
		this._modelview = modelview;
	},
	
	appendTo: function(elementOrSelector) {
		
		var rootElement = $(elementOrSelector),
			rootContext = new ViewContext({
				element: rootElement,
				target: this._modelview,
				template: this._template,
				context: this._modelview
			});
		
		context(rootContext);
		$(rootContext.render()).appendTo(rootElement);
		context.pop();
		
		rootContext._isAttached = true;
		rootContext._updateEvents();
		rootContext._updateFocus();
		rootContext._postRender();
		
		this._context = rootContext;
	},
	
	replaceIn: function(elementOrSelector) {
		var rootElement = $(elementOrSelector),
			rootContext = new ViewContext({
				element: rootElement,
				target: this._modelview,
				template: this._template,
				context: this._modelview
			});
			
		context(rootContext);
		rootElement.html(rootContext.render());
		context.pop();
		
		rootContext._isAttached = true;
		rootContext._updateEvents();
		rootContext._updateFocus();
		rootContext._postRender();
	
		this._context = rootContext;
	},
	
	remove: function() {
		var context = this._context;
		if(context) {
			context.dispose();
			context._isAttached = false;
		}
		
		this._context = null;
	} 
});

module.exports = View;