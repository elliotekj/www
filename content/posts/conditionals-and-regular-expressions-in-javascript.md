---
title: "Conditionals and regular expressions in Javascript"
date: 2016-12-19
slug: "/2016/12/19/conditionals-and-regular-expressions-in-javascript"
category: Code
tags:
  - Javascript
  - Regex
---

Regular expressions (regexes) are, at first, baffling to look at. What they lack in initial digestibility however, they make up for in power.

Before going any further with this post, let’s take a quick look at the structure of a regular expression in case you haven’t used one before.

### Regular expression structure

Regular expressions are comprised of two parts, the pattern to match and the search flags, separated by slashes like so:

```
/pattern/flags
```

A working example of the above could look something like this:

```
/elliot/gi
```

`elliot` is the pattern to match and `gi` are the flags. Given a string, the pattern `elliot` will be looked for `g`lobally (i.e. the search won’t stop after the first result) whilst `i`gnoring the case of the string (i.e. a match could either be `elliot` or `Elliot`).

The above is all well and good, but regexes really come into their own once you start introducing some of the language’s syntax into your patterns. Whilst that is also when they become trickier to read, I’d encourage you to delve deeper into the syntax as once grasped it’s a huge timesaver.

### Their use in Javascript

In my experience, regexes are most often used in Javascript for replacing or removing text from a string. That’s handy, but my favourite use for them is in partnership with the [`.test()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) method from Javascript’s regular expression object. It will return `true` or `false` depending on whether or not a match was found.

Let’s write a function for validating whether or not a passed string is an integer. [insert obligatory note about validating server-side, not just client-side here]

```js
const isInteger = (str) => {
  const integerRegex = /^(\d|\-)\d*$/
  return integerRegex.test(str)
}
```

You’ll notice that the above regex doesn’t have any flags. None are needed as it’s specifically searching for a pattern from the beginning of the line (`^`) to the end of the line (`$`) and numbers of course don’t have cases. Now that we have that validator, let’s put it to use. Say we have a quantity input, let’s test it’s value:

```js
const inputVal = document.querySelector('#quantity').value

if (isInteger(inputVal)) {
  // The value is an integer, do something...
} else {
  // The value isn't an integer, do something else...
}
```

Here’s another example for validating a colour hex:

```js
const isHexColor = (str) => {
  const hexColorRegex = /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i
  return hexColorRegex.test(str)
}
```

I’m sure you can appreciate that this post barely scratches the surface of possibility. You can more or less validate anything that has a defined structure like this, so next time you’re validating something I’d encourage you to first consider if it can be done with a four-liner like we’ve seen here rather than by adding a whole new dependency to the codebase.

There are many playgrounds for regular expressions, my favourite is [http://rubular.com](http://rubular.com). For a more in-depth look at the syntax, try Microsoft’s [resource](https://msdn.microsoft.com/en-us/library/ae5bf541(v=vs.100).aspx).

