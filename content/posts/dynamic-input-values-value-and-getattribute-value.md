---
title: "Dynamic input values, .value and .getAttribute(‘value’)"
date: 2017-01-13
slug: "/2017/01/13/dynamic-input-values-value-and-getattributevalue"
category: Code
tags:
  - Javascript
---

There are two ways to go about getting the value of an input with Javascript: `.value` and `.getAttribute('value')`. It’s important to know that they weren’t born equal however. It’s easy to be caught out by the fact that whilst `.value` updates dynamically to match the user’s changes, `.getAttribute('value')` does not.

Take the following HTML and JS:

```html
<input type="text" value="Starting value" />
<button>Log value</button>
```

```js
const input = document.querySelector('input')
const button = document.querySelector('button')

button.onclick = () => {
  console.log(input.getAttribute('value'))
}
```

When the page first loads and the button is clicked, `console.log(...)` will log what we’d expect: ‘Starting value’. If a user where to change the input’s value from ‘Starting value’ to ‘Edited value’ then click the button again however, ‘Starting value’ would still be logged. `.getAttribute('value')` doesn’t keep up with the user’s changes to the value, it only knows about the starting value and the values set with Javascript.

![getAttribute demo](/static/posts/dynamic-input-values-value-and-getattributevalue/getAttribute.gif)

By contrast, if we were to run the same test again having changed line 5 of the above JS to `console.log(input.value)`, we’d get the expected result.

![value demo](/static/posts/dynamic-input-values-value-and-getattributevalue/value.gif)

