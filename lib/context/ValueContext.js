var _ = require('underscore'),
	nullSafe = require('../util/nullSafe'),
	dom = require('../util/dom'),
	UpdatingContext = require('./UpdatingContext');

var VALID_UPDATES = ['change', 'keyup']; // 'afterkeydown' should be here for immediate updating
	
var ValueContext = UpdatingContext.extend({
		
	init: function(options) {
		this._super(options);
		
		_.defaults(options, { update: 'change' });
		
		if(!_.include(VALID_UPDATES, options.update))
			throw new Error('The update policy "' + options.update + '" is not supported by {{value}}');
	},
	
	renderValue: function(value) {
		return ' value="' + nullSafe.toString(value) + '" ';
	},
	
	pushValue: function(value) {
		dom.boundElement(this).attr('value', nullSafe.toString(value));
	},
	
	pullValue: function() {
		return dom.boundElement(this).attr('value');
	}
});

module.exports = ValueContext;