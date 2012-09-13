var _ = require('underscore'),
	$ = require('jquery'),
	BindingContext = require('./BindingContext'),
	RenderContext = require('./RenderContext'),
	MetamorphContext = require('./MetamorphContext'),
	TextContext = require('./TextContext'),
	UpdatingContext = require('./UpdatingContext'),
	dom = require('../util/dom'),
	nullSafe = require('../util/nullSafe');
	
var CaptionContext = RenderContext.extend({
	init: function(options) {
		this._super(options);
	
		//TODO we do this alot it seems...
		_.defaults(options, {
			bind_name: 'caption-bind',
			bind_id: _.uniqueId('hb') 
		});
		
		this._bind_name = options.bind_name;
		this._bind_id = options.bind_id;
	},
	
	render: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target,
			ret ="";
		
		//TODO convert the value safely to an empty string when its undefined
		
		ret += '<option value="-1"';
		if(this.bind()) 
			ret += this._bind_name + '="' + this._bind_id + '"'
		ret += '>' + value + '</option>'
			
		return ret;
	},
	
	rerender: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target;
		dom.boundElement(this).text(value);
	}
});	

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

//TODO update View#_eventHandler to special case 'change' events from a 'select' element
var SelectedOptionContext = UpdatingContext.extend({
	init: function(options) {
		options.bind_name = 'selected-bind';
		options.bind_id = _.uniqueId('hb');
		options.update = 'change';
		
		this._super(options);
		
		if(!options.model)
			throw new Exception('Cannot bind selected values without a <select> model');
		this._model = options.model;	
	},
	
	render: function() {
		var target = this.target(),
			value = _.isFunction(target) ? target() : target,
			name = this._bind_name,
			id = this._bind_id;
		
		this._registerEvents(target);
		
		// add the 'selected-bind=<id>' to the parent select component to intercept the registered events
		// then push the values
		if(_.isFunction(this.$rootContext.doPostRender)) {
			this.$rootContext.doPostRender(function select_PostRender() {
				$('script#' + id).parent('select').attr(name, id);
				this._is_updating = true;
				this.pushValue(value);
				this._is_updating = false;
			}, this);
		}
		
		return '<script id="' + id + '" type="text/x-placeholder"></script>';
	},
	
	pushValue: function(value) {
		var selected, model = _.isSubscribable(this._model) ? this._model() : this._model, //TODO extract subscribable helper
			element = dom.boundElement(this),
			isMultiple = element.prop('multiple'),
			optionElements = element.children('option'); 
		
		//process the selection
		if(_.isUndefined(value) || _.isNull(value))
			selected = [];
		else if (_.isArray(value))
			selected = value;
		else
			selected = [value];
		
		selected = _.reduce(selected, function(memo, next) { 
			var i = _.indexOf(model, next);
			if(i > -1) memo.push(i);
			return memo;
		}, []);
		
		//assign the selection
		if(selected.length > 0) {	
			optionElements.each(function() {
				var option = $(this);
				option.prop('selected', _.contains(selected, +option.val()));
			});
		}
		else
			optionElements.filter('[value="-1"]').prop('selected', true);
	},
	
	pullValue: function() {
		var element = dom.boundElement(this),
			isMultiple = element.prop('multiple'),
			selectedOptions = element.children('option:selected'),
			model = _.isSubscribable(this._model) ? this._model() : this.model,
			index, value = [];
			
		//extract the backing model at each selected index	
		selectedOptions.each(function() {
			index = $(this).val();
			if(index >= 0) //caption is at '-1' by default
				value.push(model[index]);
		});
		
		//if its not multiple select, use the first selected option
		if(!isMultiple)
			value = value.length > 0 ? value[0] : undefined;
			
		return value;
	}
});

var OptionsContext = BindingContext.extend({
	init: function(options) {
		this._super(options);
		
		this._caption = options.caption;
		this._text = options.text;
		this._selected = options.selected;
	},
	
	render: function() {
		var context, ret = "";
		
		if(this._caption) { //TODO? this._caption !== false so a 'null' option is only explicitly disabled by 'caption=false'
			context = new CaptionContext({
				target: this._caption,
				parent: this
			});
			
			ret += context.render();
		}
		
		//TODO? have this be a subclass of OptionListContext and call _super() here
		context = new OptionListContext({
			target: this._target,
			parent: this,
			text: this._text
		});
		ret += context.render();
		
		if(this._selected) {
			context = new SelectedOptionContext({
				target: this._selected,
				parent: this,
				model: this.target()
			});
			ret += context.render();
		}
		
		return ret;
	}
});

module.exports = OptionsContext;