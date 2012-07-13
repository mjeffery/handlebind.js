define(['lib/underscore'], function(_) {
	
	function override(func, superFunc) {
		function K() {}
	
	  	var newFunc = function() {
	  		var ret, sup = this._super;
	    	this._super = superFunc || K;
	    	ret = func.apply(this, arguments);
	    	this._super = sup;
	    	return ret;
	  	};
	
	 	newFunc.base = func;
	  	return newFunc;
	}
	
	var NATIVES = [Boolean, Object, Number, Array, Date, String];
	function isMethod(obj) {
	  	if ('function' !== typeof obj || obj.isMethod === false) { return false; }
	  	return _.indexOf(NATIVES, obj) < 0;
	}
	
	function initMixin(mixin, args) {
		if(args && args.length > 0) {
			mixin.mixins = _.map(args, function(x) {
				if(x instanceof Mixin) { return x; }
				
				// Note: Manually setup a primitive mixin here.  This is the only
      			// way to actually get a primitive mixin.  This way normal creation
      			// of mixins will give you combined mixins...
				var mixin = new Mixin();
				mixin.properties = x;
				return mixin;
			});
		}
		return mixin;
	};
	
	function applyMixins(mixins, base) {
		var len = mixins.length, idx, mixin, props, key, value, ovalue;
		
		for(idx = 0; idx < len; idx++) {
			mixin = mixins[idx];
			//assert (expected hash or Mixin)
			
			if(mixin instanceof Mixin) {
				//ember guid logic
				props = mixin.properties;
			}
			else 
				props = mixin; // apply anonymous mixin properties
				
			if(props) {
				for(key in props) {
					if(!props.hasOwnProperty(key)) { continue; }
					value = props[key];
					
					if(isMethod(value)) {
						ovalue = base[key];
						if(!_.isFunction(ovalue)) { ovalue = null; }
						if(ovalue) 
							value = override(value, ovalue);
					}
					
					base[key] = value;
				}
			}
			else if(mixin.mixins) {
				applyMixins(mixin.mixins, base);
			}
		}
	}
	
	function Mixin() { return initMixin(this, arguments); }
	
	Mixin._apply = applyMixins;
	
	Mixin.create = function() {
		var M = this;
		return initMixin(new M(), arguments);
	}
	
	Mixin.prototype.reopen = function() {
		var mixin, tmp;
		
		if(this.properties) {
			mixin = Mixin.create();
			mixin.properties = this.properties; //TODO where does this come from
			delete this.properties;
			this.mixins = [mixin];
		}
		else if(!this.mixins) {
			this.mixins = [];
		}
		
		var len = arguments.length, mixins = this.mixins, idx;
		
		for(idx = 0; idx < len; idx++) {
			mixin = arguments[idx];
			//assert expecting a mixin https://github.com/emberjs/ember.js/blob/master/packages/ember-metal/lib/mixin.js line 382
			
			if(mixin instanceof Mixin) {
				mixins.push(mixin);
			}
			else {
				tmp = Mixin.create();
				tmp.properties = mixin;
				mixins.push(tmp);
			}
		}
		
		return this;
	};
	
	var TMP_ARRAY = [];
	Mixin.prototype.apply = function(obj) {
		TMP_ARRAY[0] = this;
		var ret = applyMixins(TMP_ARRAY, obj);
		TMP_ARRAY.length = 0;
		return obj;
	};
	
	return Mixin;
});