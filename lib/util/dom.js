var $ = require('jquery');

var dom = {
	boundElement: function(data) {  //TODO 'bind_name' and 'bind_id' are both internal
		var name = data._bind_name,
			id = data._bind_id;
		return $('[' + name + '="' + id + '"]');
	}
};

module.exports = dom;
