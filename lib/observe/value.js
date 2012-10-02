function value(initValue) {
	var val = initValue || null;
			
	return function() {
		if(arguments.length === 0)
			return val;
		else
			val = arguments[0]; //TODO should this return?
	}
}

module.exports = value;