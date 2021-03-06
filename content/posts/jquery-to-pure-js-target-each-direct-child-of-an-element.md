---
title: "jQuery to pure JS: Target each direct child of an element"
date: 2016-12-12
slug: "/2016/12/12/jquery-to-pure-js-target-each-direct-child-of-an-element"
category: Code
tags:
  - Javascript
---

If you’re coming from jQuery to pure Javascript and are trying to target each direct child of an element, your first attempt to select the direct children will probably be `element.querySelector('> *')`. That will throw an error though, because `.querySelector()` doesn’t support tag-name wildcards.

Your next attempt might involve `element.childNodes`, and you’d be closer. The issue with that is that `.childNodes` will return all of the element’s children, not just the direct children.

The solution we’ll look at does use `.childNodes`, but there’s a little more to it so it makes sense to write it as a function for reuse.

```js
const forEachDirectChild = (parent, callback) => {
  const children = parent.childNodes

  children.forEach((child, i) => {
    if (child.nodeType === 1) {
      return callback()
    }
  })
}
```

Let’s use the following HTML to illustrate the problem.

```html
<ul class="list">
  <li>Direct child of .element</li>
  <li>Direct child of .element</li>
  <li>
    <ul>
      <li>Not a direct child of .element</li>
      <li>Not a direct child of .element</li>
    </ul>
  </li>
  <li>Direct child of .element</li>
  <li>Direct child of .element</li>
</ul>
```

I want to target each direct child in the above `.list` (the 5 `li`s), so with jQuery would have done as follows.

```js
$('.list > *').each(() => {
  // Do something here...
})
```

With pure Javascript, thanks to the helper function we just wrote, I can now target each direct child of `.list` like this:

```js
forEachDirectChild(document.querySelector('.list'), () => {
  // Do something here...
})
```

