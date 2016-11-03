# Improvements
## Don't wrap into additional html element.
Now all pieces should be wrapped with additional html element. Like this:
```html
<div data-piece="html" data-id="Home H1" data-domain="default">
  <a href="#">Edit me</a>
</div>
```

Instead, 'script' or 'meta' tag can be used. It's invisible and don't break the layout.  
Then just use nextElementSibling to get editable element.
```html
<script type="custom" data-piece="link"></script>
<a href="#">Edit me</a>
```
## Move logic of finding CMS elements on page.
Now elements selectors are hardcoded.  
It's better to provide an interface to pass editable pieces.
```js
var editables = document.querySelectorAll('[data-piece]')
var redaxtor = new Redaxtor({
  editables: Array.prototype.map.call(editables, function(el) {
    return {
      el: el.nextElementSibling,
      type: el.dataset.piece
    }
  })
})
```

## Use more editable types
```html
<script type="custom" data-piece="text"></script>
<button>Edit me</button>
<br>
<script type="custom" data-piece="image"></script>
<img src="html5.gif" alt="html5 icon"/>
<br>
<script type="custom" data-piece="link"></script>
<a href="#">Edit me</a>
<br>
<script type="custom" data-piece="rich"></script>
<div>Edit me <b>I'M RICH TEXT</b></div>
```

## Use Preact instead of React
Preact weights less and React doesn't give advantages over Preact here.

## Get rid of Redux and use Mobx
There is no advantages with immutables here.  
Mobx will give less boilerplate and more understandable structure. Especially for newcommers.

## Get rid of plugins for now
It's complicated to build and requires third party modules.
Better to have more basis types embedded: text, image, link, rich...

## Use eslint presets "standard" and "standard-jsx"
To be more consistent across codebase.

## Use css-modules
This project should have embedded styles.
So there is no reason to not use css-modules.
With cssnext.