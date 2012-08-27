(function(root){
	var __modules = {}, __defines = {};
	function uncommon(id) {
		if(!__modules.hasOwnProperty(id)) {
			
			if(!__defines.hasOwnProperty(id))
				throw new Error('The module "' + id + '" could not be found');
			
			var module = { exports: {} };
			Object.defineProperty(module, 'id', { //TODO? polyfill defineProperty
				writeable: false, 
				configurable: false, 
				enumerable: true, 
				value: new String(id) 
			});
			
			__defines[id].call(root, uncommon, module);
			__modules[id] = module.exports;	
		}
		
		return __modules[id];
	};
	
	uncommon.define = function(path, def) {
		if(__defines.hasOwnProperty(path))
			throw new Error('Attempting to redefine module "'+ module + '"');
			
		__defines[path] = def;
	}
	uncommon.define('underscore', function(require, module) { module.exports = root._; });
	uncommon.define('jquery', function(require, module) { module.exports = root.$; });
	uncommon.define('handlebars', function(require, module) { module.exports = root.Handlebars; });
	uncommon.define('humble', function(require, module) { module.exports = root.atlas; });

	uncommon.define('index.js', function(require, module) {
		require('lib/bind/helpers/with.js');
		require('lib/bind/helpers/if.js');
		require('lib/bind/helpers/each.js');
		require('lib/bind/helpers/text.js');
		require('lib/bind/helpers/html.js');
		require('lib/bind/helpers/unbound.js');
		require('lib/bind/helpers/events.js');
		require('lib/bind/helpers/template.js');
		require('lib/bind/helpers/class.js');
		require('lib/bind/helpers/value.js');
		require('lib/bind/helpers/hasFocus.js');
		var Handlebind = {
		        observable: require('lib/observe/observable.js'),
		        observableArray: require('lib/observe/observableArray.js'),
		        computed: require('lib/observe/computed.js'),
		        View: require('lib/bind/View.js')
		    };
		module.exports = Handlebind;
	});

	uncommon.define('lib/bind/helpers/with.js', function(require, module) {
		var Handlebars = require('handlebars'), MetamorphContext = require('lib/context/MetamorphContext.js'), context = require('lib/bind/context.js');
		Handlebars.helpers['_nobind_with'] = Handlebars.helpers['with'];
		Handlebars.registerHelper('with', function (target, options) {
		    var ret, withContext = MetamorphContext.extend({
		            renderContent: function (value) {
		                if (value)
		                    return options.fn(value);
		                else
		                    return options.inverse(value);
		            }
		        }).invoke({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        });
		    context(withContext);
		    ret = withContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/if.js', function(require, module) {
		var _ = require('handlebars'), MetamorphContext = require('lib/context/MetamorphContext.js'), context = require('lib/bind/context.js');
		Handlebars.helpers['_nobind_if'] = Handlebars.helpers['if'];
		Handlebars.registerHelper('if', function (target, options) {
		    var ret = '', self = this, ifContext = MetamorphContext.extend({
		            renderContent: function (value) {
		                var result = '';
		                if (!value || Handlebars.Utils.isEmpty(value))
		                    result = options.inverse(self);
		                else
		                    result = options.fn(self);
		                return new Handlebars.SafeString(result);
		            }
		        }).invoke({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        });
		    context(ifContext);
		    ret = ifContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/each.js', function(require, module) {
		var Handlebars = require('handlebars'), MetamorphContext = require('lib/context/MetamorphContext.js'), context = require('lib/bind/context.js');
		Handlebars.helpers['_nobind_each'] = Handlebars.helpers['each'];
		Handlebars.registerHelper('each', function (target, options) {
		    var self = this, fn = options.fn, inverse = options.inverse, ItemContext = MetamorphContext.extend({
		            renderContent: function (item) {
		                return new Handlebars.SafeString(fn(item));
		            }
		        }), eachContext = new MetamorphContext.extend({
		            renderContent: function (items) {
		                var itemContext, ret = '';
		                if (items && items.length > 0) {
		                    for (var i = 0, j = items.length; i < j; i++) {
		                        itemContext = ItemContext.create({
		                            target: items[i],
		                            parent: context()
		                        });
		                        context(itemContext);
		                        ret = ret + itemContext.render();
		                        context.pop();
		                    }
		                } else
		                    ret = inverse(self);
		                return ret;
		            }
		        }).invoke({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        }), ret = '';
		    context(eachContext);
		    ret = eachContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/text.js', function(require, module) {
		var _ = require('underscore'), Handlebars = require('handlebars'), MetamorphContext = require('lib/context/MetamorphContext.js');
		context = require('lib/bind/context.js');
		var ValueContext = MetamorphContext.extend({
		        renderContent: function (value) {
		            return !(!value) ? Handlebars.Utils.escapeExpression(value.toString()) : '';
		        }
		    });
		Handlebars.registerHelper('text', function (target, options) {
		    var ret, valueContext = new ValueContext({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        });
		    context(valueContext);
		    ret = valueContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/html.js', function(require, module) {
		var _ = require('underscore'), Handlebars = require('handlebars'), observable = require('lib/observe/observable.js'), context = require('lib/bind/context.js'), MetamorphContext = require('lib/context/MetamorphContext.js');
		var HtmlContext = MetamorphContext.extend({
		        renderContent: function (value) {
		            return !(!value) ? new Handlebars.SafeString(value.toString()) : '';
		        }
		    });
		Handlebars.registerHelper('html', function (target, options) {
		    var ret, htmlContext = new HtmlContext({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        });
		    context(htmlContext);
		    ret = htmlContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/unbound.js', function(require, module) {
		var Handlebars = require('handlebars'), RenderContext = require('lib/context/RenderContext.js'), context = require('lib/bind/context.js');
		Handlebars.registerHelper('unbound', function (options) {
		    var unboundContext = RenderContext.extend({
		            render: function () {
		                return options.fn(this);
		            }
		        }).invoke({
		            target: null,
		            bind: false,
		            parent: context()
		        }), ret;
		    context(unboundContext);
		    ret = unboundContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/events.js', function(require, module) {
		var _ = require('underscore'), Handlebars = require('handlebars'), EventContext = require('lib/context/EventContext.js'), context = require('lib/bind/context.js');
		Handlebars.registerHelper('events', function (options) {
		    var event, handler, eventContext, id = _.uniqueId('hb');
		    for (event in options.hash) {
		        handler = options.hash[event];
		        eventContext = new EventContext({
		            event: event,
		            target: handler,
		            id: id,
		            parent: context()
		        });
		    }
		    return new Handlebars.SafeString(' event-bind="' + id + '" ');
		});
	});

	uncommon.define('lib/bind/helpers/template.js', function(require, module) {
		var Handlebars = require('handlebars'), TemplateContext = require('lib/context/TemplateContext.js'), context = require('lib/bind/context.js');
		Handlebars.registerHelper('template', function (target, options) {
		    var ret, templateContext = new TemplateContext({
		            target: target,
		            context: options.hash['context'] || this,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        });
		    context(templateContext);
		    ret = templateContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/class.js', function(require, module) {
		var _ = require('underscore'), Handlebars = require('handlebars'), context = require('lib/bind/context.js'), AttributeContext = require('lib/context/AttributeContext.js');
		var ClassContext = AttributeContext.extend({
		        init: function (options) {
		            options.bind_name = 'css-bind';
		            options.bind_id = _.uniqueId('hb');
		            options.name = 'class';
		            this._super(options);
		        },
		        render: function () {
		            var ret = this._super() + ' ';
		            if (this.bound())
		                ret += this._bind_name + '="' + this._bind_id + '" ';
		            return new Handlebars.SafeString(ret);
		        }
		    });
		Handlebars.registerHelper('class', function (target, options) {
		    var ret, classContext = new ClassContext({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true)
		        });
		    context(classContext);
		    ret = classContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/bind/helpers/value.js', function(require, module) {
		var _ = require('underscore'), Handlebars = require('handlebars'), ValueContext = require('lib/context/ValueContext.js'), context = require('lib/bind/context.js');
		Handlebars.registerHelper('value', function (target, options) {
		    var ret, valueContext = new ValueContext({
		            target: target,
		            parent: context(),
		            bind: !(options.hash['unbound'] === true),
		            update: options.hash['update']
		        });
		    context(valueContext);
		    ret = valueContext.render();
		    context.pop();
		    return new Handlebars.SafeString(ret);
		});
	});

	uncommon.define('lib/bind/helpers/hasFocus.js', function(require, module) {
		var _ = require('underscore'), $ = require('jquery'), Handlebars = require('handlebars'), RenderContext = require('lib/context/RenderContext.js'), EventContext = require('lib/context/EventContext.js'), context = require('lib/bind/context.js');
		var HasFocusContext = RenderContext.extend({
		        init: function (options) {
		            this._super(options);
		            _.defaults(options, {
		                bind_name: 'focus-bind',
		                bind_id: _.uniqueId('hb')
		            });
		            this._bind_name = options.bind_name;
		            this._bind_id = options.bind_id;
		            this._updating_target = false;
		        },
		        render: function () {
		            var target = this.target(), value = _.isFunction(target) ? target() : target;
		            if (this.bound())
		                this._bindEvents(target);
		            return new Handlebars.SafeString(this._bind_name + '="' + this._bind_id + '" ');
		        },
		        rerender: function () {
		            if (!this._updating_target) {
		                var target = this.target(), value = _.isFunction(target) ? target() : target, element;
		                this._bindEvents(target);
		                if (this.bound()) {
		                    element = $('[' + this._bind_name + '="' + this._bind_id + '"]').get(0);
		                    value ? element.focus() : element.blur();
		                }
		            }
		        },
		        _bindEvents: function (target) {
		            var self = this;
		            this.disposeChildren();
		            function focusUpdated(isFocused) {
		                var activeElement = $(document.activeElement), element = $('[' + self._bind_name + '="' + self._bind_id + '"]').get(0);
		                isFocused = element.is(activeElement);
		                if (_.isSubscribable(target)) {
		                    self._updating_target = true;
		                    target(isFocused);
		                    self._updating_target = false;
		                }
		            }
		            function bindEvent(event, callback) {
		                new EventContext({
		                    id: self._bind_id,
		                    event: event,
		                    target: callback,
		                    parent: self
		                });
		            }
		            bindEvent('focus', function () {
		                focus(true);
		            });
		            bindEvent('blur', function () {
		                focus(false);
		            });
		        }
		    });
		Handlebars.registerHelper('hasFocus', function (target, options) {
		    var ret, focusContext = new HasFocusContext({
		            target: target,
		            parent: context()
		        });
		    context(focusContext);
		    ret = focusContext.render();
		    context.pop();
		    return ret;
		});
	});

	uncommon.define('lib/observe/observable.js', function(require, module) {
		var _ = require('underscore'), subscribable = require('lib/observe/subscribable.js'), dependencyDetection = require('lib/observe/dependencyDetection.js');
		var primitiveTypes = {
		        'undefined': true,
		        'boolean': true,
		        'number': true,
		        'string': true
		    };
		var observable = function (initialValue) {
		    var _latestValue = initialValue;
		    function observable() {
		        if (arguments.length > 0) {
		            if (!observable['equalityComparer'] || !observable['equalityComparer'](_latestValue, arguments[0])) {
		                observable.valueWillMutate();
		                _latestValue = arguments[0];
		                observable.valueHasMutated();
		            }
		            return this;
		        } else {
		            dependencyDetection.registerDependency(observable);
		            return _latestValue;
		        }
		    }
		    subscribable.call(observable);
		    observable.peek = function () {
		        return _latestValue;
		    };
		    observable.valueHasMutated = function () {
		        observable.notifySubscribers(_latestValue);
		    };
		    observable.valueWillMutate = function () {
		        observable.notifySubscribers(_latestValue, 'beforeChange');
		    };
		    observable.equalityComparer = function (a, b) {
		        var oldValueIsPrimitive = a === null || typeof a in primitiveTypes;
		        return oldValueIsPrimitive ? a === b : false;
		    };
		    return observable;
		};
		module.exports = observable;
	});

	uncommon.define('lib/observe/observableArray.js', function(require, module) {
		var _ = require('underscore'), observable = require('lib/observe/observable.js'), dependencyDetection = require('lib/observe/dependencyDetection.js');
		_.mixin({
		    'isObservableArray': function (instance) {
		        return _.isSubscribable(instance) && instance.__observableArray === true;
		    }
		});
		var observableArray = function (initialValue) {
		    if (argument.length == 0) {
		        initialValue = [];
		    }
		    if (initialValue !== null && initialValue !== undefined && !('length' in initialValue))
		        throw new Error('The argument passed when initializing an observable array must be an array, or null, or undefined');
		    var result = observable(initialValue);
		    result.remove = function (valueOrPredicate) {
		        var underlyingArray = this();
		        var removedValues = [];
		        var predicate = typeof valueOrPredicate == 'function' ? valueOrPredicate : function (value) {
		                return value === valueOrPredicate;
		            };
		        for (var i = 0; i < underlyingArray.length; i++) {
		            var value = underlyingArray[i];
		            if (predicate(value)) {
		                if (removedValues.length === 0) {
		                    this.valueWillMutate();
		                }
		                removeValues.push(value);
		                underlyingArray.splice(i, 1);
		                i--;
		            }
		        }
		        if (removedValues.length) {
		            this.valueHasMutated();
		        }
		        return removedValues;
		    };
		    result.removeAll = function (arrayOfValues) {
		        if (arrayOfValues === undefined) {
		            var underlyingArray = this();
		            var allValues = underlyingArray.slice(0);
		            this.valueWillMutate();
		            underlyingArray.splice(0, underlyingArray.length);
		            this.valueHasMutated();
		            return allValues;
		        }
		        if (!arrayOfValues)
		            return [];
		        return this['remove'](function (value) {
		            return _.indexOf(arrayOfValues, value) >= 0;
		        });
		    };
		    result.destroy = function (valueOrPredicate) {
		        var underlyingArray = this.peek();
		        var predicate = typeof valueOrPredicate == 'function' ? valueOrPredicate : function (value) {
		                return value === valueOrPredicate;
		            };
		        this.valueWillMutate();
		        for (var i = underlyingArray.length - 1; i >= 0; i--) {
		            var value = underlyingArray[i];
		            if (predicate(value))
		                underlyingArray[i]['_destroy'] = true;
		        }
		        this.valueHasMutated();
		    };
		    result.destroyAll = function (arrayOfValues) {
		        if (arrayOfValues === undefined)
		            return this['destroy'](function () {
		                return true;
		            });
		        if (!arrayOfValues)
		            return [];
		        return this['destroy'](function (value) {
		            return _.indexOf(arrayOfValues, value) >= 0;
		        });
		    };
		    result.__observableArray = true;
		    return result;
		};
		module.exports = observableArray;
	});

	uncommon.define('lib/observe/computed.js', function(require, module) {
		var _ = require('underscore'), subscribable = require('lib/observe/subscribable.js'), observable = require('lib/observe/observable.js'), dependencyDetection = require('lib/observe/dependencyDetection.js');
		var computed = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
		    var _latestValue, _hasBeenEvaluated = false, _isBeingEvaluated = false, readFunction = evaluatorFunctionOrOptions;
		    if (readFunction && typeof readFunction == 'object') {
		        options = readFunction;
		        readFunction = options['read'];
		    } else {
		        options = options || {};
		        if (!readFunction)
		            readFunction = options['read'];
		    }
		    if (typeof readFunction != 'function')
		        throw new Error('Pass a function that returns the value of the computed');
		    var writeFunction = options['write'];
		    if (!evaluatorFunctionTarget)
		        evaluatorFunctionTarget = options['owner'];
		    var _subscriptionsToDependencies = [];
		    function disposeAllSubscriptionsToDependencies() {
		        _.each(_subscriptionsToDependencies, function (subscription) {
		            subscription.dispose();
		        });
		        _subscriptionsToDependencies = [];
		    }
		    var disposeWhen = options['disposeWhen'] || function () {
		            return false;
		        };
		    var evaluationTimeoutInstance = null;
		    function evaluatePossibleAsync() {
		        var throttleEvaluationTimeout = computed['throttleEvaluation'];
		        if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
		            clearTimeout(evaluationTimeoutInstance);
		            evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
		        } else
		            evaluateImmediate();
		    }
		    function evaluateImmediate() {
		        if (_isBeingEvaluated) {
		            return;
		        }
		        if (_hasBeenEvaluated && disposeWhen()) {
		            dispose();
		            return;
		        }
		        _isBeingEvaluated = true;
		        try {
		            var disposalCandidates = _.pluck(_subscriptionsToDependencies, 'target');
		            dependencyDetection.begin(function (subscribable) {
		                var inOld = _.indexOf(disposalCandidates, subscribable);
		                if (inOld >= 0)
		                    disposalCandidates[inOld] = undefined;
		                else
		                    _subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossibleAsync));
		            });
		            var newValue = readFunction.call(evaluatorFunctionTarget);
		            for (var i = disposalCandidates.length - 1; i >= 0; i--) {
		                if (disposalCandidates[i])
		                    _subscriptionsToDependencies.splice(i, 1)[0].dispose();
		            }
		            _hasBeenEvaluated = true;
		            computed['notifySubscribers'](_latestValue, 'beforeChange');
		            _latestValue = newValue;
		        } finally {
		            dependencyDetection.end();
		        }
		        computed['notifySubscribers'](_latestValue);
		        _isBeingEvaluated = false;
		    }
		    function computed() {
		        if (arguments.length > 0) {
		            if (typeof writeFunction === 'function') {
		                writeFunction.apply(evaluatorFunctionTarget, arguments);
		            } else
		                throw new Error('Cannot write a value to a computed unless you specify a \'write\' option. If you wish to read the current value, don\'t pass any parameters.');
		        } else {
		            if (!_hasBeenEvaluated)
		                evaluateImmediate();
		            dependencyDetection.registerDependency(computed);
		            return _latestValue;
		        }
		    }
		    ;
		    computed.peek = function () {
		        if (!_hasBeenEvaluated)
		            evaluateImmediate();
		        return _latestValue;
		    };
		    computed.getDependenciesCount = function () {
		        return _subscriptionsToDependencies.length;
		    };
		    computed.hasWriteFunction = typeof options['write'] === 'function';
		    computed.dispose = function () {
		        dispose();
		    };
		    subscribable.call(computed);
		    if (options['deferEvaluation'] !== true)
		        evaluateImmediate();
		    return computed;
		};
		module.exports = computed;
	});

	uncommon.define('lib/bind/View.js', function(require, module) {
		var _ = require('underscore'), $ = require('jquery'), Handlebars = require('handlebars'), humble = require('humble'), TemplateContext = require('lib/context/TemplateContext.js'), context = require('lib/bind/context.js');
		var ViewContext = TemplateContext.extend({
		        init: function (options) {
		            this._super(options);
		            this._events = {};
		            this._handledEvents = [];
		            this._isAttached = false;
		        },
		        registerEvent: function (id, event, callback) {
		            var callbacksById = this._events[event];
		            if (callbacksById === undefined)
		                this._events[event] = callbacksById = {};
		            callbacksById[id] = callback;
		            if (this._isAttached)
		                this._updateEvents();
		        },
		        disposeEvent: function (id, event) {
		            var callbacksById = this._events[event];
		            if (callbacksById !== undefined && callbacksById.hasOwnProperty(id))
		                delete callbacksById[id];
		            if (this._isAttached)
		                this._updateEvents();
		        },
		        _getEventBindings: function (element) {
		            var attrs = [
		                    'event-bind',
		                    'value-bind'
		                ], ids = [], id, i, len = attrs.length;
		            for (i = 0; i < len; i++) {
		                id = element.attr(attrs[i]);
		                if (_.isString(id))
		                    ids.push(id);
		            }
		            return ids;
		        }
		    });
		var View = humble.Object.extend({
		        init: function (template, modelview) {
		            this._template = template;
		            this._modelview = modelview;
		        },
		        appendTo: function (elementOrSelector) {
		            var rootElement = $(elementOrSelector), rootContext = ViewContext.extend({
		                    _eventHandler: function (event) {
		                        var callbacksById, element, ids, i, len, callback, ret;
		                        callbacksById = rootContext._events[event.type];
		                        if (callbacksById === undefined)
		                            return;
		                        element = $(event.target);
		                        while (!element.is(rootElement)) {
		                            ids = rootContext._getEventBindings(element);
		                            for (i = 0, len = ids.length; i < len; i++) {
		                                callback = callbacksById[ids[i]];
		                                ret = false;
		                                if (_.isFunction(callback)) {
		                                    ret = callback(event) || ret;
		                                    if (event.isPropagationStopped())
		                                        ret = false;
		                                }
		                            }
		                            if (ret !== true)
		                                return false;
		                            else
		                                element = element.parent();
		                        }
		                    },
		                    _updateEvents: function () {
		                        var oldEvents = this._handledEvents, newEvents = _.keys(this._events), toAdd = _.difference(newEvents, oldEvents), toRemove = _.difference(oldEvents, newEvents);
		                        if (toRemove.length > 0)
		                            rootElement.off(toRemove.join(' '));
		                        if (toAdd.length > 0)
		                            rootElement.on(toAdd.join(' '), this._eventHandler);
		                        this._handledEvents = newEvents;
		                    }
		                }).invoke({
		                    target: this._modelview,
		                    template: this._template,
		                    context: this._modelview
		                });
		            context(rootContext);
		            $(rootContext.render()).appendTo(rootElement);
		            context.pop();
		            rootContext._isAttached = true;
		            rootContext._updateEvents();
		            this._context = rootContext;
		        }
		    });
		module.exports = View;
	});

	uncommon.define('lib/context/MetamorphContext.js', function(require, module) {
		var _ = require('underscore'), jquery = require('jquery'), Metamorph = require('lib/util/metamorph.js'), RenderContext = require('lib/context/RenderContext.js'), context = require('lib/bind/context.js');
		var MetamorphContext = RenderContext.extend({
		        renderContent: function (value) {
		            if (value === null || value === undefined)
		                return '';
		            else
		                return value.toString();
		        },
		        render: function () {
		            var target = this.target(), value = _.isFunction(target) ? target() : target;
		            if (this.bound()) {
		                if (!this._metamorph) {
		                    this._metamorph = new Metamorph(this.renderContent(value));
		                    return new Handlebars.SafeString(this._metamorph.outerHTML());
		                } else
		                    return this._metamorph.outerHTML();
		            } else
		                return this.renderContent(value);
		        },
		        rerender: function () {
		            if (this._metamorph) {
		                var oldContext = context(), target = this.target(), value = _.isFunction(target) ? target() : target;
		                context(this);
		                this.disposeChildren();
		                this._metamorph.html(Handlebars.Utils.escapeExpression(this.renderContent(value)));
		                context(oldContext);
		            }
		        },
		        dispose: function () {
		            delete this['_metamorph'];
		            this._super();
		        }
		    });
		module.exports = MetamorphContext;
	});

	uncommon.define('lib/bind/context.js', function(require, module) {
		var _ = require('underscore');
		var _TOP = null;
		function context() {
		    if (arguments.length > 0) {
		        _TOP = arguments[0];
		    }
		    return _TOP;
		}
		_.extend(context, {
		    pop: function () {
		        var top = context();
		        if (top)
		            context(top['$parentContext']);
		        return top;
		    }
		});
		module.exports = context;
	});

	uncommon.define('lib/context/RenderContext.js', function(require, module) {
		var _ = require('underscore'), BindingContext = require('lib/context/BindingContext.js');
		var RenderContext = BindingContext.extend({
		        render: function () {
		            var target = this.target(), value = _.isFunction(target) ? target() : target;
		            if (value === null || value === undefined)
		                return '';
		            else
		                return value.toString();
		        },
		        rerender: function () {
		        },
		        clean: function () {
		            if (this.isDirty()) {
		                this.rerender();
		                this.isDirty(false);
		            } else
		                this.cleanChildren();
		        }
		    });
		module.exports = RenderContext;
	});

	uncommon.define('lib/context/EventContext.js', function(require, module) {
		var _ = require('underscore'), $ = require('jquery'), BindingContext = require('lib/context/BindingContext.js');
		var EventContext = BindingContext.extend({
		        init: function (options) {
		            this._super(options);
		            _.defaults(options, {
		                event: 'click',
		                id: _.uniqueId('hb')
		            });
		            var target = this.target(), event = options.event, id = options.id;
		            if (this.$rootContext.registerEvent)
		                this.$rootContext.registerEvent(id, event, target);
		            this._event = options.event;
		            this._bind_id = options.id;
		        },
		        dispose: function () {
		            this._super();
		            var id = this._bind_id, event = this._event;
		            if (this.$rootContext.disposeEvent)
		                this.$rootContext.disposeEvent(id, event);
		        },
		        targetUpdated: function () {
		            var target = this.target(), event = this._event, id = this._bind_id;
		            if (this.$rootContext.registerEvent)
		                this.$rootContext.registerEvent(id, event, target);
		        }
		    });
		module.exports = EventContext;
	});

	uncommon.define('lib/context/TemplateContext.js', function(require, module) {
		var _ = require('underscore'), Handlebars = require('handlebars'), getTemplate = require('lib/bind/template.js'), MetamorphContext = require('lib/context/MetamorphContext.js');
		var TemplateContext = MetamorphContext.extend({
		        init: function (options) {
		            this._super(options);
		            _.defaults(options, {
		                template: this._target
		            });
		            this._template = options.template;
		            this._context = options.context;
		        },
		        target: function () {
		            var oldSubs = this._subscriptions, newSubs = [], value;
		            _.invoke(oldSubs, 'dispose');
		            oldSubs.splice(0, oldSubs.length);
		            value = {
		                template: this._bindTarget(this._template, newSubs),
		                context: this._bindTarget(this._context, newSubs)
		            };
		            oldSubs.concat(newSubs);
		            return value;
		        },
		        renderContent: function (desc) {
		            var template = getTemplate(desc.template), context = desc.context;
		            if (_.isFunction(template))
		                return template(context);
		            else
		                return 'Unknown template "' + desc.template + '"';
		        }
		    });
		module.exports = TemplateContext;
	});

	uncommon.define('lib/context/AttributeContext.js', function(require, module) {
		var _ = require('underscore'), $ = require('jquery'), BindingContext = require('lib/context/BindingContext.js');
		RenderContext = require('lib/context/RenderContext.js');
		var ValueContext = BindingContext.extend({
		        targetUpdated: function () {
		            this.$parentContext.isDirty(true);
		            this._super();
		        }
		    });
		var AttributeContext = RenderContext.extend({
		        init: function (options) {
		            this._super(options);
		            _.defaults(options, {
		                bind_name: 'attr-bind',
		                bind_id: _.uniqueId('hb'),
		                name: 'undefined_attribute'
		            });
		            this._bind_name = options.bind_name;
		            this._bind_id = options.bind_id;
		            this._name = options.name;
		        },
		        render: function () {
		            var value = this._getAttributeValue();
		            return value !== null && value !== undefined ? this._name + '="' + value + '"' : '';
		        },
		        rerender: function () {
		            if (this.bound()) {
		                var value = this._getAttributeValue();
		                $('[' + this._bind_name + '="' + this._bind_id + '"]').attr(this._name, value);
		            }
		        },
		        _getAttributeValue: function () {
		            this.disposeChildren();
		            this._subscribeToItems();
		            var target = this.target(), value = _.isFunction(target) ? target() : target;
		            if (_.isArray(value)) {
		                value = _.chain(value).map(function (item) {
		                    return _.isFunction(item) ? item() : item;
		                }).reject(function (item) {
		                    return item === undefined || item === null;
		                }).map(function (item) {
		                    return item.toString();
		                }).value().join(' ');
		            } else
		                value = value !== null && value !== undefined ? value.toString() : '';
		            return value;
		        },
		        disposeChildren: function () {
		            this._super();
		            this.children.splice(0, this.children.length);
		        },
		        _subscribeToItems: function () {
		            var target = this.target(), value = _.isFunction(target) ? target() : target;
		            if (_.isArray(value) && this.bind()) {
		                _.each(value, function (item) {
		                    if (_.isSubscribable(item))
		                        new ValueContext({
		                            parent: this,
		                            target: item
		                        });
		                });
		            }
		        }
		    });
		module.exports = AttributeContext;
	});

	uncommon.define('lib/context/ValueContext.js', function(require, module) {
		var _ = require('underscore'), $ = require('jquery'), nullSafe = require('lib/util/nullSafe.js'), RenderContext = require('lib/context/RenderContext.js');
		var VALID_UPDATES = [
		        'change',
		        'keyup'
		    ];
		var ValueContext = RenderContext.extend({
		        init: function (options) {
		            this._super(options);
		            _.defaults(options, {
		                update: 'change'
		            });
		            if (!_.include(VALID_UPDATES, options.update))
		                throw new Error('The update policy "' + options.update + '" is not supported by {{value}}');
		            this._bind_id = _.uniqueId('hb');
		            this._updatePolicy = options.update;
		            this._is_updating = false;
		        },
		        render: function () {
		            var target = this.target(), value = nullSafe.toString(_.isFunction(target) ? target() : target);
		            id = this._bind_id;
		            this._registerEvent(target);
		            return ' value-bind="' + id + '" value="' + value + '"';
		        },
		        rerender: function () {
		            if (this.bound() && !this._is_updating) {
		                var target = this.target(), value = nullSafe.toString(_.isFunction(target) ? target() : target), id = this._bind_id, event = this._updatePolicy;
		                this._disposeEvent();
		                this._registerEvent(target);
		                $('[value-bind="' + this._bind_id + '"]').attr('value', value);
		            }
		        },
		        dispose: function () {
		            this._disposeEvent();
		            this._super();
		        },
		        _registerEvent: function (target) {
		            var id = this._bind_id, event = this._updatePolicy, self = this;
		            if (this.$rootContext.registerEvent && _.isSubscribable(target)) {
		                this.$rootContext.registerEvent(id, event, function () {
		                    self._is_updating = true;
		                    target($('[value-bind="' + id + '"]').attr('value'));
		                    self._is_updating = false;
		                });
		            }
		        },
		        _disposeEvent: function () {
		            var id = this._bind_id, event = this._updatePolicy;
		            if (this.$rootContext.disposeEvent)
		                this.$rootContext.disposeEvent(id, event);
		        }
		    });
		module.exports = ValueContext;
	});

	uncommon.define('lib/observe/subscribable.js', function(require, module) {
		var _ = require('underscore'), arrays = require('lib/util/arrays.js'), Subscription = require('lib/observe/Subscription.js');
		_.mixin({
		    'isSubscribable': function (instance) {
		        return !(!instance) && typeof instance.subscribe == 'function' && typeof instance['notifySubscribers'] == 'function';
		    }
		});
		var defaultEvent = 'change';
		var subscribable = function () {
		    this._subscriptions = {};
		    this.subscribe = function (callback, callbackTarget, event) {
		        event = event || defaultEvent;
		        var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;
		        var subscription = new Subscription(this, boundCallback, function () {
		                arrays.remove(this._subscriptions[event], subscription);
		            }.bind(this));
		        if (!this._subscriptions[event])
		            this._subscriptions[event] = [];
		        this._subscriptions[event].push(subscription);
		        return subscription;
		    };
		    this.notifySubscribers = function (valueToNotify, event) {
		        event = event || defaultEvent;
		        if (this._subscriptions[event]) {
		            _.each(this._subscriptions[event].slice(0), function (subscription) {
		                if (subscription && subscription.isDisposed !== true)
		                    subscription.callback(valueToNotify);
		            });
		        }
		    };
		    this.getSubscriptionsCount = function () {
		        var total = 0;
		        for (var eventName in this._subscriptions) {
		            if (this._subscriptions.hasOwnProperty(eventName))
		                total += this._subscriptions[eventName].length;
		        }
		        return total;
		    };
		};
		module.exports = subscribable;
	});

	uncommon.define('lib/observe/dependencyDetection.js', function(require, module) {
		var _ = require('underscore');
		var _frames = [], dependencyDetection = {
		        begin: function (callback) {
		            _frames.push({
		                callback: callback,
		                distinctDependencies: []
		            });
		        },
		        end: function () {
		            _frames.pop();
		        },
		        registerDependency: function (subscribable) {
		            if (!_.isSubscribable(subscribable))
		                throw new Error('Only subscribable things can act as dependencies');
		            if (_frames.length > 0) {
		                var topFrame = _frames[_frames.length - 1];
		                if (_.indexOf(topFrame.distinctDependencies, subscribable) >= 0)
		                    return;
		                topFrame.distinctDependencies.push(subscribable);
		                topFrame.callback(subscribable);
		            }
		        }
		    };
		module.exports = dependencyDetection;
	});

	uncommon.define('lib/util/metamorph.js', function(require, module) {
		// ==========================================================================
		// Project:   metamorph
		// Copyright: ©2011 My Company Inc. All rights reserved.
		// ==========================================================================
		  var K = function(){},
		      guid = 0,
		      document = window.document,
		
		      // Feature-detect the W3C range API, the extended check is for IE9 which only partially supports ranges
		      supportsRange = ('createRange' in document) && (typeof Range !== 'undefined') && Range.prototype.createContextualFragment,
		
		      // Internet Explorer prior to 9 does not allow setting innerHTML if the first element
		      // is a "zero-scope" element. This problem can be worked around by making
		      // the first node an invisible text node. We, like Modernizr, use &shy;
		      needsShy = (function(){
		        var testEl = document.createElement('div');
		        testEl.innerHTML = "<div></div>";
		        testEl.firstChild.innerHTML = "<script></script>";
		        return testEl.firstChild.innerHTML === '';
		      })();
		
		  // Constructor that supports either Metamorph('foo') or new
		  // Metamorph('foo');
		  //
		  // Takes a string of HTML as the argument.
		
		  var Metamorph = function(html) {
		    var self;
		
		    if (this instanceof Metamorph) {
		      self = this;
		    } else {
		      self = new K();
		    }
		
		    self.innerHTML = html;
		    var myGuid = 'metamorph-'+(guid++);
		    self.start = myGuid + '-start';
		    self.end = myGuid + '-end';
		
		    return self;
		  };
		
		  K.prototype = Metamorph.prototype;
		
		  var rangeFor, htmlFunc, removeFunc, outerHTMLFunc, appendToFunc, afterFunc, prependFunc, startTagFunc, endTagFunc;
		
		  outerHTMLFunc = function() {
		    return this.startTag() + this.innerHTML + this.endTag();
		  };
		
		  startTagFunc = function() {
		    return "<script id='" + this.start + "' type='text/x-placeholder'></script>";
		  };
		
		  endTagFunc = function() {
		    return "<script id='" + this.end + "' type='text/x-placeholder'></script>";
		  };
		
		  // If we have the W3C range API, this process is relatively straight forward.
		  if (supportsRange) {
		
		    // Get a range for the current morph. Optionally include the starting and
		    // ending placeholders.
		    rangeFor = function(morph, outerToo) {
		      var range = document.createRange();
		      var before = document.getElementById(morph.start);
		      var after = document.getElementById(morph.end);
		
		      if (outerToo) {
		        range.setStartBefore(before);
		        range.setEndAfter(after);
		      } else {
		        range.setStartAfter(before);
		        range.setEndBefore(after);
		      }
		
		      return range;
		    };
		
		    htmlFunc = function(html, outerToo) {
		      // get a range for the current metamorph object
		      var range = rangeFor(this, outerToo);
		
		      // delete the contents of the range, which will be the
		      // nodes between the starting and ending placeholder.
		      range.deleteContents();
		
		      // create a new document fragment for the HTML
		      var fragment = range.createContextualFragment(html);
		
		      // insert the fragment into the range
		      range.insertNode(fragment);
		    };
		
		    removeFunc = function() {
		      // get a range for the current metamorph object including
		      // the starting and ending placeholders.
		      var range = rangeFor(this, true);
		
		      // delete the entire range.
		      range.deleteContents();
		    };
		
		    appendToFunc = function(node) {
		      var range = document.createRange();
		      range.setStart(node);
		      range.collapse(false);
		      var frag = range.createContextualFragment(this.outerHTML());
		      node.appendChild(frag);
		    };
		
		    afterFunc = function(html) {
		      var range = document.createRange();
		      var after = document.getElementById(this.end);
		
		      range.setStartAfter(after);
		      range.setEndAfter(after);
		
		      var fragment = range.createContextualFragment(html);
		      range.insertNode(fragment);
		    };
		
		    prependFunc = function(html) {
		      var range = document.createRange();
		      var start = document.getElementById(this.start);
		
		      range.setStartAfter(start);
		      range.setEndAfter(start);
		
		      var fragment = range.createContextualFragment(html);
		      range.insertNode(fragment);
		    };
		
		  } else {
		    /**
		     * This code is mostly taken from jQuery, with one exception. In jQuery's case, we
		     * have some HTML and we need to figure out how to convert it into some nodes.
		     *
		     * In this case, jQuery needs to scan the HTML looking for an opening tag and use
		     * that as the key for the wrap map. In our case, we know the parent node, and
		     * can use its type as the key for the wrap map.
		     **/
		    var wrapMap = {
		      select: [ 1, "<select multiple='multiple'>", "</select>" ],
		      fieldset: [ 1, "<fieldset>", "</fieldset>" ],
		      table: [ 1, "<table>", "</table>" ],
		      tbody: [ 2, "<table><tbody>", "</tbody></table>" ],
		      tr: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		      colgroup: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		      map: [ 1, "<map>", "</map>" ],
		      _default: [ 0, "", "" ]
		    };
		
		    /**
		     * Given a parent node and some HTML, generate a set of nodes. Return the first
		     * node, which will allow us to traverse the rest using nextSibling.
		     *
		     * We need to do this because innerHTML in IE does not really parse the nodes.
		     **/
		    var firstNodeFor = function(parentNode, html) {
		      var arr = wrapMap[parentNode.tagName.toLowerCase()] || wrapMap._default;
		      var depth = arr[0], start = arr[1], end = arr[2];
		
		      if (needsShy) { html = '&shy;'+html; }
		
		      var element = document.createElement('div');
		      element.innerHTML = start + html + end;
		
		      for (var i=0; i<=depth; i++) {
		        element = element.firstChild;
		      }
		
		      // Look for &shy; to remove it.
		      if (needsShy) {
		        var shyElement = element;
		
		        // Sometimes we get nameless elements with the shy inside
		        while (shyElement.nodeType === 1 && !shyElement.nodeName) {
		          shyElement = shyElement.firstChild;
		        }
		
		        // At this point it's the actual unicode character.
		        if (shyElement.nodeType === 3 && shyElement.nodeValue.charAt(0) === "\u00AD") {
		          shyElement.nodeValue = shyElement.nodeValue.slice(1);
		        }
		      }
		
		      return element;
		    };
		
		    /**
		     * In some cases, Internet Explorer can create an anonymous node in
		     * the hierarchy with no tagName. You can create this scenario via:
		     *
		     *     div = document.createElement("div");
		     *     div.innerHTML = "<table>&shy<script></script><tr><td>hi</td></tr></table>";
		     *     div.firstChild.firstChild.tagName //=> ""
		     *
		     * If our script markers are inside such a node, we need to find that
		     * node and use *it* as the marker.
		     **/
		    var realNode = function(start) {
		      while (start.parentNode.tagName === "") {
		        start = start.parentNode;
		      }
		
		      return start;
		    };
		
		    /**
		     * When automatically adding a tbody, Internet Explorer inserts the
		     * tbody immediately before the first <tr>. Other browsers create it
		     * before the first node, no matter what.
		     *
		     * This means the the following code:
		     *
		     *     div = document.createElement("div");
		     *     div.innerHTML = "<table><script id='first'></script><tr><td>hi</td></tr><script id='last'></script></table>
		     *
		     * Generates the following DOM in IE:
		     *
		     *     + div
		     *       + table
		     *         - script id='first'
		     *         + tbody
		     *           + tr
		     *             + td
		     *               - "hi"
		     *           - script id='last'
		     *
		     * Which means that the two script tags, even though they were
		     * inserted at the same point in the hierarchy in the original
		     * HTML, now have different parents.
		     *
		     * This code reparents the first script tag by making it the tbody's
		     * first child.
		     **/
		    var fixParentage = function(start, end) {
		      if (start.parentNode !== end.parentNode) {
		        end.parentNode.insertBefore(start, end.parentNode.firstChild);
		      }
		    };
		
		    htmlFunc = function(html, outerToo) {
		      // get the real starting node. see realNode for details.
		      var start = realNode(document.getElementById(this.start));
		      var end = document.getElementById(this.end);
		      var parentNode = end.parentNode;
		      var node, nextSibling, last;
		
		      // make sure that the start and end nodes share the same
		      // parent. If not, fix it.
		      fixParentage(start, end);
		
		      // remove all of the nodes after the starting placeholder and
		      // before the ending placeholder.
		      node = start.nextSibling;
		      while (node) {
		        nextSibling = node.nextSibling;
		        last = node === end;
		
		        // if this is the last node, and we want to remove it as well,
		        // set the `end` node to the next sibling. This is because
		        // for the rest of the function, we insert the new nodes
		        // before the end (note that insertBefore(node, null) is
		        // the same as appendChild(node)).
		        //
		        // if we do not want to remove it, just break.
		        if (last) {
		          if (outerToo) { end = node.nextSibling; } else { break; }
		        }
		
		        node.parentNode.removeChild(node);
		
		        // if this is the last node and we didn't break before
		        // (because we wanted to remove the outer nodes), break
		        // now.
		        if (last) { break; }
		
		        node = nextSibling;
		      }
		
		      // get the first node for the HTML string, even in cases like
		      // tables and lists where a simple innerHTML on a div would
		      // swallow some of the content.
		      node = firstNodeFor(start.parentNode, html);
		
		      // copy the nodes for the HTML between the starting and ending
		      // placeholder.
		      while (node) {
		        nextSibling = node.nextSibling;
		        parentNode.insertBefore(node, end);
		        node = nextSibling;
		      }
		    };
		
		    // remove the nodes in the DOM representing this metamorph.
		    //
		    // this includes the starting and ending placeholders.
		    removeFunc = function() {
		      var start = realNode(document.getElementById(this.start));
		      var end = document.getElementById(this.end);
		
		      this.html('');
		      start.parentNode.removeChild(start);
		      end.parentNode.removeChild(end);
		    };
		
		    appendToFunc = function(parentNode) {
		      var node = firstNodeFor(parentNode, this.outerHTML());
		
		      while (node) {
		        nextSibling = node.nextSibling;
		        parentNode.appendChild(node);
		        node = nextSibling;
		      }
		    };
		
		    afterFunc = function(html) {
		      // get the real starting node. see realNode for details.
		      var end = document.getElementById(this.end);
		      var insertBefore = end.nextSibling;
		      var parentNode = end.parentNode;
		      var nextSibling;
		      var node;
		
		      // get the first node for the HTML string, even in cases like
		      // tables and lists where a simple innerHTML on a div would
		      // swallow some of the content.
		      node = firstNodeFor(parentNode, html);
		
		      // copy the nodes for the HTML between the starting and ending
		      // placeholder.
		      while (node) {
		        nextSibling = node.nextSibling;
		        parentNode.insertBefore(node, insertBefore);
		        node = nextSibling;
		      }
		    };
		
		    prependFunc = function(html) {
		      var start = document.getElementById(this.start);
		      var parentNode = start.parentNode;
		      var nextSibling;
		      var node;
		
		      node = firstNodeFor(parentNode, html);
		      var insertBefore = start.nextSibling;
		
		      while (node) {
		        nextSibling = node.nextSibling;
		        parentNode.insertBefore(node, insertBefore);
		        node = nextSibling;
		      }
		    }
		  }
		
		  Metamorph.prototype.html = function(html) {
		    this.checkRemoved();
		    if (html === undefined) { return this.innerHTML; }
		
		    htmlFunc.call(this, html);
		
		    this.innerHTML = html;
		  };
		
		  Metamorph.prototype.replaceWith = function(html) {
		    this.checkRemoved();
		    htmlFunc.call(this, html, true);
		  };
		
		  Metamorph.prototype.remove = removeFunc;
		  Metamorph.prototype.outerHTML = outerHTMLFunc;
		  Metamorph.prototype.appendTo = appendToFunc;
		  Metamorph.prototype.after = afterFunc;
		  Metamorph.prototype.prepend = prependFunc;
		  Metamorph.prototype.startTag = startTagFunc;
		  Metamorph.prototype.endTag = endTagFunc;
		
		  Metamorph.prototype.isRemoved = function() {
		    var before = document.getElementById(this.start);
		    var after = document.getElementById(this.end);
		
		    return !before || !after;
		  };
		
		  Metamorph.prototype.checkRemoved = function() {
		    if (this.isRemoved()) {
		      throw new Error("Cannot perform operations on a Metamorph that is not in the DOM.");
		    }
		  };
		
		module.exports = Metamorph;
	});

	uncommon.define('lib/context/BindingContext.js', function(require, module) {
		var _ = require('underscore'), humble = require('humble');
		var matchRoot = /^\$root\./i, matchLeadingParent = /^\$parent\.*/i, matchParentsIndexer = /^\$parents\[([0-9]){1,}\]\./i, matchFuncCall = /(.*?)\(\)/i, matchIndexer = /(.*?)\[([0-9]){1,}\]/i;
		var BindingContext = humble.Object.extend({
		        init: function (options) {
		            _.defaults(options, {
		                target: null,
		                parent: null,
		                bind: true
		            });
		            this._target = options.target;
		            this._subscriptions = [];
		            this.bind(options.bind);
		            if (!(!options['parent'])) {
		                var parent = options['parent'];
		                this['$rootContext'] = parent['$rootContext'];
		                this['$parentContext'] = parent;
		                this['$parent'] = parent.target();
		                this['$parents'] = (parent['$parents'] || []).slice(0);
		                this['$parents'].unshift(this['$parent']);
		                this['$root'] = parent['$root'];
		                parent['children'] = parent['children'] || [];
		                parent['children'].push(this);
		            } else {
		                this['$rootContext'] = this;
		                this['$parentContext'] = null;
		                this['$parent'] = null;
		                this['$parents'] = [];
		                this['$root'] = this._target;
		            }
		            this.children = [];
		            this._handlers = {};
		            this._isDirty = false;
		        },
		        bind: function () {
		            if (arguments.length > 0) {
		                var parentBinding = !this.$parentContext ? true : this.$parentContext.bind();
		                this._bind = parentBinding && !(!arguments[0]);
		            } else
		                return this._bind;
		        },
		        bound: function () {
		            return this._subscriptions.length > 0 && this.bind();
		        },
		        isDirty: function () {
		            if (arguments.length > 0)
		                this._isDirty = !(!arguments[0]);
		            else
		                return this._isDirty;
		        },
		        cleanChildren: function () {
		            _.invoke(this.children, 'clean');
		        },
		        clean: function () {
		            this.isDirty(false);
		            this.cleanChildren();
		        },
		        isDisposed: function () {
		            return this._isDisposed;
		        },
		        disposeChildren: function () {
		            _.invoke(this.children, 'dispose');
		        },
		        dispose: function () {
		            _.invoke(this._subscriptions, 'dispose');
		            this._subscriptions.splice(0, this._subscriptions.length);
		            this.disposeChildren();
		            this._disposed = true;
		        },
		        target: function () {
		            var oldSubs = this._subscriptions, newSubs = [], value;
		            _.invoke(oldSubs, 'dispose');
		            oldSubs.splice(0, oldSubs.length);
		            value = this._bindTarget(this._target, newSubs);
		            this._subscriptions = oldSubs.concat(newSubs);
		            return value;
		        },
		        targetUpdated: function () {
		            this.isDirty(true);
		            this['$rootContext'].clean();
		        },
		        _bindTarget: function (value, subscriptions) {
		            if (_.isString(value) && value.match(/^path::.*/i))
		                value = this._bindTargetPath(value.substr('path::'.length), subscriptions);
		            this._subscribeToTarget(value, subscriptions);
		            return value;
		        },
		        _bindTargetPath: function (path, subscriptions, context) {
		            var matches;
		            if (_.isString(path) && path.length > 0) {
		                if (context === undefined)
		                    context = this['$data'];
		                if (path.charAt(0) === '$') {
		                    matches = path.match(matchRoot);
		                    if (matches) {
		                        path = path.substr(matches[0].length - 1);
		                        context = this['$root'];
		                        return this._bindTargetPath(path, subscriptions, context);
		                    } else {
		                        var parent_index = 0;
		                        matches = path.match(matchLeadingParent);
		                        while (matches) {
		                            parent_index++;
		                            path = path.substr(matches[0].length - 1);
		                            matches = path.match(matchLeadingParent);
		                        }
		                        matches = path.match(matchParentsIndexer);
		                        if (matches) {
		                            path = path.substr(matches[0].length - 1);
		                            parent_index += matches[1] + 1;
		                        }
		                        if (parent_index - 1 > 0) {
		                            context = this['$parents'][parent_index];
		                            return this._bindTargetPath(path, subscriptions, context);
		                        }
		                    }
		                }
		                var elements = path.split('.'), element;
		                for (var i = 0, j = elements.length; i < j; i++) {
		                    if (context === null || context === undefined)
		                        return context;
		                    else {
		                        element = elements[i];
		                        matches = element.match(matchIndexer);
		                        if (matches) {
		                            context = context[matches[1]];
		                            this._subscriveToTarget(context, subscriptions);
		                            if (context)
		                                context = context[matches[2]];
		                        } else {
		                            matches = element.match(matchFuncCall);
		                            if (matches) {
		                                context = context[matches[1]];
		                                this._subscribeToTarget(context, subscriptions);
		                                context = context.call(context);
		                                this._subscribeToTarget(context, subscriptions);
		                            } else {
		                                context = context[element];
		                                this._subscribeToTarget(context, subscriptions);
		                            }
		                        }
		                    }
		                }
		                return context;
		            } else
		                return null;
		        },
		        _subscribeToTarget: function (target, subscriptions) {
		            if (_.isSubscribable(target) && this.bind()) {
		                if (_.pluck(subscriptions, 'target').indexOf(target) < 0)
		                    subscriptions.push(target.subscribe(this.targetUpdated, this));
		                return true;
		            }
		            return false;
		        }
		    });
		module.exports = BindingContext;
	});

	uncommon.define('lib/bind/template.js', function(require, module) {
		var _ = require('underscore'), $ = require('jquery'), Handlebars = require('handlebars');
		var _compiledTemplates = {};
		function template(name) {
		    var script, compiled = _compiledTemplates[name];
		    if (!compiled) {
		        script = $('script#' + name).html();
		        if (script !== null) {
		            compiled = Handlebars.compile(script);
		            _compiledTemplates[name] = compiled;
		        }
		    }
		    return compiled;
		}
		module.exports = template;
	});

	uncommon.define('lib/util/nullSafe.js', function(require, module) {
		var nullSafe = {
			toString: function(value) {
				if(value !== undefined && value !== null)
					return value.toString();
				return "";
			}
		};
		
		module.exports = nullSafe;
	});

	uncommon.define('lib/util/arrays.js', function(require, module) {
		var _ = require('underscore');
		var arrays = {
		        remove: function (array, itemToRemove) {
		            var index = _.indexOf(array, itemToRemove);
		            if (index >= 0)
		                array.splice(index, 1);
		        }
		    };
		_.mixin(arrays);
		module.exports = arrays;
	});

	uncommon.define('lib/observe/Subscription.js', function(require, module) {
		/**
		 * @class Subscription 
		 */
		var Subscription = function(target, callback, disposeCallback) {
			this.target = target;
			this.callback = callback;
			this.disposeCallback = disposeCallback;
			
			this.dispose = function() {
				this.isDisposed = true;
				this.disposeCallback();
			}
		};
		
		module.exports = Subscription;
	});

	root.Handlebind = uncommon('index.js');
})(this);