define(['lib/underscore'], function(_) {
	
	var GUID_KEY = '__guid' + (+ new Date()),
		GUID_DESC = {
			writable: false,
			configurable: false,
			enumerable: false,
			value: null
		},
		numberCache = [],
		StringCache = {};
	
	function generateGuid(obj, prefix) {
		if(!prefix) prefix = 'guid';
		var ret = _.uniqueId(prefix);
		if(obj) {
			GUID_DESC.value = ret;
			Object.defineProperty(obj, GUID_KEY, GUID_DESC);
		}
		
		return ret;
	}
	
	 function guidFor(obj) {
		if(obj === undefined) return "(undefined)";
		if(obj === null) return "(null)";
		
		var ret, type = typeof obj;
		
		switch(type) {
			case 'number':
				ret = numberCache[obj];
				if (!ret) ret = numberCache[obj] = 'num'+obj;
				return ret;
			break;
			
			case 'string':
				ret = stringCache[obj];
				if (!ret) ret = stringCache[obj] = _.uniqueId('str');
				return ret;
			break;
			
			case 'boolean':
				return obj ? '(true)' : '(false)';
			
			default:
				if(obj[GUID_KEY]) return obj[GUID_KEY];
				if(obj === Object) return '(Object)';
				if(obj === Array) return '(Array)';
				ret = _.uniqueId('guid');
				GUID_DESC.value = ret;
				Object.defineProperty(obj, GUID_KEY, GUID_DESC);
				return ret;
		}
	}
	
	return guidFor;
});