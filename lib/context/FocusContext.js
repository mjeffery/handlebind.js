var $ = require('jquery'),
	dom = require('../util/dom'),
	UpdatingContext = require('./UpdatingContext');

var FocusContext = UpdatingContext.extend({
	init: function(options) {
		options.update = ['focusin', 'focusout'];
		options.bind_name = 'focus-bind';
		
		this._super(options);
	},
	
	renderValue: function(value) {
		if(value && _.isFunction(this.$rootContext.setFocus))
			this.$rootContext.setFocus(dom.boundSelector(this))
		return '';
	},
	
	pushValue: function(value) {
		var activeElement = $( document.activeElement ),
			element = dom.boundElement(this).get(0),
			isFocused = activeElement.is(element);
		
		if(value != isFocused) 
			value ? element.focus() : element.blur();
	},
	
	pullValue: function() {
		var activeElement = $( document.activeElement ),
			element = dom.boundElement(this).get(0);
		
		return activeElement.is(element);
	}
});

module.exports = FocusContext;
