define(
['observe/observable', 'observe/observableArray', 'observe/computed',
 'bind/helpers/with', 'bind/helpers/if', 'bind/helpers/each', 
 'bind/helpers/value', 'bind/helpers/html', 'bind/helpers/unbound', 'bind/helpers/action'], 
function(observable, observableArray, computed) {
	return {
		observable: observable,
		observableArray: observableArray,
		computed: computed
	}
});
