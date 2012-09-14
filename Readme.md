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
		+ [Unescaped HTML `{{html}}`](#the-html-helper)
	- [DOM Element Attributes `{{attrs}}`](#the-attrs-helper)
		+ [`{{class}}`](#the-class-helper)
	- [DOM Element Properties `{{props}}`](#the-props-helper)
		+ [`{{enabled}}`](#the-enabled-helper)
		+ [`{{disabled}}`](#the-disabled-helper)
	- [Event Handling `{{events}}`](#the-events-helper)
		+ [Value Binding `{{value}}`](#the-value-helper)
		+ [Checkbox Binding `{{checked}}`](#the-checked-helper)
		+ [Focus Binding `{{hasFocus}}`](#the-hasfocus-helper)
		+ [Selection Binding `{{options}}`](#the-options-helper)
	- [Using Templates `{{template}}`](#the-template-helper)
* Block Helpers
	- [Context Definition `{{#with}}`](#the-with-helper)
	- [Iterative Rendering `{{#each}}`](#the-each-helper)
	- [Conditional Rendering `{{#if}}`](#the-if-helper)
		+ [`{{#unless}}`](#the-unless-helper)
	- [Deactivating Binding `{{#unbound}}`](#the-unbound-helper)

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

```html
<script id="attr-template" type="text/x-handlebars-template">
	
</script>
```

#### The {{class}} helper

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
	var hb = Handlebind;
	var loginModel = {
		username: hb.observable("anonymous"),
		password: hb.observable()
	};
	var view = new hb.View('login-template', loginModel);
	view.appendTo('#login-container');
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
	
#### The {{options}} helper

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
	
#### The {{#if}} block helper
The ``{{#if}}`` block helper will conditionally render a block.  If its argument returns `false`, `undefined`, `null`, or `[]` (a "falsy" value), the block will not be rendered.

#### The {{#unless}} block helper
The `{{#unless}}` helper is the inverse of the `if` helper.  The contained block will only be rendered if the expression returns a falsy value.

```html
<div class="entry">
	{{#unless license}}
	<h3> class="warning">WARNING: This entry does not have a license!</h3>
	{{/unless}}
</div>
```

if looking up `license` under the current context returns a falsy value, the warning will be rendered.  Otherwise, nothing will be rendered.

#### The {{#unbound}} block helper
	
Building
--------
To build handlebind, you will need to install [uncommon](http://github.com/mjeffery/uncommon) for [Node.js](http://www.nodejs.org) and then run `uncommon build`. 

	$ npm install uncommon -g
	$ uncommon build
	
There will be an unminified javascript file in the `dist` directory.  

Alternatively, you can host the compiled source on a local server using the command `uncommon preview`. This creates a server that watches the source files and automatically rebuilds the project whenever changes are made.  