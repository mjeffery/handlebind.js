define(
['lib/underscore', 'lib/jquery', './RenderContext'], 
function(_, $, RenderContext) {
	return RenderContext.extend({
		
		_attached: false,
		
		init: function(options) {
			this._super(options);
			
			_.defaults(options, {
				event: 'click',
				handler: function() {},
				data: undefined
			});
			
			this._id = _.uniqueId('action');
			this._event = options.event;
			this._handler = options.handler;
			this._data = options.data;
			
			this.on('attach', function() { this.rerender() });
		},
		
		render: function() {
			return new Handlebars.SafeString('handlebind="' + this._id + '"');
		},
		
		rerender: function() {
			this._isAttached =  $('[handlebind~="' + this._id + '"]').on(this._event, this._data, this._handler).length > 0;
		},
		
		dispose: function() {
			$('[handlebind~="' + this._id + '"]').off(this._event, this._data, this._handler);
			this._super();
		}
	});
});