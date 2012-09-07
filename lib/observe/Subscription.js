/**
 * @class Subscription 
 */
var Subscription = function(target, callback, disposeCallback) {
	this.target = target;
	this.callback = callback;
	this.disposeCallback = disposeCallback;
	
	this.dispose = function dispose() {
		this.isDisposed = true;
		this.disposeCallback();
	}
};

module.exports = Subscription;