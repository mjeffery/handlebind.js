var _ = require('underscore'),
	subscribable = require('./subscribable'),
	dependencyDetection = require('./dependencyDetection');
	
var primitiveTypes = { 'undefined':true, 'boolean':true, 'number':true, 'string':true }
	
var observable = function(initialValue) {
	var _latestValue = initialValue;
	
	function observable() {
		if(arguments.length > 0) {
			// Write
			if((!observable['equalityComparer']) || !observable['equalityComparer'](_latestValue, arguments[0])) {
				observable.valueWillMutate(); //TODO defer this until property resolution?
				_latestValue = arguments[0];
				observable.valueHasMutated();
			}
			
			return this;
		}
		else {
			// Read
			dependencyDetection.registerDependency(observable);
			return _latestValue;
		}
	}
	
	subscribable.call(observable); //user observable as 'this' for subscribable
	
	observable.peek = function() { return _latestValue };
	observable.valueHasMutated = function() { observable.notifySubscribers(_latestValue) };
	observable.valueWillMutate = function() { observable.notifySubscribers(_latestValue, 'beforeChange') };
	
	//TODO this primitive only compare isn't good for BigMoney etc
	observable.equalityComparer = function(a,b) {
		var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
		return oldValueIsPrimitive ? (a === b) : false;
	}
	
	//TODO 'isObservable' 
	
	return observable;
};

module.exports = observable;