---
title: "A workaround for box-shadow not passing through to the inside of a border"
date: 2017-04-28
slug: "/2017/04/28/workaround-box-shadow-not-passing-inside-border"
category: Code
tags:
  - CSS
---

This is a problem more easily shown than explained. Take the following image:

![](/static/posts/workaround-box-shadow-not-passing-inside-border/indicator-2@2x.png)

It’s an indicator — the sort you’d find on any colorpicker — with a shadow. It seems simple enough, but how would you build it in CSS?

My first port of call was a `box-shadow` on an element with a 2px white border. The problem with that is that `box-shadow`’s shadow doesn’t take `border` styles into account, it just creates a shadow behind the element it was applied to resulting in this:

![](/static/posts/workaround-box-shadow-not-passing-inside-border/indicator-1@2x.png)

After some tinkering, this is the solution I came up with…

- Add the white border to the `.indicator` element as before
- Create a `.indicator::before` psuedo-element, and give it a border of the same width, only making this one black
- Leverage [`filter`](https://caniuse.com/#search=filter) to blur the `before` element in imitation of `box-shadow`’s blur

…which, once translated into SCSS, does indeed produce a `.indicator` with a shadow that can be seen both on the outside and the inside of the white border.

```css
// For a `<span class="indicator"></span>` element

$indi-width: 8px;
$indi-height: 8px;
$indi-border-width: 2px;

.indicator {
    border-radius: 50%;
    border: $indi-border-width solid #fff;
    display: block;
    height: $indi-height;
    position: relative;
    width: $indi-width;

    &::before {
        border-radius: 50%;
        border: 2px solid rgba(#000, .5);
        content: "";
        filter: blur(1px);
        height: $indi-height;
        margin-left: -$indi-border-width;
        margin-top: -$indi-border-width;
        position: absolute;
        width: $indi-width;
        z-index: -1;
    }
}
```

