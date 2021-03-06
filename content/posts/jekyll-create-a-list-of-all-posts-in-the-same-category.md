---
title: "Jekyll: Create a list of all posts in the same category"
date: 2016-12-05
slug: "/2016/12/05/jekyll-create-a-list-of-all-posts-in-the-same-category"
category: Code
tags:
  - Jekyll
---

Let’s take a look at how to create a list of all of the posts in the same category as the one currently being viewed, bearing in mind three requirements:

1. If the post has more than one category, we want to create a list for each category.
2. We don’t want to show the list if there is only one post in the category (the one being viewed).
3. We don’t want to include the post who’s page is currently being viewed within the list.

I’m using categories for this example as my site uses categories rather than tags for grouping posts. Replacing `post.categories` with `post.tags` in the for loop will work if you’re site uses tags however.

We need to start by iterating through each of the categories used on the site, taking care of requirement number 1:

```
{% for category in page.categories %}
  <!-- The next snippet will go here... -->
{% endfor %}
```

Next, we’ll make sure that there is indeed more than one post in the category we’re currently looped over, taking care of requirement number 2. Doing this in Ruby would be faster than using Liquid. I’m using Liquid so that if you’re site is hosted on GitHub pages, you can still add this functionality (they block non-verified plugins).

```
{% assign moreThanOneInCategory = false %}
  {% assign posts = site.categories[category] %}

  {% for post in posts %}
    {% if forloop.length > 1 %}
      {% assign moreThanOneInCategory = true %}
    {% endif %}
  {% endfor %}

  <!-- The next snippet will go here... -->
```

The above sets the `moreThanOneInCategory` variable to `true` if there is more than one post in the category we’re looped over, so all that’s left to do is render the desired markup when appropriate. The `unless` on line 6 takes care of requirement number 3.

```
{% if moreThanOneInCategory == true %}
    <div class="related-posts">
      <h3>Other posts archived in “{{ category }}”</h3>

      <ul>
        {% for post in posts %}
          {% unless post.url == page.url %}
            <li>
              <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>

              Published on <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
            </li>
          {% endunless %}
        {% endfor %}
      </ul>
    </div>
  {% endif %}
```

Those are the pieces. Your markup should look something like this once you’ve put them all together:

```
{% for category in page.categories %}
  {% assign moreThanOneInCategory = false %}
  {% assign posts = site.categories[category] %}

  {% for post in posts %}
    {% if forloop.length > 1 %}
      {% assign moreThanOneInCategory = true %}
    {% endif %}
  {% endfor %}

  {% if moreThanOneInCategory == true %}
    <div class="related-posts">
      <h3>Other posts archived in “{{ category }}”</h3>

      <ul>
        {% for post in posts %}
          {% unless post.url == page.url %}
            <li>
              <a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>

              Published on <time datetime="{{ post.date | date_to_xmlschema }}">{{ post.date | date: "%B %-d, %Y" }}</time>
            </li>
          {% endunless %}
        {% endfor %}
      </ul>
    </div>
  {% endif %}
{% endfor %}
```

