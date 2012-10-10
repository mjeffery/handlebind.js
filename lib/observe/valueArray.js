var _ = require('underscore');

function valueArray(initValue) {
	
	var array = _.isArray(initValue) ? initvalue : [];
	
	var valueArray = function() {
		if(arguments.length === 0)
			return array;
		else {
			var arg = arguments[0];
			if(_.isArray(arg))
				array = arg;
			else
				throw "Cannot assign " + typeof arg + " with an ArrayAcessor";
		}
	}
	
	valueArray.length = array.length;
			
	valueArray.pop = function() {
		var retVal = array.pop();
		valueArray.length = array.length;
		return retVal;
	}
	
	valueArray.push = function(item) {
		array.push(item);
		valueArray.length = array.length;
	}
	
	valueArray.reverse = function() {
		array.reverse();
		return valueArray;
	}
	
	valueArray.shift = function() {
		var retVal = array.shift();
		valueArray.length = array.length;
		return retVal;
	}
	
	valueArray.sort = function(comparator) {
		array.sort(comparator);
	}
	
	//TODO splice, unshift, concat, join, slice, toString, indexOf
			
	return valueArray;
}

module.exports = valueArray;
