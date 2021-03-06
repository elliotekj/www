---
title: "How to show the full post unless there’s a user defined summary in Hugo"
date: 2017-08-09
slug: "/2017/08/09/how-to-show-the-full-post-unless-theres-a-user-defined-summary-in-hugo"
category: Code
tags:
  - Hugo
---

[Hugo](https://gohugo.io/) has two types of [summaries](https://gohugo.io/content-management/summaries/): those automatically defined by Hugo and those manually defined by the user. What it doesn’t have is a way to know which type of summary each post has; something like an `{{ .IsUserDefined }}` boolean.

On the home page of this site I like to show the full contents of a post by default. If a post has a manually defined summary however, I show that instead with a “read more” link.

Accomplishing this in Hugo is a little more involved [than it is in Jekyll](https://elliotekj.com/2016/12/04/jekyll-display-the-full-post-unless-a-custom-excerpt-is-specified/), and as far as I can tell nobody has documented how to do it. Let’s fix that.

### Configuring your content files

You need to start by choosing the summary separator you want to use in your content files. The only one that’s off limit is `<!-​-more-->` because it’s the one Hugo’s default summary functionality uses, and as such, it doesn’t get passed through in the `.Content` variable.

I went with `<!-- readmore -->`. Therefore, if I wanted to show a summary and a “read more” link for a post, I’d set it up like this:

```
---
title: "Example title"
date: 2017-08-09T12:45:27+02:00
categories: [Hugo]
---

This is the first paragraph in the post. It will be shown on the home page as it's before the summary separator.

<!-- readmore -->

On the homepage, this content won't be shown as it's after the summary separator.
```

### Configuring your layout files

Open up the layout file you want to implement this functionality in. In my case, that was `index.html`.

Within the `.Data.Pages` loop, enter the following:

```
{{ $parts := split .Content "<!-- readmore -->" }}
{{ $summary := index $parts 0 }}
{{ $summaryHTML := safeHTML $summary }}

{{ if eq $summaryHTML .Content }}
    {{ .Content }}
{{ else }}
    {{ $summaryHTML }}
    <a href="{{ .Permalink }}">Continue Reading →</a>
{{ end }}
```

Let’s walk though that snippet:

1. Line 1 splits the content of the post at the summary separator we chose previously.

2. Line 2 saves the value at index 0: all of the content before the summary separator.

3. Line 3 declares the summary “safe” so that Hugo actually renders it as HTML rather than a string of escaped characters.

4. Line 5 tells Hugo to render the full content of the post if the “summary” has the same value as `.Content`: i.e. if there’s no summary separator.

5. If the summary isn’t the same as `.Content`, then line 7 tells Hugo to render our summary with a “read more” link instead.

### Wrapping up

There we have it. You can see this in action on [the home page](https://elliotekj.com) of this site.

Having played with it some more, I think I might have been a little harsh on Hugo’s templating in [my last post](https://elliotekj.com/2017/08/03/google-drive-and-hugo-the-new-publishing-setup-for-this-blog/). I still don’t think it’s great, but it’s usable-ish I suppose.

