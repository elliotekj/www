---
title: "Search through a full text index of your browsing history with Falcon"
date: 2016-11-04
slug: "/2016/11/04/search-through-a-full-text-index-of-your-browsing-history-with-falcon"
category: Misc
tags:
  - Browser Extensions
---

I have tried and failed to find a specific previously-visited page via Chrome’s history search an innumerable amount of times. There’ll be a certain piece of content that I remember and want to go back to, but Chrome’s history search only looks at the page title and URL. If I can’t remember either of those precisely enough then I’m left to either abandon the search or go digging by hand. Enter Falcon.

![Falcon in action](/static/posts/search-through-a-full-text-index-of-your-browsing-history-with-falcon/falcon.gif)

Falcon is a Chrome extension that indexes the text of each page you visit, then allows you to search through said index via the omnibar. Searches can be done in a variety of ways. The simplest is to simply type the one or more words Falcon should look for in a page. The other optional niceties include providing a `before` and/or `after` argument, or a word to ignore (so that if a page matches your search but contains a word to be ignored then Falcon won’t return the page).

Say I want to search for a page about lazy loading I remember looking at in the past 2 weeks. I’d give this to Falcon:

```
lazy loading after: "two weeks ago"
```

It does all of this whilst adhering to a user-updatable [blacklist](https://github.com/lengstrom/falcon/blob/eaf010805f0d0b4745764697cc17d1d7c955eb70/extension/js/blacklist2.js) of sites that may contain sensitive information.

All in all it’s a very handy utility that’s already come up trumps in the times I’ve needed it since installing. It’s open source, and the readme provides more examples of search patterns, as well as installation instructions.

[Falcon’s GitHub repo](https://github.com/lengstrom/falcon)

