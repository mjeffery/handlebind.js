var _ = require('underscore'),
	$ = require('jquery'),
	CaptionContext = require('./options/CaptionContext'),
	OptionListContext = require('./options/OptionListContext'),
	SelectedOptionsContext = require('./options/SelectedOptionsContext'),
	RenderContext = require('./RenderContext');

var OptionsContext = RenderContext.extend({
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
		
		context = OptionListContext.extend({
			init: function(options) {
				this._super(options);
				this._selected = options.selected;	
			},
			
			renderContent: function(options) {
				var context, ret = this._super(options);
				
				if(this._selected) {
					context = new SelectedOptionsContext({
						target: this._selected,
						parent: this,
						model: this.target()
					});
					ret += context.render();
				}
				
				return ret;
			}
				
		}).invoke({
			target: this._target,
			parent: this,
			text: this._text,
			selected: this._selected
		});
		
		ret += context.render();
		
		return ret;
	}
});

module.exports = OptionsContext;