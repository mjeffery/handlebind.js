define(
['observe/observable', 'observe/observableArray', 'observe/computed',
 'bind/helpers/with', 'bind/helpers/if', 'bind/helpers/each', 
 'bind/helpers/text', 'bind/helpers/html', 'bind/helpers/unbound', 
 'bind/helpers/events', 'bind/helpers/template', 'bind/helpers/class',
 'bind/helpers/value'], 
function(observable, observableArray, computed) {
	return {
		observable: observable,
		observableArray: observableArray,
		computed: computed
	}
});
