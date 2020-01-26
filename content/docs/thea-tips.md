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

[[Back to docs](/docs/thea)]
