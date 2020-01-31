---
slug: "/wiki/www"
title: Elliot's Wiki » WWW
repo_path: www.md
---

## Why does Brotli compression require HTTPS?

> The reason to limit brotli to secure contexts is that intermediaries (specifically, buggy proxies and content scanners) tend to behave very poorly when they encounter non-deflate/gzip Content-Encoding. The Google guys discovered this when they rolled out ‘sdch’ and ‘bzip2’ before that; they ended up pulling bzip2 partly for that reason and sdch has a number of hacks that they had to put in. By requiring HTTPS for brotli, they can head off this problem in most cases because comparatively few content-scanners MITM HTTPS streams.
>
> -- [Mozilla Hacks](https://hacks.mozilla.org/2015/11/better-than-gzip-compression-with-brotli)

## PUT vs PATCH

PUT, as defined in [Section 9.6 RFC 2616](http://www.w3.org/Protocols/rfc2616/rfc2616-sec9.html#sec9.6):

> The PUT method requests that the enclosed entity be stored under the supplied Request-URI. If the Request-URI refers to an already existing resource, the enclosed entity SHOULD be considered as a modified version of the one residing on the origin server. If the Request-URI does not point to an existing resource, and that URI is capable of being defined as a new resource by the requesting user agent, the origin server can create the resource with that URI.

PATCH, as defined in [RFC 5789](https://tools.ietf.org/html/rfc5789):

> The PATCH method requests that a set of changes described in the request entity be applied to the resource identified by the Request- URI.

## Further reading:

* [HTTP Streaming (or Chunked vs Store & Forward)](https://gist.github.com/CMCDragonkai/6bfade6431e9ffb7fe88)
