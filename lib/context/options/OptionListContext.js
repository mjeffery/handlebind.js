var _ = require('underscore'),
	MetamorphContext = require('../MetamorphContext'),
	TextContext = require('../TextContext'),
	UpdatingContext = require('../UpdatingContext'),
	nullSafe = require('../../util/nullSafe');
	

var OptionListContext = MetamorphContext.extend({
	init: function(options) {
		this._super(options);
		
		_.defaults(options, {
			text: function(item) { return nullSafe.toString(item); },
		});
		
		var text = _.isSubscribable(text) ? options.text() : options.text; //TODO this does not create a binding... We CAN use dependency detection...
		
		//a string or an index with be interpreted as a property
		if(_.isString(text) || _.isNumber(text)) {
			var propertyName = text;
			this._text = function(item) {
				return item[propertyName];
			}
		}
		//functions pass through
		else if(_.isFunction(text)) {
			this._text = text		
		}
		//everything else takes damage
		else
			throw new Error('"text" must be either a string or a function');
	},
	
	renderContent: function(options) {
		var optionContext, ret = "";
		
		if(options && options.length > 0) {
			for(var i=0, len=options.length; i<len; i++) {
				optionContext = new TextContext({
					target: this._text(options[i]),
					parent: this
				});
				
				ret += '<option value="' + i + '" >' + optionContext.render() +'</option>';
			}
		}
		
		return ret; 
	}
});

module.exports = OptionListContext;