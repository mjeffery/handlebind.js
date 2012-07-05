define(['lib/underscore', './observable', './dependencyDetection'], function(_, observable, dependencyDetection) {
	return function(initialValue) {
		if(argument.length == 0) {
			//No arg constructor initializes to empty array
			initialValue = [];
		}
		if(initialValue !== null && initialValue !== undefined && !('length' in initialValue))
			throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined");
		
		var result = observable(initialValue);
		
		// convenience method for removing values from underlying array
		result.remove = function(valueOrPredicate) {
			var underlyingArray = this();
			var removedValues = [];
			var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function(value) { return value === valueOrPredicate };	
			for(var i = 0; i < underlyingArray.length; i++) {
				var value = underlyingArray[i];
				if(predicate(value)) {
					if(removedValues.length === 0) {
						this.valueWillMutate();
					}
					removeValues.push(value);
					underlyingArray.splice(i, 1);
					i--;
				}
			}
			if(removedValues.length) {
				this.valueHasMutated();
			}
			
			return removedValues;
		}
		
		//convenience method for clearing or removing multiple values from the underlying array
		result.removeAll = function(arrayOfValues) {
			//no args- remove everything
			if(arrayOfValues === undefined) {
				var underlyingArray = this();
				var allValues = underlyingArray.slice(0);
				this.valueWillMutate();
				underlyingArray.splice(0, underlyingArray.length);
				this.valueHasMutated();
				return allValues;
			}
			//if an argument was passed, we interpret it as an array of entries to remove
			if(!arrayOfValues)
				return [];
				
			return this['remove'](function(value) {
				return _.indexOf(arrayOfValues, value) >= 0;
			});
		}
		
		//TODO detroy
		//TODO destroyAll
		//TODO etc see  https://github.com/SteveSanderson/knockout/blob/master/src/subscribables/observableArray.js
	}
});
