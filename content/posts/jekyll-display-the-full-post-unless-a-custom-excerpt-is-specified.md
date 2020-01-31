---
title: "Jekyll: Display the full post unless a custom excerpt is specified"
date: 2016-12-04
slug: "/2016/12/04/jekyll-display-the-full-post-unless-a-custom-excerpt-is-specified"
category: Code
tags:
  - Jekyll
---

The homepage of this site lists the full content of each post by default. An excerpt is shown only if a post contains `<!-- readmore -->`, which is the default excerpt separator in Jekyll.

Describing this functionality in prose looks something like this. For each post that is looped through, check it’s content for the excerpt separator. If found, then show all the content up until the separator, then a read more link. If not, show the full content of the post.

Translating the above to liquid results in the following snippet within the posts loop.

```
{% if post.content contains site.excerpt_separator %}
  {{ post.excerpt }}
  <a href="{{ post.url }}">Read more</a>
{% else %}
  {{ post.content }}
{% endif %}
```

If `<!-- readmore -->` isn’t to your liking, `excerpt_separator` can be configured globally in `_config.yml`.

