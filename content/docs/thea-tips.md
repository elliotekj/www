---
slug: "/docs/thea/tips"
title: Thea » Tips & Tricks
layout: thea-docs.html
repo_path: thea-tips.md
---

## GoAccess log analysis

This command pipes all GET requests (the only method Thea supports) from your log file into GoAccess. The GoAccess UI will auto-update as new request come in.

```shell
tail -f -n +0 /path/to/logfile | \
    grep --line-buffered GET | \
    goaccess --log-format='[%dT%tZ %^ %^] %h "%r" %s %b "%R" "%u" %T' \
        --date-format='%Y-%m-%d' --time-format=%T --ignore-crawlers -
```

## Custom 404 page

To set a custom 404 page, create a page (of any page type) and set the frontmatter slug to "/404" ([example](https://github.com/elliotekj/www/blob/master/content/pages/404.md)).

```yaml
---
slug: "/404"
---
```

[[Back to docs](/docs/thea)]
