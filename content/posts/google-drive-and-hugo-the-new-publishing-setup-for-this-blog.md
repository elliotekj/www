---
title: "Google Drive and Hugo: The new publishing setup for this blog"
date: 2017-08-03
slug: "/2017/08/03/google-drive-and-hugo-the-new-publishing-setup-for-this-blog"
category: Misc
tags:
  - Meta
---

Back in April I wrote [a post](https://elliotekj.com/2017/04/13/back-to-wordpress/) about moving this site from Jekyll to WordPress. The move was prompted by Jekyll’s poor compilation performance and the restrictions a git-centric workflow imposes on a blog (namely: editing on the go).

Ultimately unsatisfied with WordPress, I’ve changed how this site is pieced together again. This time ’round opting for a setup I’d had in the back of my mind for a while but had never experimented with. Before we get into the good stuff though, let’s get the basics out of the way.

### Hello Hugo

The issue of compilation performance wasn’t a hard one to solve: Hugo’s reputation precedes it. Whilst there are many static site generators out there written in something more performant than Ruby; Hugo has been around for a reasonably long time, is actively developed and has a seemingly enthusiastic community around it. Bonus points for the fact that there’s a [WordPress exporter](https://github.com/SchumacherFM/wordpress-to-hugo-exporter) available for it too.

#### Side node

Hugo was fine to work with in this instance as the bulk of the work was already done by the authors of [the theme](https://github.com/spf13/hyde) I’m using. I just made a few tweaks based on personal preference. Its speed is really its selling point though. Hugo’s [templating syntax](https://gohugo.io/templates/introduction/), which is based off of Go’s`html/template` and `text/template` libraries, is the worst I’ve ever had the misfortune to use. Having now tried Hugo, I’d go out of my way to not use it on something I was building from scratch unless compilation performance was paramount.

### Editing anywhere via Google Drive

I mentioned a setup I’ve had in mind for a while but have never experimented with. In said setup, the Hugo HTML, CSS, etc. source files would live in git as you’d expect. The content, on the other hand, would be kept in some cloud syncing service. I’m a Google Drive user so I stuck with that. Provided you can find a headless client for their service, there’s no reason you couldn’t do this with any of the other syncing providers though.

The basic flow I had in my head went like this:

1. All of the site’s content lives in Google Drive.
2. A headless Google Drive client keeps things up to date on the server.
3. When changes are made in Google Drive, the server syncs then the site automatically re-generates.

With such a setup, adding content is as simple as adding a file to Google Drive and waiting for it to sync. Not only does this make changes from my desktop easy-peasy thanks to Google Drive’s Finder integration, it also means that changes can be made on the go from any device that has a browser and a text editor. And of course, Google Drive versions everything so you can recover if something bad happens.

### Technical aspects

Anyone likely to be reading this is probably more interested in how this is done rather than the fact that it happens to be done on this site. Let’s take a look.

- I added a folder to my Google Drive that contains all of the content — both text and imagery — on this site.

- I created a second Google account, to which I gave read-only access to the created folder. This is the Google account that is setup on the server. Hypothetically, I could have used my main Google account but giving a random Google Drive client on a web server read/write access to my entire Google Drive would have been a terrible idea. This way, if my box ever gets compromised, my entire Google Drive won’t get compromised with it.

- Both in development on my desktop and in production on the server, that folder is symlinked to the directory in which the Hugo source files live. The symlink is also renamed to “content”, as that is the directory Hugo looks for content in when running.

- Google doesn’t have an official headless client for Drive so I wound up using[grive](https://github.com/Grive/grive). I initially experimented with [google-drive-ocamlfuse](https://github.com/astrada/google-drive-ocamlfuse)but couldn’t get it to play ball. grive worked out of the box.

- grive doesn’t currently auto-sync so I setup a cron job which tells grive to pull down the latest changes from Google every minute. If there are any changes, then Hugo re-generates the site.

That’s all there is to it really. It took me a few hours to figure out how best to piece the thing together, but there isn’t anything massively complex about it.

### Man overboard

This section is lower down than you might expect because I think the value of this post is in the detailing of the setup. This is just for anyone interested in why I jumped the WordPress ship.

I moved to WordPress so that I could make use of their official clients to add and edit content from anywhere; the clients of most interest to me being those for iOS. These days, in order to use WordPress’ clients you have to install their JetPack plugin. Now, if JetPack’s only feature was to enable interaction between the WordPress clients and self-hosted installations then fine. It isn’t though. It adds a whole menagerie of stuff to both the self-hosted admin panel and your site’s rendered HTML. A lot of it can be turned off, some of it can’t.

The clincher was this: One of the features JetPack adds to self-hosted WordPress installations is Markdown support. The WordPress clients also support Markdown. Therefore, it seems only logical that you should be able to add content written in Markdown via one of their clients, then be able to edit that same content in its original Markdown via the self-hosted admin panel, right? Nope. If you try to go and edit Markdown content created in one of their clients in the self-hosted admin panel you’re greeted with a bunch of HTML, even though the fact that you’re interacting with the WordPress clients in the first place explicitly means that you have Markdown support in your self-hosted admin panel.

### Wrapping up

That just about covers the new setup. You may have noticed that I haven’t mentioned commenting at all. This post is long enough as-is, I do have some ideas around static site commenting I’m hoping to explore when things aren’t quite so hectic though.

I feel like I should also note that I realise I did a lot of complaining about software that is both free and open-source in this post. It appears my emotions got the better of me.

Thanks for reading this far.

