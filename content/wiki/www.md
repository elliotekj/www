---
slug: "/wiki/www"
title: Elliot's Wiki » WWW
repo_path: www.md
---

## Why does Brotli compression require HTTPS?

> The reason to limit brotli to secure contexts is that intermediaries
> (specifically, buggy proxies and content scanners) tend to behave very poorly
> when they encounter non-deflate/gzip Content-Encoding. The Google guys
> discovered this when they rolled out ‘sdch’ and ‘bzip2’ before that; they
> ended up pulling bzip2 partly for that reason and sdch has a number of hacks
> that they had to put in. By requiring HTTPS for brotli, they can head off
> this problem in most cases because comparatively few content-scanners MITM
> HTTPS streams.
>
> -- [Mozilla Hacks](https://hacks.mozilla.org/2015/11/better-than-gzip-compression-with-brotli/)

## Further reading:

* [HTTP Streaming (or Chunked vs Store & Forward)](https://gist.github.com/CMCDragonkai/6bfade6431e9ffb7fe88)
