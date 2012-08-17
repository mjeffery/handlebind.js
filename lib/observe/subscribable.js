var _ = require('underscore'),
	arrays = require('../util/arrays'),
	Subscription = require('./Subscription');
	
_.mixin({
	"isSubscribable": function(instance) {
		 return !!instance && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
	}
})

var defaultEvent = "change";

var subscribable = function() {
	this._subscriptions = {};
	
	this.subscribe = function(callback, callbackTarget, event) {
		event = event || defaultEvent;
		var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
		
		var subscription = new Subscription(this, boundCallback, function() {
			arrays.remove(this._subscriptions[event], subscription);
		}.bind(this));
		
		if(!this._subscriptions[event])
			this._subscriptions[event] = [];
		this._subscriptions[event].push(subscription);
		return subscription;
	};
	
	this.notifySubscribers = function(valueToNotify, event) {
		event = event || defaultEvent;
		if(this._subscriptions[event]) {
			_.each(this._subscriptions[event].slice(0), function(subscription) {
				if(subscription && (subscription.isDisposed !== true))
					subscription.callback(valueToNotify); //TODO this immediately triggers the callback...  defer until resolution?
			})
		}
	};
	
	this.getSubscriptionsCount = function() {
		var total = 0;
		for(var eventName in this._subscriptions) {
			if(this._subscriptions.hasOwnProperty(eventName))
				total += this._subscriptions[eventName].length;
		}
		return total;
	}
};

module.exports = subscribable;