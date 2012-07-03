ActionBinding = function(callback) {
	this.id = _.uniqueId('bind-action-');
	this.callback = callback;
	this.event = 'click';
}

BindingContext = function() {
	
	this['$root'] = this;
	this['$parent'] = null;
	
	this.find = function(path) {
		var elements, context, i;
		
		if(path.indexOf('.') >= 0)
			elements = path.split('.');
		else {
			elements = [];
			elements.push(path);
		}
		
		context = this[elements[0]];
		for(i = 1; i < elements.length; i++) {
			context = this[elements[i]]		
			if(!context && i < elements.length - 1) {
				//TODO error
				console.log("undefined or null path element")
			}
		}
		
		return context;
	}
}

Binder = function() {
	this.currentContext = null;	
	this.actionBindings = [];
	
	this.error = function(error) {
		console.log(error);
	}
	
	this.afterDomAttached = function() {
		
		var bindings = _.clone(this.actionBindings);
		while(bindings.length > 0) {
			var binding = bindings.shift();
			$('.' + binding.id).on(binding.event, binding.callback);	
		}
	}
}
var binder = new Binder();

//<a {{action 'callback'}}
Handlebars.registerHelper('action', function(callbackPath, options) {
	var callback = binder.currentContext.find(callbackPath);
	if(!_.isFunction(callback)) 
		binder.error("TODO");
	else {
		var binding = new ActionBinding(callback);
		binder.actionBindings.push(binding);
		
		return "class=" + binding.id;
	}
})

//Handlebars.registerHelper('_with', Handlebars.helpers['with']);
//Handlebars.registerHelper('with', function(context, options) {});