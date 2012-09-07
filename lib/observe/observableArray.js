var _ = require('underscore'),
	observable = require('./observable'),
	dependencyDetection = require('./dependencyDetection');
	
_.mixin({
	"isObservableArray": function(instance) {
		 return _.isSubscribable(instance) && instance.__observableArray === true;
	}
})

var observableArray = function(initialValue) {
	if(arguments.length == 0) {
		//No arg constructor initializes to empty array
		initialValue = [];
	}
	if(initialValue !== null && initialValue !== undefined && !('length' in initialValue))
		throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined");
	
	var result = observable(initialValue);
	
	// convenience method for removing values from underlying array
	result.remove = function remove(valueOrPredicate) {
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
	result.removeAll = function removeAll(arrayOfValues) {
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
	
	result.destroy = function destroy(valueOrPredicate){
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
	
	result.destroyAll = function destroyAll(arrayOfValues){
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
	
	result.indexOf = function indexOf(item) {
		var underlyingArray = this();
		return _.indexOf(underlyingArray, item);
	};
	
	result.replace = function replace(oldItem, newItem) {
		var index = this.indexOf(oldItem);
		if(index >= 0) {
			this.valueWillMutate();
			this.peek()[index] = newItem;
			this.valueHasMutated();
		}
	};
	
	_.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(methodName) {
		result[methodName] = function() {
			var underlyingArray = this.peek();
			this.valueWillMutate();
			var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
			this.valueHasMutated();
			return methodCallResult;
		};
	});
	
	result.slice = function slice() {
		var underlyingArray = this();
		return underlyingArray.slice(arguments);
	}
	
	result.__observableArray = true;
	
	return result;
};

module.exports = observableArray;