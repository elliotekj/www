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

You can optionally create a `development.toml` and/or `production.toml` file with environment-specific setting. For example, you might have a `base_url` global that should have a value of `http://127.0.0.1:8765` when you're developing locally but `https://elliotekj.com` in production. Thea determines the environment via the `THEA_ENV` environment variable. If no value is found, Thea will assume it's in a development environment. Acceptable values are:

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

# [9]: templates.globals (default: [], required: false)
#      Global key/value pairs that are made available to your template files: {{ globals.base_url }}
[templates.globals] # [9]
base_url = "http://127.0.0.1:8765"
title = "Elliot Jackson: Freelance software designer and developer"
desc = "I'm Elliot Jackson; I build software for a living and write about Swift, Rust, and other things."
```
