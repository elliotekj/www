---
title: "Saving users a click with autofocus"
date: 2017-04-03
slug: "/2017/04/03/saving-users-a-click-with-autofocus"
category: Code
tags:
  - UX
---

Much of today was spent working on signing forms — sign in, sign up, password reset — and consequently browsing around other web apps to see how they approach them.

Done properly, these are single purpose pages designed to get users in and out of them as quickly as possible. To that end, it’s interesting that a vast majority of them don’t autofocus the first input in the form, leaving the user to reach for the mouse and click it themselves.

HTML5 brought with it an attribute for just such occasions:

```html
<input type="text" autofocus>
```

With `autofocus` set, the target input will automatically be focused when the page loads, saving your users a click.

* * *

The `autofocus` attribute does exactly what we need for these kinds of single purpose pages. A quick word of warning though: it may not be what you’re after for pages that have content as well as a form.

By `autofocus`ing an input you’re effectively setting the active tab index, meaning that users navigating the page with assistive technology would need to climb back up the tree of tabbable items to find the “skip to content” link should they be looking for it.

