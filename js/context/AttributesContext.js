define(
['lib/underscore', 'lib/jquery', 'observe/subscribable', './RenderContext', './AttributeContext'], 
function(_, $, subscribable, RenderContext, AttributeContext) {
	
	return RenderContext.extend({
		
		init: function(options) {
			this._super(options);
			
			_.defaults(options, {
				bind_name: 'attr-bind',
				bind_id: _.uniqueId('hb')
			});
			
			this._bind_name = options.bind_name;
			this._bind_id = options.bind_id;
		},
		
		render: function() {
			var ret="", i, len, child;
			
			this._ensureChildren();
			ret += this._bind_name + '="'+ this._bind_id + '" ';
			
			for(i = 0, len = this.children.length; i < len; i++) 
				ret += children[i].render() + ' ';
		},
		
		rerender: function() {
			var element = $('['+ this._bind_name + '="' + this._bind_id +'"]'),
				i, len;
				
			for(i = 0, len = this.children.length; i < len; i++) 
				element.removeAttr(this.children[i]._name);
				
			this._ensureChildren();
			
			for(i = 0, len = this.children.length; i < len; i++) {
				child = this.children[i];
				element.attr(child._name, child._getAttributeValue());
			}
		},
			
		_ensureChildren: function() {	//TODO should this return the children array instead?
			this.disposeChildren();
			
			var target = this.target(),
				attributes = _.isFunction(target) ? target() : target,
				key, attribute;	
			
			if(!_.isObject(attributes)) return;	//TODO warn somehow?
			
			for(key in attributes) {
				if(!attributes.hasOwnProperty(key)) continue;
				
				attribute = attributes[key];
				
				new AttributeContext({
					name: key,
					target: attribute,
					parent: this,
					bind_name: this._bind_name,
					bind_id: this._bind_id
				});
			}
		}
	});
	
	return AttributesContext;
});