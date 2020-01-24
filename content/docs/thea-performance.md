---
slug: "/docs/thea/performance"
title: Thea » Performance
layout: thea-docs.html
repo_path: thea-performance.md
---

Optimum server to client performance is Thea's primary goal, and it employs a number of strategies to achieve that goal.

* Pages are kept in memory in a HashMap.
* Requests are handled by a highly performant [Actix web server](https://github.com/actix/actix-web).
* During the initial site render:
    * HTML, XML, JSON, JS & CSS pages are minified.
    * All pages are assigned a unique ETag.
* During a request:
    * ETags are strongly validated and Thea will return early with [304 Not Modified](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/304) if possible.
* During a response:
    * The page's content is retrieved from the HashMap (as supposed to from disk).
    * The ETag header is set.
    * A 15 minute CacheControl header is set.
    * The response is compressed with brotli.
* When a source file changes:
    * Only the new/changed page(s) are updated in the HashMap, meaning the other page's ETags aren't lost.
* Extras:
    * Thea can optionally write the contents of the HashMap to disk, allowing utilities like purgecss to be used.

[[Back to docs](/docs/thea)]
