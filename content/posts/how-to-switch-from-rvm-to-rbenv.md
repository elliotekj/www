---
title: "How to switch from rvm to rbenv"
date: 2016-09-29
slug: "/2016/09/29/how-to-switch-from-rvm-to-rbenv"
category: Code
tags:
  - Ruby
---

I have had a few issues with rvm recently, both when installing gems and activating them. After trying to reinstall the problematic gems, then a number of solutions the internet recommended, going as far as reinstalling the version of Ruby, I decided to try my luck with [rbenv](https://github.com/rbenv/rbenv) instead. If you too have come to this conclusion, then here’s how to make the switch. If you’re wondering what the benefits of switching might be, [this document](https://github.com/rbenv/rbenv/wiki/Why-rbenv%3F) in the rbenv repo is for you.

We’ll start by uninstalling rvm. A cli command is provided for this very purpose…

```
$ rvm implode
```

…however it failed to complete for me. It removed `~/.rvmrc` and `/etc/rvm`, but didn’t delete `~/.rvm` so I went and did that manually. To remove the last traces of rvm, open `~/.profile` and delete the line(s) pertaining to it then restart your shell.

After making sure homebrew is up to date (`$ brew update`), run the following two commands to install first rbenv, then ruby-build. Ruby-build is a plugin for rbenv that allows it to compile and install different versions of Ruby.

```
$ brew install rbenv
$ brew install ruby-build
```

With those installed, we can move on to configuration.

In the configuration file for your shell of choice (`~/.profile`, `~/.zshrc`, `~/.bash_profile`, etc), add the following to load rbenv automatically then re-source the file or restart your shell.

```
eval "$(rbenv init -)"
```

Now to install a version of Ruby. You can get a list of all of the available versions with `$ rbenv install -l`. If you decide on, for example, 2.3.1 then run the following followed by the rehash command. Rehashing needs to be done whenever you install a new version of Ruby or a gem that provides commands. You can optionally set rehashing to be done automatically with the [rehash gem](https://github.com/rbenv/rbenv-gem-rehash).

```
$ rbenv install 2.3.1
$ rbenv rehash
```

To use the chosen version globally, run this.

```
$ rbenv global 2.3.1
```

Last but not least, we’ll setup Bundler to manage dependencies. At this point you can also install any other gems you want globally, for example `rails` and`pg`.

```
$ gem install bundler
$ brew install rbenv-bundler
$ rbenv rehash
```

The first command installs Bundler, the second installs [another rbenv plugin](https://github.com/carsomyr/rbenv-bundler) which will remove the need for you to type `bundle exec` prior to each command.

In your global `.gitignore`, add the following lines (if they aren’t already there) to avoid committing the files Bundler creates to a repo.

```
.bundle
vendor/bundle
```

With all of that done, you’re now in a position to get back to your projects. To use a specific Ruby version within one project, you can do this.

```
$ rbenv local 2.3.1
```

Of course, you’ll want your dependencies. Install them by running bundler.

```
$ bundle install
```

### Further reading

- [rbenv docs](https://github.com/rbenv/rbenv#table-of-contents)
- [Why choose rbenv over rvm?](https://github.com/rbenv/rbenv/wiki/Why-rbenv%3F)
- [rbenv-bundler docs](https://github.com/carsomyr/rbenv-bundler#rbenv-bundler-bundler-integration-for-rbenv)

