var _ = require('underscore'),
	$ = require('jquery'),
	UpdatingContext = require('../UpdatingContext'),
	dom = require('../../util/dom');

var SelectedOptionsContext = UpdatingContext.extend({
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
				var element = $('script#' + id).parent('select'),
					isMultiple = element.prop('multiple'),
					model = _.isFunction(this._model) ? this._model() : this._model,
					illegalOptions = [];
							
				this._is_updating = true;
				element.attr(name, id);
				
				if(isMultiple) 	{
					illegalOptions = _.difference(value, model);
					value = _.without(value, illegalOptions);
				}
				else if(!_.contains(model, value)) 
					value = null;
				
				this.pushValue(value);
				
				if(_.isSubscribable(target)) 
					_.isObservableArray(target) ? target.removeAll(illegalOptions) : target(value); //TODO should perform isMultiple check

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
		optionElements.each(function() {
			var option = $(this);
			option.prop('selected', _.contains(selected, +option.val()));
		});
		
		if(selected.length == 0) 
			optionElements.filter('[value="-1"]').prop('selected', true);
	},
	
	pullValue: function() {
		var element = dom.boundElement(this),
			isMultiple = element.prop('multiple'),
			selectedOptions = element.children('option:selected'),
			model = _.isSubscribable(this._model) ? this._model() : this._model,
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

module.exports = SelectedOptionsContext;