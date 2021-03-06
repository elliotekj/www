---
title: "How CSS selector specificity is calculated"
date: 2017-02-25
slug: "/2017/02/25/how-css-selector-specificity-is-calculated"
category: Code
tags:
  - CSS
---

I spent the end of this week working on Readership’s exporting tools, more specifically the CSS inliner.

To make sure that the correct styles are applied when multiple selectors with a common property match the same element, I needed to calculate the specificity of each individual selector, keeping only the declaration of the one with the highest specificity.

CSS selectors are awarded a score based on their individual components. The score is of the form `abc` <sup id="fnref-38-1"><a href="#fn-38-1">1</a></sup> where `a` is the number of IDs; `b` is the combined number of classes, attributes, and psuedo-classes; and `c` is the combined number of types and psuedo-elements. The lowest scoring selector is the wildcard (`*`) with a specificity value of 000, and as usual, an inline style will take priority over anything else except an `!important` declaration.

The above is the foundation for calculating the specificity of a selector. You may have spotted that by using this method, there will be times when two selectors carry the same weight. When that happens, CSS’s principle of last-in last-applied should be used:

```css
/* For <div class="some-class" some-attribute="something"></div> */

.some-class {
  background-color: blue;
}

[some-attribute] {
  background-color: green;
}
```

The `background-color` of the above `div` will be green. The selectors carry an equal specificity value so the last-in selector, `[some-attribute]`, takes precedence.

### Examples

Selector specificity is something much easier shown than explained, so lets take a look at some examples.

```
.some-class {
  background-color: blue;
}
```

`.some-class` is a selector that has 0 ID(s), 1 class(es) / attribute(s) / psuedo-class(es), and 0 type(s) / psuedo-element(s), giving it a specificity score of 010.

```
.some-class li {
  background-color: blue;
}
```

`.some-class li` is a selector that has 0 ID(s), 1 class(es) / attribute(s) / psuedo-class(es), and 1 type(s) / psuedo-element(s), giving it a specificity score of 011.

```
#some-id p::first-line {
  font-size: 2rem;
}
```

`#some-id p::first-line` is a selector that has 1 ID(s), 0 class(es) / attribute(s) / psuedo-class(es), and 2 type(s) / psuedo-element(s), giving it a specificity score of 102.

```
#some-id ul:nth-child(odd) [some-attribute] a.some-class::first-letter {
  color: purple;
}
```

`#some-id ul:nth-child(odd) [some-attribute] a.some-class::first-letter` is a selector that has 1 ID(s), 3 class(es) / attribute(s) / psuedo-class(es), and 3 type(s) / psuedo-element(s), giving it a specificity score of 133.

### Two words of warning

Firstly: for this method to work, it’s imperative that the individual counts be concatenated together rather than added together. 1 ID and 1 class yield a score of 110, not 2.

Secondly: if your CSS has a selector that, for some reason, has an `a`, `b`, or `c` count that goes into the double-digits, then all specificity calculations should be done returning double-digits for each of `abc`. If that edge case isn’t taken care of, then you end up with a position where 11 class selectors would override 1 ID selector which isn’t correct.

- You may have previously seen articles which represent specificity with 4 values of the form `zabc`. In those cases, `z` equals 1 when a matching inline style is present, making it the most specific style. The style tag isn’t a selector though and therefore has no place in _selector_ specificity scoring. Readership’s library and this post follow [the W3 method](https://www.w3.org/TR/selectors/#specificity) of calculating selector specificity.&nbsp;↩

