---
title: "Deploy Middleman 4 to GitHub Pages"
date: 2016-10-01
slug: "/2016/10/01/deploy-middleman-4-to-github-pages/"
category: Code
tags:
  - Middleman
---

I moved my blog from Jekyll over to Middleman a couple of days ago, mainly because whilst early versions of Jekyll always worked well for me, it has become slow at recompiling after a change making customisation a less enjoyable process. Speaking of customisation, I’m not a fan of the gem-based system they moved to for themes in 3.0 either. Thus, enter Middleman.

One of the great benefits of Jekyll is hosting your site on GitHub Pages. Generously though, GitHub will also host and serve static files in a Pages repo (username.github.io) so we just need to push our compiled Middleman site into ours. Where this differs from Jekyll is that GitHub will actually compile your Jekyll site for you, removing the extra step. There is, however, a Middleman plugin that will make this an easy process. Let’s set it up.

We’ll need two separate repos. The first, in my case [`elliotekj.com`](https://github.com/elliotekj/elliotekj.com), will house our Middleman source whilst the second, your `username.github.io` repo, is where the compiled site will be pushed. This is because whilst organisations can deploy to a `gh-pages` branch within the same repo, GitHub will only serve static pages for normal user accounts from the `master` branch.

I mention Middleman 4 specifically in the title because at the time of writing, the release version of [middleman-deploy](https://github.com/middleman-contrib/middleman-deploy) isn’t compatible with version 4 so we need to use the alpha version of the gem. Despite being in alpha, it has worked perfectly for me. Add it to your `Gemfile` then `$ bundle install`.

```ruby
gem 'middleman-deploy', '~> 2.0.0.pre.alpha'
```

Now to configure it. Open your `config.rb` and add the following, replacing “username” on line 4 with your GitHub username.

```ruby
# Middleman-deploy configuration
activate :deploy do |deploy|
  deploy.deploy_method = :git
  deploy.remote = 'git@github.com:username/username.github.io.git'
  deploy.branch = 'master'
  deploy.build_before = true
end
```

Line 6 in the above snippet is optional but handy. It means that instead of running `$ middleman build` then `$ middleman deploy`, the plugin will automatically build before deploying so now you just need to run the following to deploy your Middleman site on GitHub Pages:

```
$ middleman deploy
```

There we have it. Middleman-deploy has some extra settings you can peruse in the [docs](https://github.com/middleman-contrib/middleman-deploy#middleman-deploy) if you wish, including instructions for deploying your site via rsync, ftp, or sftp instead. I haven’t tested it with those however.

