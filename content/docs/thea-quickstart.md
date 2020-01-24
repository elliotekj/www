---
slug: "/docs/thea/quickstart"
title: Thea » Quickstart
layout: thea-docs.html
repo_path: thea-quickstart.md
---

Thea is capable of a lot, but needs very little to Just Work™. I've put together [a starter kit that](https://github.com/elliotekj/thea-starter), I hope, both covers some of the more common use-cases and gives a little insight into just how [powerful](https://github.com/elliotekj/thea-starter/blob/master/templates/blogindex.html#L4) Thea's templating is (thanks to [Tera](https://tera.netlify.com/)).

## Install Thea

The command below assumes you have Rust installed. If you're new to the language, not to worry: Rust is [1-command-install](https://www.rust-lang.org/learn/get-started).

```shell
$ cargo install thea
```

## Clone the starter kit

```shell
$ git clone https://github.com/elliotekj/thea-starter my_new_site
$ cd my_new_site
```

## Start Thea

Thea will start on port 8765 by default. The `--dev` flag disables caching and sends the logs to STDOUT.

```shell
$ thea --dev
```

## Make changes

Thea watches the `content/` and `templates/` folders and will refresh the HashMap if any changes are made.

Note: Changes in `config/` require a server restart.

[[Back to docs](/docs/thea)]

