---
slug: "/docs/thea/in-depth"
title: Thea » In-Depth
layout: thea-docs.html
repo_path: thea-in-depth.md
---

Thea requires 4 folders at the root of your project (see the [starter kit](https://github.com/elliotekj/thea-starter) for a practical example):

* `config/`
* `content/`
* `static/`
* `templates/`

## config/

This is where your configuration file(s) live. The only required file within this directory is `default.toml` which is where you'll define your page types and template globals (see example file below).

You can optionally create a `development.toml` and/or `production.toml` file with environment-specific settings that'll be applied on top of `default.toml`, overwriting any matching keys. For example, you can set a `base_url` key in `templates.globals` to have a value of `http://127.0.0.1:8765` during local development, and a value of `https://elliotekj.com` in production. Thea determines the environment via the `THEA_ENV` environment variable. If no value is found, Thea will assume it's in a development environment. Acceptable values are:

* `THEA_ENV=development`
* `THEA_ENV=production`

```toml filename=config/default.toml
# [1]: write_to_disk (default: false, required: false)
#      If true, Thea will write the contents of the HashMap to a .rendered/
#      directory in your project. This is only useful for utilities like purgecss.
write_to_disk = true # [1]

# [2]: path (default: "content", required: false)
#      The path to the directory that will hold your page type folders.
#
# [3]: syntax_theme (default: "InspiredGitHub", required: false)
#      The theme Thea should highlight syntax with.
#      Available values:
#          * "base16-ocean.dark"
#          * "base16-eighties.dark"
#          * "base16-mocha.dark"
#          * "base16-ocean.light"
#          * "InspiredGitHub"
#          * "Solarized (dark)"
#          * "Solarized (light)"
[content]
path = "content" # [2]
syntax_theme = "Solarized (dark)" # [3]

# [4]: content.page_types item (required: at least 1)
#
# [5]: type (required: true)
#      A given name for the type that will be available in your template files
#      for things like filtering: {{ page.page_type }}.
#
# [6]: path (required: true)
#      The folder within content/ where pages of this type live. In this case,
#      all files within content/posts/ will be assigned the "post" page type.
#
# [7]: default_layout (required: true)
#      The name of the template file within templates/ that pages of this type
#      should default to if no "layout" key/value is present in their frontmatter.
[[content.page_types]] # [4]
type = "post" # [5]
path = "posts" # [6]
default_layout = "blogpost.html" # [7]

[[content.page_types]]
type = "page"
path = "pages"
default_layout = "base.html"

[[content.page_types]]
type = "spaceship"
path = "spaceships"
default_layout = "spaceship.html"

# [8]: path (default: "templates", required: false)
#      The path to the directory that will hold your template files.
[templates]
path = "templates" # [8]

# [9]: templates.globals (default: {}, required: false)
#      Global key/value pairs that are made available to your template files: {{ globals.base_url }}
[templates.globals] # [9]
base_url = "http://127.0.0.1:8765"
title = "Elliot Jackson: Freelance software designer and developer"
desc = "I'm Elliot Jackson; I build software for a living and write about Swift, Rust, and other things."
```

## content/

This is where you create the folders for your page types. If my project was using the `default.toml` file above, for example, I'd create the following folders:

* `content/posts/`
* `content/pages/`
* `content/spaceships/`

A page type folder can contain any number of files and sub-directories, the only requirement being that **every file must have a slug key in its frontmatter**. Thea does not take directory structure into account when creating and matching slugs. You can create a `content/pages/homepage.md` file with `slug: "/"` frontmatter and when someone visits the root of your domain, that's the page that'll be matched.

Thea assigns the appropriate `Content-Type` header to slugs that have any of the following extensions:

* `.css`
* `.js`
* `.json`
* `.xml`
* `.txt`

If a slug doesn't have an extension, it'll be assigned a `text/html` `Content-Type` header. Slugs with extensions other than those listed will be assigned a `text/plain` `Content-Type` header.

## static/

This is where you should put image files, videos, etc. The contents of this directory isn't loaded into the HashMap but is accessible via `yourdomain.com/static/your/file/path.png`. Due to the [performance](/docs/thea/performance) strategies applied to pages served from the HashMap, you should favour creating an "assets" page type and keeping JavaScript & CSS files in your `content/` folder.

## templates/

This is where all your layout files live. Thea uses the brilliant [Tera](https://tera.netlify.com) as a template engine and it, along with the global access to your content Thea provides, allows for [some truly powerful templating](https://github.com/elliotekj/thea-starter/blob/master/templates/blogindex.html#L4).

Every template file has access to 3 top-level data sources:

* `{{ page }}` (object) - The current page being rendered.
* `{{ pages }}` (array[page]) - An unordered array of all of your pages across all page types.
* `{{ globals }}` (object) - All of the globals defined in your config file(s) under `templates.globals`.

A page consists of 4 key/values:

* `{{ page.page_type }}` (string) - The page type of the page. [Filtering](https://tera.netlify.com/docs/#filter) is the main use-case for this.
* `{{ page.slug }}` (string) - The page's slug.
* `{{ page.content }}` (string) - The content of the page.
* `{{ page.fm }}` (object) - Every key/value in a page's frontmatter (barring `slug` & `layout`) is made available via this object. Some examples might be:
    * `{{ page.fm.title }}`
    * `{{ page.fm.date }}`
    * `{{ page.fm.astronaut }}`

[[Back to docs](/docs/thea)]
