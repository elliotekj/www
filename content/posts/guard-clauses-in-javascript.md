---
title: "Guard clauses in Javascript"
date: 2016-12-02
slug: "/2016/12/02/guard-clauses-in-javascript"
category: Code
tags:
  - Javascript
---

I first came across the idea of guard clauses in Ruby. The concept is a fairly straightforward one: instead of wrapping a block in an `if` statement, you exit on a single line, keeping the proceeding code at the same indentation level.

In a language like Javascript, there’s no end-benefit to this style of exiting. There is, in my opinion, a benefit for anyone touching your codebase however: it improves readability and just feels nicer; cleaner.

An example then. Traditionally, you might stop certain code running like this.

```js
const assertString = (str) => {
  if (typeof str === 'string') {
    return true
  } else {
    return false
  }
}
```

Using a guard clause, you would write the above like so.

```js
const assertString = (str) => {
  if (typeof str !== 'string') { return false }
  return true
}
```

I’ve adopted this style of exiting everywhere applicable and really like it. I’d encourage you to give it a whirl.

