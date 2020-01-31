---
title: "Now serving over HTTPS and HTTP2"
date: 2016-12-01
slug: "/2016/12/01/now-serving-over-https-and-http2"
category: Misc
tags:
  - Meta
---

Every so often I check to see if GitHub have added a way to serve websites hosted on GitHub Pages with a custom domain over HTTPS rather than HTTP. Whilst clicking around to that end last night, I found that the answer is still no. I did stumble upon a service called [Netlify](https://www.netlify.com/) however.

As this site uses Jekyll plugins I can’t push directly to my `username.github.io` repo, it needs to be built first. To avoid having to do that manually, I setup a whole song and dance on Wercker that turned out to be more hassle than it was worth.

Netlify is, in short, a one-stop-shop for static sites. The features that attracted me to it were the Git integration—all I need to do is push a post to the repo and it’ll handle the rest (including building the site despite it using plugins, taking Wercker out of the mix), the free SSL certificates via Let’s Encrypt and the HTTP2 support. A global CDN, and fast DNS aren’t features to shake a stick at either, but GitHub pages has those covered too.

The setup was quick and easy: I pointed Netlify at the site’s repo, it detected that the generation engine was Jekyll, automatically setup a box, built it and served a preview. From there, I just removed the two A records that pointed at GitHub and added one that points to Netlify, added my custom domain in the admin and waited for the lot to propagate. Once it had, SSL was a click away and only one more click was needed to force TLS connections.

If your site’s repo is public on GitHub then Netlify gives you all this functionality on the house. From the few hours I’ve spent with it, I’d highly recommend it as an alternative to GitHub Pages.

