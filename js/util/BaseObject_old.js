define(['lib/underscore', './Mixin'], function(_, Mixin) {
	function makeCtor() {
		
		var wasApplied = false, initMixins, init = false;
		
		var Class = function() {
			if(!wasApplied) { Class.proto(); }
			if(initMixins) {
				this.reopen.apply(this, initMixins);
				initMixins = null;
				this.init.apply(this, arguments);
			}
			else {
				if(init === false) { init = this.init; } // cache for later instantiations ???
				init.apply(this, arguments);
			}
		};
		
		Class.willReopen = function() {
			if(wasApplied) {
				Class.PrototypeMixin = Mixin.create(Class.PrototypeMixin);
			}
			wasApplied = false;
		};
		Class._initMixins = function(args) { initMixins = args; };
		
		Class.proto = function() {
			var superclass = Class.superclass;
			if(superclass) { superclass.proto(); }
			
			if(!wasApplied) {
				wasApplied = true;
				Class.PrototypeMixin.apply(Class.prototype);  //TODO find correct signature for applyPartial
			}
			
			return this.prototype;
		}
		
		return Class;
	}
	
	var BaseObject = makeCtor();
	
	BaseObject.PrototypeMixin = Mixin.create({
		reopen: function() {
			Mixin._apply(arguments, this); //TODO find correct signature for apply
			return this;
		},
		
		isInstance: true,
		
		init: function() {}
		
		//toString: function() { return '<' + this.constructor.toString() + ':' + guidFor(this) + '>'; }
	});
	
	BaseObject.__super__ = null;
	
	var ClassMixin = Mixin.create({
		
		isClass: true,
		isMethod: false,
		
		extend: function() {
			var Class = makeCtor(), proto;
			Class.ClassMixin = Mixin.create(this.ClassMixin);
			Class.PrototypeMixin = Mixin.create(this.PrototypeMixin);
			
			Class.ClassMixin.ownerConstructor = Class;
    		Class.PrototypeMixin.ownerConstructor = Class;
    		
    		Class.superclass = this;
		    Class.__super__  = this.prototype;
		
		    proto = Class.prototype = Object.create(this.prototype); //TODO shim for Object.create?
		    proto.constructor = Class;
		
		    Class.ClassMixin.apply(Class);
		    return Class;
		},
		
		create: function() {
			var C = this;
			if(arguments.length > 0) { this._initMixins(arguments); }
			return new C();
		},
		
		reopen: function() {
			var PrototypeMixin = this.PrototypeMixin;
			PrototypeMixin.reopen.apply(PrototypeMixin, arguments);
			return this;
		},
		
		reopenClass: function() {
			var ClassMixin = this.ClassMixin;
			ClassMixin.reopen.apply(this, arguments);
			Mixin._apply(this, arguments);
			return this;
		}
	});
	
	BaseObject.ClassMixin = ClassMixin;
	ClassMixin.apply(BaseObject);
	
	return BaseObject;
});
