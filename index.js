require('./lib/bind/helpers/with');
require('./lib/bind/helpers/if');
require('./lib/bind/helpers/each');
require('./lib/bind/helpers/text');
require('./lib/bind/helpers/html');
require('./lib/bind/helpers/unbound');
require('./lib/bind/helpers/events');
require('./lib/bind/helpers/template');
require('./lib/bind/helpers/attrs');
require('./lib/bind/helpers/class');
require('./lib/bind/helpers/value');
require('./lib/bind/helpers/enabled');
require('./lib/bind/helpers/disabled');
require('./lib/bind/helpers/checked');
require('./lib/bind/helpers/focused');
require('./lib/bind/helpers/options');
require('./lib/bind/helpers/props');

require('./lib/bind/helpers/action');

var Handlebind = {
	observable: require('./lib/observe/observable'),
	observableArray: require('./lib/observe/observableArray'),
	computed: require('./lib/observe/computed'),
	
	View: require('./lib/bind/View')
};

module.exports = Handlebind;