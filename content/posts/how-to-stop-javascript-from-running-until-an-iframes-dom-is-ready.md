---
title: "How to stop Javascript from running until an iFrame’s DOM is ready"
date: 2016-12-06
slug: "/2016/12/06/how-to-stop-javascript-from-running-until-an-iframes-dom-is-ready"
category: Code
tags:
  - Javascript
---

We’ll start by writing a generic `ready()` function which can be reused for any `document`, be it the main `window`‘s one or one within an iFrame.

```js
const ready = (doc, callback) => {
  if (doc.readyState !== 'loading') { return callback() }
  return doc.addEventListener('DOMContentLoaded', callback)
}
```

The above checks if the `document` passed is still in the loading phase<sup id="fnref-90-1"><a href="#fn-90-1">1</a></sup>. If it is, then an event listener will be added to trigger the callback once `DOMContentLoaded` is fired<sup id="fnref-90-2"><a href="#fn-90-2">2</a></sup>. If it is not, then the callback will be run there and then.

Next we need to query the `document` within the iFrame. This should be done once the iFrame’s parent `document` is ready.

```js
const iframe = document.querySelector('.my-iframe')
const iframeDoc = iframe.contentDocument

// Or, if ie8 support is needed:

const iframe = document.querySelector('.my-iframe')
const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
```

Now that we have the iFrame’s `document`, let’s make use of it. Just below the above snippet, call the `ready()` function.

```js
ready(iframeDoc, iframeScripts)
```

All that’s left to do is create the `iframeScripts()` function.

```js
const iframeScripts = () => {
  // The iFrame has loaded.
  // Do things here...
}
```

Pieced together, the above snippets should look something like this in your file.

```js
const ready = (doc, callback) => {
  if (doc.readyState !== 'loading') { return callback() }
  return doc.addEventListener('DOMContentLoaded', callback)
}

const mainScripts = () => {
  // Do things...

  // Listen to the iFrame's document.
  const iframe = document.querySelector('.my-iframe')
  const iframeDoc = iframe.contentDocument
  ready(iframeDoc, iframeScripts)
}

const iframeScripts = () => {
  // The iFrame has loaded.
  // Do things here...
}

ready(document, mainScripts)
```

- [Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Document/readyState) for the various `readyState`‘s.&nbsp;↩
- `DOMContentLoaded`‘s [documentation](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)&nbsp;↩

