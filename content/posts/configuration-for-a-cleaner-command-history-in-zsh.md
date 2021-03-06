---
title: "Configuration for a cleaner command history in ZSH"
date: 2016-12-20
slug: "/2016/12/20/configuration-for-a-cleaner-command-history-in-zsh"
category: Code
tags:
  - ZSH
---

Being able to scroll back through all of the commands entered into the terminal with the up arrow key is very handy. A level of annoyance is added when having to scroll back through all the occurrences of a command that was repeated multiple times in succession however.

Fortunately, there’s an option you can set in your `.zshrc` to reduce a block of repeated commands down to just one line in the command history.

```
setopt hist_ignore_dups # Don't save multiple instances of a command when run in succession
```

You can go further with the `setopt hist_ignore_all_dups` option. With that set, all previously saved commands that match the command you just entered will be removed from the history. I personally don’t like this though, as when I’m going back through my history I like having the complete context around any previously entered command.

Lastly, in the name of a cleaner command history, you can set `setopt hist_reduce_blanks` which will just remove any superfluous whitespace from the command before saving it to the history.

