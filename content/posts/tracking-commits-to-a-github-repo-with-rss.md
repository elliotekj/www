---
title: "Tracking commits to a GitHub repo with RSS"
date: 2017-01-16
slug: "/2017/01/16/tracking-commits-to-a-github-repo-with-rss"
category: Code
tags:
  - GitHub
---

Watching a repo on GitHub will keep you up to date with it’s issues and pull requests. From time to time there are repos that need a closer eye kept on them though.

I inspected the page of one such repo this afternoon and to my slight surprise found what I was after: an RSS feed. Props to GitHub for going one step further by providing per-branch commit feeds, structured like this:

```
https://github.com/user/repo/commits/branch.atom
```

A working example:

```
https://github.com/elliotekj/specify/commits/master.atom
```

