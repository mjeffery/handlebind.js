var _ = require('underscore'),
	observable = require('./observable'),
	dependencyDetection = require('./dependencyDetection');
	
_.mixin({
	"isObservableArray": function(instance) {
		 return _.isSubscribable(instance) && instance.__observableArray === true;
	}
})

var observableArray = function(initialValue) {
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
	
	result.destroy = function(valueOrPredicate){
		var underlyingArray = this.peek();
        var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
        this.valueWillMutate();
        for (var i = underlyingArray.length - 1; i >= 0; i--) {
            var value = underlyingArray[i];
            if (predicate(value))
                underlyingArray[i]["_destroy"] = true;
        }
        this.valueHasMutated();
	}
	
	result.destroyAll = function(arrayOfValues){
		// If you passed zero args, we destroy everything
        if (arrayOfValues === undefined)
            return this['destroy'](function() { return true });

        // If you passed an arg, we interpret it as an array of entries to destroy
        if (!arrayOfValues)
            return [];
        return this['destroy'](function (value) {
            return _.indexOf(arrayOfValues, value) >= 0;
        });
	}
	
	//TODO finish copying over other observableArray code from knockout.js
	
	result.__observableArray = true;
	
	return result;
};

module.exports = observableArray;