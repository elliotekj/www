---
title: "How to group posts by date Daring Fireball style in Hugo"
date: 2017-11-07
slug: "/2017/11/07/how-to-group-posts-by-date-daring-fireball-style-in-hugo"
category: Code
tags:
  - Hugo
---

I’ve made a couple of updates to this site in an effort to avoid things getting too cluttered now that [I’ve added micro-posts](https://elliotekj.com/2017-11-07-09-09-29/). A change that may be of interest to others who use [Hugo](https://gohugo.io) to generate their site is that I’ve updated the home page to group posts by the day they were published. Doing so avoids any repetition if I publish multiple things in any one day.

The logic is fairly straightforward: If the post being processed was published on the same day as the post that was processed just before it, don’t show the date. Otherwise, show the date.

Hugo provides a handy [`.Scratch`](https://gohugo.io/functions/scratch/) function for creating page-scoped variables. By updating the value of a `.Scratch` variable with the date of the current post being processed **after** the logic takes place, we can retrieve what will then be the date of the previous post in the next loop.

Here’s how all of the above translates to code:

```
{{ if ne ($.Scratch.Get "lastPostsDate") (.Date.Format "2 January 2006") }}
    <div class="meta-day">
        {{ .Date.Format "2 January 2006" }}
    </div>
{{ end }}

{{ $.Scratch.Set "lastPostsDate" (.Date.Format "2 January 2006") }}
```

That snippet should go **inside the posts loop** , so you’ll end up with something like this:

```
<div class="article-list">
    {{ $paginator := .Paginate (where .Data.Pages "Type" "post") }}

    {{ range $paginator.Pages }}
        <!-- Date logic... -->

        <article class="article">
            <!-- Structure of a single post in the list... -->
        </article>
    {{ end }}
</div>
```

