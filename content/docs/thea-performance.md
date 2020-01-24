---
slug: "/docs/thea/performance"
title: Thea » Performance
layout: thea-docs.html
repo_path: thea-performance.md
---

As stated, optimum server to client performance is Thea's primary goal and it employs a number of strategies to achieve that goal.

* Pages are kept in memory in a static HashMap.
* Requests are handled by a highly performant [Actix web server](https://github.com/actix/actix-web).
* During the initial page render:
    * HTML and XML pages are minified.
    * All pages are assigned a unique ETag.
* During a request:
    * ETags are strongly validated and Thea will return early with [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) if possible.
* During a response:
    * Thea retrieves the page's content from the static HashMap.
    * The ETag header is set.
    * A 15 minute CacheControl header is set.
    * The response is compressed with brotli.
* Extras:
    * The contents of the HashMap can optionally be written to disk, allowing utilities like purgecss to be used.

[[Back to docs](/docs/thea)]
