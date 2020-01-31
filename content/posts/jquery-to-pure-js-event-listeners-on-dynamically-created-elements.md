---
title: "jQuery to pure JS: Event listeners on dynamically created elements"
date: 2016-11-05
slug: "/2016/11/05/jquery-to-pure-js-event-listeners-on-dynamically-created-elements"
category: Code
tags:
  - Javascript
---

The following HTML will serve as the example markup for this post. It’s an example of how you might structure a feed that receives updates without the page reloading (dynamically created content). Our goal is to add a click event listener to each new `.feed-item` that is dynamically created.

```html
<div class="feed">
  <div class="feed-item" data-id="3">
    <div class="item-content">
    ...
    </div>

    <div class="item-controls">
    ...
    </div>
  </div>

  <div class="feed-item" data-id="2">
  ...
  </div>

  <div class="feed-item" data-id="1">
  ...
  </div>
</div>
```

### Event delegation

Event delegation is the process of handling events at a higher level in the DOM that where they were first triggered, thanks to behaviour known as bubbling. When an element on the page is, for example clicked, then a click event is fired on that element but it doesn’t stop there. The click event “bubbles up” the DOM tree, triggering the click events on any of the originally clicked element’s parents that are listening for one.

### The jQuery approach

Using jQuery’s (1.7+) `.on()`, we can attach an event listener to the closest static parent of the element we want to listen for events on. (A parent element that isn’t created or destroyed dynamically.) When the static parent receives the “bubbled-up” click event, we tell it to compare the the dynamic child element’s selector passed into `.on()` with the element where the click originated. If they match, then the event handler is triggered. In short, this:

```js
$(staticParent).on(eventName, dynamicChildSelector, eventHandler)
```

Or, filled in to suit our needs, like this:

```js
$('.feed').on('click', '.feed-item', function (event) {
  // Do something
})
```

### The pure Javascript approach

There are multiple ways you can achieve this type of functionality in pure JS, depending on your needs.

The exact equivalent to our above jQuery would again leverage bubbling, a static parent and the dynamic child element’s selector, like so:

```js
document.querySelector(staticParent).addEventListener(eventName, function (event) {
  if (event.target.classList.contains(dynamicChildSelector)) {
    // Do something
  }
})
```

Filled in to suit or needs:

```js
document.querySelector('.feed').addEventListener('click', function (event) {
  if (event.target.classList.contains('feed-item')) {
    // Do something
  }
})
```

One of the pitfalls you may stumble into with the above approach is that not all events bubble. For example, if you want to fire an event when the mouse enters an element, you’d have to use [`mouseover`](https://developer.mozilla.org/en-US/docs/Web/Events/mouseover) rather than [`mouseenter`](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter), as `mouseenter` doesn’t bubble.

Alternatively, if you’re creating the element you want to listen to with [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement), then as part of the creation you can pass in a value for [`.onclick`](https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onclick).

```js
let newElement = document.createElement('div')
newElement.onclick = // Do something
```

As a last resort, we could add an event listener after the new element has been created and rendered, as demonstrated in the following example. To avoid having to go through all of the previously created elements that match the selector (in our case `.feed-item`), it’s best to have a way to uniquely identify each one. For this example I’m using our `.feed-item`‘s `data-id` value.

```js
// Add the helper function for creating new event listeners

function createEventListener (id) {
  const element = document.querySelector(`[data-id="${ id }"]`)

  return element.addEventListener('click', function (event) {
    // Do something
  })
}

// Then in the function that handles rendering...

function renderFeedItem () {
  // Render the item
  ...

  // Add the event listener (where newElementsId is the id of the new element)
  createEventListener(newElementsId)
}
```

Depending on your needs, you could make the above helper function more reusable by passing in the event and the event handler as well as the id. For real-world implementation there’s a chance you’d want rename the helper function, externalise it from the render function and fire it with a [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) instead.

