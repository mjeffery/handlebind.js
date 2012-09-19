Handlebind.js
=============
Handlebind.js is an extension of the [Handlebars templating language](http://www.handlebarsjs.com) that implements [Knockout.js](http://www.knockoutjs.com) style data-binding.

`Under Construction`

Installing
----------
Download the most recent version of Handlebind from [GitHub](http://github.com/mjeffery/handlebind.js/archives/master) and add it to your webpage along with its dependencies:

+ [Underscore.js](http://underscorejs.com) for collections and utilities,
+ [Humble.js](http://github.com/mjeffery/humble.js) for building a class hierarchy,
+ [jQuery](http://jquery.com) (> 1.6) for DOM manipulation and event handling,
+ and of course [Handlebars.js](http://www.handlebarsjs.com/) for template rendering

Getting Started
---------------
Handlebind uses handlebars templates to define its Views.  A handlebars template looks like regular HTML with embedded `{{` handlebars `}}` expressions.

```html
<div class="entry">
	<h1>{{text title}}</h1>
	<div class="body">
		{{html body}}
	</div>
</div>
```

You can make the template available in the browser by including it in a `<script>` tag.

```html
<script id="entry-template" type="text/x-handlebars-template">
	template content...
</script>
```

To render the view, instantiate a corresponding View Model and bind it to the template by with a View object.  Append the bound view to the DOM using an element or CSS selector.

```javascript
var entryViewModel = {
	title: 'These are a few of my favorite things...',
	body: '<ul><li>Raindrops on roses</li><li>whiskers on kittens</li><ul>'
};
var entryView = new Handlebind.View('entry-template', entryViewModel);
entryView.appendTo('#entry-container');
```

Usage
-----
Handlebind.js is largely a re-implementation of the DOM based [Knockout.js](http://knockoutjs.com) library created by Steve Sanderson.  

### Table of Contents

* Helpers
	- [Text `{{text}}`](#the-text-helper)
		- [Unescaped HTML `{{html}}`](#the-html-helper)
	- [DOM Element Attributes `{{attrs}}`](#the-attrs-helper)
		- [`{{class}}`](#the-class-helper)
	- [DOM Element Properties `{{props}}`](#the-props-helper)
		- [`{{enabled}}`](#the-enabled-helper)
		- [`{{disabled}}`](#the-disabled-helper)
	- [Event Handling `{{events}}`](#the-events-helper)
		- [Value Binding `{{value}}`](#the-value-helper)
		- [Checkbox Binding `{{checked}}`](#the-checked-helper)
		- [Focus Binding `{{hasFocus}}`](#the-focused-helper)
		- [Selection Binding `{{options}}`](#the-options-helper)
		- [`{{action}}`](#the-action-helper)
	- [Using Templates `{{template}}`](#the-template-helper)
* Block Helpers
	- [Context Definition `{{#with}}`](#the-with-block-helper)
	- [Iterative Rendering `{{#each}}`](#the-each-block-helper)
	- [Conditional Rendering `{{#if}}`](#the-if-block-helper)
		- [`{{#unless}}`](#the-unless-block-helper)
	- [Deactivating Binding `{{#unbound}}`](#the-unbound-block-helper)
* Path Expressions

### Helpers

#### The {{text}} helper

The `{{text}}` helper is used to display a value as text.

```javascript
var template = "<p>{{text lastName}}, {{text firstName}}</p>";
var view = new Handlebind.View(template, { firstName: 'John', lastName: 'Smith' });
view.appendTo('#container');
```

results in

```html
<p>Smith, John</p>
```

The `text` helper automatically converts all javascript primitives to strings before displaying them.  If the argument is a function, it will call the function without any arguments and convert the return value to a string.  The output of the `text` helper is HTML escaped, so all tags and markup will be rendered in plain text.

If the helper is bound to an observable, the page will automatically update whenever the value changes.  

```javascript
var hb = Handlebind; 
var viewModel = {
	firstName: hb.observable('John'),
	lastName: hb.observable('Smith')
};
```

would render as

```html
<p>
	<script id="metamorph-0-start" type="text/x-placeholder"></script>
	Smith
	<script id="metamorph-0-end" type="text/x-placeholder"></script>
	, 
	<script id="metamorph-1-start" type="text/x-placeholder"></script>
	John
	<script id="metamorph-1-end" type="text/x-placeholder"></script>
</p>
```

Handlebind uses the paired metamorph `<script>` tags to identify the region of the DOM that will be replaced when rerendering.  This technique is used throughout Handlebind to support robust, dynamic templating and data-binding.  Because auto-updating values emits HTML when rendering, you cannot reliably use the `text` helper inside another tag.  For example:

```html
<div class="entry">
	{{! DON'T DO THIS }}
	<ul class="{{text listClass}}">
		<li>One</li>
		<li>Two</li>
	</ul>
</div>
```
	
may result in the clearly malformed:

```html
<div class="entry">
	<ul class="
		<script metamorph-0-start type="text/x-placeholder"></script>
			num-list
		<script metamorph-0-end type="text/x-placeholder"></script>
	">
		<li>One</li>
		<li>Two</li>
	</ul>
</div>
```
		
In these situations you should use a task specific helper such as `{{class}}` or `{{attrs}}`.  These helpers use unique IDs and custom attributes such as `attr-bind="hb0"` to mark the affected tag.  The metamorph tags can also affect manual DOM traversal and CSS psuedo-selectors such as `:first-child`.  Take care to ensure your techniques are compatible with the HTML generated by your Views with both bound and unbound values.

[Back to Usage](#usage)
	
#### The {{html}} helper

The `{{html}}` helper renders a value as an HTML string.  Unlike the `text` helper, the output of the `html` helper is not escaped, so all tags and markup will be rendered to the page without modification.  Metamorph `<script>` tags are used when the binding is observable

#### The {{attrs}} helper

HTML element attributes can be bound using the `{{attrs}}` helper.  

The following HTML snippet contains a template that binds the "id" and "class" attributes of a `<div>` element

```html
<script id="entry-template" type="text/x-handlebars-template">
	<div {{attrs id=domId class=cssClasses}}>
		<strong>Title:</strong> {{text name}}<br/>
		<strong>Author:</strong> {{text value}}
	</div>
</script>
<div id="entry-container"></div>
```

We can control the appearance of the element with a dynamic list of CSS classes

```javascript
$(document).ready(function() {
	var hb = Handlebind;
	var viewModel = {
		domId: 1723,
		cssClasses: hb.observableArray(['recent-entry', 'favorite']),
		title: "The Adventures of Sherlock Holmes",
		author: "Sir Arthur Conan Doyle"
	};
	var view = new hb.View('entry-template', viewModel);
	view.appendTo('#entry-container');
});
```

producing

```html
<div attr-bind="hb0" id="1723" class="recent-entry favorite">
	<strong>Title:</strong> The Adventures of Sherlock Holmes<br/>
	<string>Author:</strong> Sir Arthur Conan Doyle
</div>	
```

Attributes are listed within the helper as name/value pairs. If an attribute's value is bound to an array, the elements will be joined together into a single, space-delimited string.  This allows you to dynamically bind multiple CSS classes with a simple array or observable array.  If the exact attributes you want to bind are not known at compile time (and cannot be written explicitly in the template) you can pass an attribute hash as the helper argument instead.

This slightly modified template

```html
<div {{attrs domAttrs}}>
	<strong>Title:</strong> {{text name}}<br/>
	<string>Author:</strong> {{text value}}
</div>
````

combined with this updated View Model

```javascript
var viewModel = {
	domAttrs: {
		id: 1723,
		class: hb.observableArray(['recent-entry', 'favorite'])
	},
	title: "The Adventures of Sherlock Holmes",
	author: "Sir Arthur Conan Doyle"
};
```

will produce the same output as the previous example.  The attributes hash is bound to its own binding context, so Handlebind can detect changes to the hash if it is stored as an observable value.

The `attrs` helper is only a one-way binding and cannot detect changes to the DOM. If you are using Handlebind to manage attributes on an element you should not manipulate them with an external library (such as jQuery).  This can cause the View Model to become out of sync with the DOM and produce unintended behavior.

The `attrs` helper creates a custom "attr-bind" attribute that is used to locate the DOM element when rerendering.  The `attrs` helper must be used within an element tag or the template will render and update incorrectly.  You cannot use more than one instance of the `attr` helper on a single element.  These special binding attributes are used by all the helpers that manipulate DOM elements and are reserved by Handlebind.  Avoid using the following attributes in your interface:

>*Reserved Attributes*
>
> * attr-bind
> * css-bind
> * prop-bind
> * props-bind
> * update-bind
> * focus-bind
> * caption-bind
> * selected-bind

[Back to Usage](#usage)

#### The {{class}} helper

The `{{class}}` helper is provided as a convenience to the developer.  The template 

```html
<div {{class this.class}}>
	{{text lastName}}, {{text firstName}}
</div>
```

is functionally equivalent to 

```html
<div {{attrs class=this.class}}>
	{{text lastName}}, {{text firstName}}
</div>
```

This CSS class helper uses a different binding attribute than the `attrs` helper ("css-bind" vs "attr-bind"), allowing them to co-exist on the same DOM element without conflict.  If you use the `class` helper you should not bind the "class" attribute with the `attrs` helper as well.  This can cause unpredictable behavior based on the order that observable subscriptions are processed.

The `class` helper should be preferred over `{{attrs class="..."}}` and `{{attrs style="..."}}` because it increases overall modularity and template clarity.

[Back to Usage](#usage)

#### The {{props}} helper

DOM element properties can be bound using the `{{props}}` helper.  Like the `attrs` helper, properties are specified in the template using a list of name/value pairs.  

```html
<form class="comment-form">
	<textarea name="comment" {{props readonly=editDisabled}}>
		{{text this.text}}
	</texarea>
	<input type="submit" {{props disabled=editDisabled}} />
</form>
```

The named properties are included or excluded based on the "truthiness" of their associated values.  If its argument returns `false`, `undefined`, `null`, or `[]` ("falsy" values) the property will be excluded and will be removed or not rendered. All other arguments evaluate to `true` and the property will be rendered or added to the element.

Sometimes the logical value available in the View Model is the boolean opposite of the one required by the `props` helper.  For example:

```javascript
var hb = Handlebind;

function CommentModel(comment) {
	var self = this;
	self.text = comment;
	self.isEditable = hb.observable(false);
	
	self.editDisabled = hb.computed(function() {
		return !self.isEditable();
	});
};

var viewModel = new CommentModel('Look ma, no hands!');
```

The template uses the properties "readonly" and "disabled".  These properties must be bound to a value that is true when editing is disabled.  The comment view model has an "isEditable" flag that is convenient to work with logically, but is false when editing is disabled.  Boolean expressions and operators cannot be used within expressions, so the view model provides the computed property "editDisabled" that is compatible with the template.  Handlebind will automatically track dependencies between observables and update "editDisabled" whenever "isEditable" changes value.

Rendering the view model with the template results in

```html
<form class="comment-form">
	<textarea name="comment" prop-bind="hb0" readonly >
		Look ma, no hands!
	</textarea>
	<input type="submit" prop-bind="hb1" disabled />
</form>
```

[Back to Usage](#usage)

#### The {{enabled}} helper

The `{{enabled}}` helper is provided as a convenience to the developer.  It adds the "disabled" property to a DOM element when its bound value is false and removes the "disabled" property when its bound value is true.

The template 

```html
Name: <input {{enabled isEditable}}>{{text this.text}}</input>
```

combined with the view model

```javascript
var viewModel = {
	name: "John",
	isEditable: Handlebind.observable(false)
};
```

will render

```html
Name: <input prop-bind="hb0" disabled >John</input>
```

The `enabled` helper cleanly handles one of the most common use cases for binding element properties.  Like the `class` helper, `enabled` uses a different binding attribute than the [`props` helper](#the-props-helper) so the two can be used together on the same element.  If you use the `enabled` helper you should not bind the "disabled" property with the `props` helper.  This can cause unpredictable behavior based on the order that observable subscriptions are processed.

[Back to Usage](#usage)

#### The {{disabled}} helper

The `{{disabled}}` helper is the logical complement of the `enabled` helper.  It adds the "disabled" property to a DOM element when its bound value is true and removes the property when its bound value is false.  Like the `enabled` helper, it can be used in conjunction with the `props` helper but users should avoid a double binding to the "disabled" property.  The `disabled` and `enabled` helpers share a binding attribute and should NOT be used together.

[Back to Usage](#usage)

#### The {{events}} helper

In Handlebind, all event handlers are implemented as functions of the view model.  

```javascript
function ColorModel() {
	var self = this;
	self.color = Handlebind.observable('red');
	self.toggleColor = function() {
		self.color(self.color() !== 'red' ? 'red' : 'blue');
	};
};
```

This view model has an observable property "color" and a method "toggleColor" that swaps the color between red and blue.  

The `{{events}}` helper is used to bind view model functions to DOM events.

```html
<script id="color-template" type="text/x-handlebars-template">
	<span {{class=color}}>The color of this text is {{text color}}</span>
	<a href="javascript:void(0)" {{events click=toggleColor}}>Toggle Color</a>
</script>
```

Event bindings are listed as name/value pairs, each associating a single event type with a single method of the view model.  A method may be bound to any number of event types, but each type should only appear once in each `events` declaration.  

```javascript
$(document).ready(function() {
	var view = new Handlebind.View('color-template', new ColorModel());
	view.appendTo('#color-container');
});
```
will result in

```html
<!-- css included as an example -->
<style type="text/css">
	.red { color:red }
	.blue { color:blue }
</style>
<div id="color-container">
	<span css-bind="hb0" class="red">
		The color of this text is 
		<script id="metamorph-0-start" type="text/x-placeholder"></script>
		red
		<script id="metamorph-0-end" type="text/x-placeholder"></script>
	</span>
	<a href="javascript:void(0)" event-bind="hb1">Toggle Color</a>
</div>	
```

##### Event Bubbling

The `events` helper uses the binding attribute "event-bind" to identify which DOM element is associated with which event handlers. When you append a View to the DOM, a single handler is registered for each type of event using JQuery's event delegation API.  When a user triggers an event, the View's event dispatcher will locate the nearest element with a relevant binding and invoke the corresponding method on the view model.

Events will bubble up the DOM hierarchy until the event reaches root element of the View.  Each time the event dispatcher encounters an element with event bindings it will invoke any view model methods bound to the event type.  An event handler can stop propagation using the same technique as normal jQuery event handlers:

* `return false` from the method
* `event.stopPropagation()`

For example, suppose we use the following view model

```javascript
var viewModel = {
	grandparent: function() {
		console.log('Grandparent');
	},
	parent: function() {
		console.log('Parent');
		return false;
	},
	child: function() {
		console.log('Child');
	}
};
```

with this template

```html
<div id="grandparent" {{events click=grandparent}}>
	<div id="parent" {{events click=parent}}>
		<div id="child" {{events click=child}}>
			<h1>Click Me</h1>
		</div>
	</div>
</div>
```

If you clicked on the `<h1>`, you'd see the following output in your browser's console

```
Child
Parent
```

Handlebind evaluates the inner-most event binding first, logging "child" to the console.  The event continues to bubble to `"#parent"`, but does not reach `"#grandparent"` because the the event handler bound to `#parent` returns false.

`...`

If you must bind multiple handlers to an element for the same event, you should create a composite handler that   

`Under Construction`

[Back to Usage](#usage)

#### The {{value}} helper

The `{{value}}` helper binds data to the `value` attribute of of an HTML element.  When used with an observable, the `value` helper automatically adds event handlers to listen for changes, creating a two-way binding that updates with user input.   

```html
<script id="login-template" type="text/x-handlebars-template">
	<div class="login">
		Username: <input type="text" {{value username}}/>
		Password: <input type="password" {{value password}}/>
	</div>
</script>
<div id="login-container"></div>
<script type="text/javascript">
	$(document).ready(function() {
		var hb = Handlebind;
		var loginModel = {
			username: hb.observable("anonymous"),
			password: hb.observable()
		};
		var view = new hb.View('login-template', loginModel);
		view.appendTo('#login-container');
	});
</script>
```
	
results in

```html
<div id="login-container">
	<div class="login">
		Username: <input type="text" value-bind="hb0" value="anonymous"/>
		Password: <input type="password" value-bind="hb1"/>
	</div>
</div>
```	

`Under Construction`

[Back to Usage](#usage)	
	
#### The {{checked}} helper

`Under Construction`

[Back to Usage](#usage)	

#### The {{focused}} helper

`Under Construction`

[Back to Usage](#usage)
	
#### The {{options}} helper

`Under Construction`

[Back to Usage](#usage)

#### The {{action}} helper

`Under Construction`

[Back to Usage](#usage)

#### The {{template}} helper

`Under Construction`

[Back to Usage](#usage)

### Block Helpers

#### The {{#with}} block helper

Normally, all data bindings in a template are relative to the View Model.

```javascript
var template = "<p>{{text author.lastName}}, {{text author.firstName}}</p>";
var viewModel = {
	author: {
		firstName: 'Charles',
		lastName: 'Dickens'
	}
};
var view = new Handlebind.View(template, viewModel);
view.appendTo('#container');
```

results in

```html
<p>Dickens, Charles</p>
```

The `{{#with}}` block helper makes a section of template relative to another binding.  The above template could have been written:

```html
{{#with author}}
	<p>{{text lastName}}, {{text firstName}}</p>
{{/with}}
```

The `with` helper creates a new binding context that is a child of the current context.  If the context is bound to an observable the contents of the block will be rerendered whenever the value is changed.  Of course, you can arbitrarily nest `with` bindings along with the other other control-flow bindings such as `if`, `unless`, and `each`. 

#### The {{#each}} block helper

The `{{#each}}` helper iterates over the items in a list and renders them using the same template block.  Inside the block the template will be bound to the current item, so you can use `this` to reference the item itself.  You can use `this` in any expression to reference the current binding.

```html
<script id="people-template" type="text/x-handlebars-template">
	<ul class="people_list">
		{{#each people}}
			<li>{{text this}}</li>
		{{/each}}
	</ul>
</script>
<div id='people-container'></div>
<script type="text/javascript">
	$(document).ready(function() {
		var viewModel = {
			people: [
				"Winston Churchill",
				"Gandhi",
				"Emily Dickinson",
				"Martin Luther King Jr.",
				"Albert Einstein"
			]
		};
		var view = new Handlebind.View('people-template', viewModel);
		view.appendTo('#people-container');
	});
</script>
```
	
will result in:

```html
<div id='people-container'>
	<ul class="people_list">
		<li>Winston Churchill</li>
		<li>Gandhi</li>
		<li>Emily Dickinson</li>
		<li>Martin Luther King Jr.</li>
		<li>Albert Einstein</li>
	</ul>
</div>
```
	
The `each` helper creates a new binding context that is a child of the current context.  Each item in the list will also cause the creation of a new binding context that will in turn be a grandchild of the current context.  If the `each` context is bound to an observable, changing the list will cause the entire block to rerender, disposing of all existing item contexts and creating new ones.

[Back to Usage](#usage)
	
#### The {{#if}} block helper
The ``{{#if}}`` block helper will conditionally render a block.  If its argument returns `false`, `undefined`, `null`, or `[]` (a "falsy" value), the block will not be rendered.

[Back to Usage](#usage)

#### The {{#unless}} block helper
The `{{#unless}}` helper is the inverse of the `if` helper.  The contained block will only be rendered if the expression returns a falsy value.

```html
<div class="entry">
	{{#unless license}}
	<h3 class="warning">WARNING: This entry does not have a license!</h3>
	{{/unless}}
</div>
```

if looking up `license` under the current context returns a falsy value, the warning will be rendered.  Otherwise, nothing will be rendered.

[Back to Usage](#usage)

#### The {{#unbound}} block helper
	
Building
--------
To build handlebind, you will need to install [uncommon](http://github.com/mjeffery/uncommon) for [Node.js](http://www.nodejs.org) and then run `uncommon build`. 

	$ npm install uncommon -g
	$ uncommon build
	
There will be an unminified javascript file in the `dist` directory.  

Alternatively, you can host the compiled source on a local server using the command `uncommon preview`. This creates a server that watches the source files and automatically rebuilds the project whenever changes are made.  