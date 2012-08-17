var nullSafe = {
	toString: function(value) {
		if(value !== undefined && value !== null)
			return value.toString();
		return "";
	}
};

module.exports = nullSafe;