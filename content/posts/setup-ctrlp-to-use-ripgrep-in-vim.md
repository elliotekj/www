---
title: "Setup CtrlP to use ripgrep in Vim"
date: 2016-11-22
slug: "/2016/11/22/setup-ctrlp-to-use-ripgrep-in-vim"
category: Code
tags:
  - Vim
---

A few weeks ago I [wrote about](http://elliotekj.com/2016/10/30/using-ripgrep-and-fzf-instead-of-the-silver-searcher-and-ctrlp/) switching from CtrlP and The Silver Searcher to fzf and ripgrep. I have since returned to CtrlP and thought I’d share how to set that up with ripgrep too.

From my time with fzf, I can attest to the fact that it is indeed faster than CtrlP when the time comes to search for something. Having said that, I later discovered via a quick process of elimination that it also drags down Vim’s general performance.

* * *

My old CtrlP config came from [thoughtbot](https://robots.thoughtbot.com/faster-grepping-in-vim).

```vim
if executable('ag')
  " Use ag over grep
  set grepprg=ag\ --nogroup\ --nocolor

  " Use ag in CtrlP for listing files. Lightning fast and respects .gitignore
  let g:ctrlp_user_command = 'ag %s -l --nocolor -g ""'

  " ag is fast enough that CtrlP doesn't need to cache
  let g:ctrlp_use_caching = 0
endif
```

I’ve gone back to the same basic settings, with one addition. The ripgrep equivalent to the above is as follows.

```vim
if executable('rg')
  set grepprg=rg\ --color=never
  let g:ctrlp_user_command = 'rg %s --files --color=never --glob ""'
  let g:ctrlp_use_caching = 0
endif
```

The addition mentioned above is also the change that had the biggest impact. Had I known about it, I may not have ventured out on this experiment to begin with.

Meet `wildignore`. It’s a setting that takes file patterns you want Vim to ignore during file or directory name completion.

Outside of the above ripgrep conditional, add the following to your `.vimrc` to tell Vim to ignore the git and temp directories as well as Vim’s swap files. You can of course add more patterns to this as needed.

```vim
set wildignore+=*/.git/*,*/tmp/*,*.swp
```

