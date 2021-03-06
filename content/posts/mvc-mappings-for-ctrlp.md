---
title: "MVC mappings for CtrlP"
date: 2017-04-12
slug: "/2017/04/12/mvc-mappings-for-ctrlp"
category: Code
tags:
  - Vim
---

It’s been a while since I last shared anything Vim related.

My favourite somewhat-recent addition to my `.vimrc` is a set of [CtrlP](https://github.com/ctrlpvim/ctrlp.vim) mappings for searching directly within an apps model, view, controller, or helper directories.

```vim
nnoremap <leader>c :CtrlP src/controllers<cr>
nnoremap <leader>h :CtrlP src/helpers<cr>
nnoremap <leader>m :CtrlP src/models<cr>
nnoremap <leader>v :CtrlP src/views<cr>
```

Chances are, your MVC directories don’t live in `src/` in your project. If you build Rails apps for example, then you’ll want to change that to `app/`.

I first saw these mappings in [Gary Bernhardt](http://destroyallsoftware.com)‘s dotfiles, so full credit to him.

