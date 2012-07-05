define(
['observe/observable', 'observe/observableArray', 'observe/computed',
 'bind/helpers/value', 'bind/helpers/html', 'bind/helpers/with', 'bind/helpers/if', 'bind/helpers/unbound'], 
function(observable, observableArray, computed) {
	return {
		observable: observable,
		observableArray: observableArray,
		computed: computed
	}
});
