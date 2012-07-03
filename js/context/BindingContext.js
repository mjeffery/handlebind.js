define(['lib/underscore'], function(_) {
	return function(target) {
		
		this.target = target;
		
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
})
