define([], function() {
	/**
	 * @class Subscription 
	 */
	return function(target, callback, disposeCallback) {
		this.target = target;
		this.callback = callback;
		this.disposeCallback = disposeCallback;
		
		this.dispose = function() {
			this.isDisposed = true;
			this.disposeCallback();
		}
	}
})
