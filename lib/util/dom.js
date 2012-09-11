var $ = require('jquery');

var dom = {
	boundSelector: function(data) { //TODO establish a prototype for dom somehow
		var name = data._bind_name,
			id = data._bind_id;
		return '[' + name + '="' + id + '"]';
	},
	
	boundElement: function(data) {  //TODO 'bind_name' and 'bind_id' are both internal
		var name = data._bind_name,
			id = data._bind_id;
		return $('[' + name + '="' + id + '"]');
	}
};

module.exports = dom;
