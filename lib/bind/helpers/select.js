var _ = require('underscore'),
	$ = require('jquery'),
	Handlebars = require('handlebars'),
	RenderContext = require('../../context/RenderContext'),
	context = require('../context'),
	nullSafe = require('../../util/nullSafe');

var SelectCaptionContext = RenderContext.extend({
	init: function(options) {
		this._super(options);
		
		_.defaults(options, {
			bind_name: 'options-bind',
			bind_id: _.uniqueId('hb')
		});
		
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
	}
});

var SelectOptionsContext = RenderContext.extend({
	
	init: function(options) {
		this._super(options);
		
		_.defaults(options, {
			caption: undefined,
			text: function(item) { return nullSafe.toString(item); },
			bind_name: 'options-bind',
			bind_id: _.uniqueId('hb')
		});
		
		this._caption = options.caption;
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
		
		//a string or an index with be interpreted as a property
		if(_.isString(options.text) || _.isNumber(options.text)) {
			var propertyName = options.text;
			this._text = function(item) {
				return nullSafe.toString(item[propertyName]);
			}
		}
		//functions pass through
		else if(_.isFunction(options.text))
			this.text = options.text
		//everything else takes damage
		else
			throw new Error('"text" must be either a string or a function');
	},
	
	render: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target;	
			
		// the options helper requires an array
		if(!_.isArray(value))
			throw new Error("{{options}} requires an array as its context");
		//if the array has no data...
		else if(value.length < 1) {
			return "<option></option>"
		}
		else {
			
		}
	}
});

Handlebars.registerHelper('options', function(target, options) {
	var ret,
		selectContext = new SelectOptionsContext({
			target: target,
			parent: context(),
			bind: !(options.hash['unbound'] === true),
			text: options.hash['text'],	
			caption: options.hash['caption'],
			selected: options.hash['selected']
		});
		
	context(selectContext);
	ret = selectContext.render();
	context.pop();
	
	return new Handlebars.SafeString(ret);
});
