---
title: "Moving lines of code around in Vim"
date: 2017-01-19
slug: "/2017/01/19/moving-lines-of-code-around-in-vim"
category: Code
tags:
  - Vim
---

![GIF of the mapping in action](/static/posts/moving-lines-of-code-around-in-vim/moving-lines-in-vim.gif)

I recently added a handy little set of mappings to my `.vimrc` for moving code around.

They’ll take either the line you’re on (in normal mode) or the lines you’ve selected (in visual mode) and move them up or down 1 line.

The nice part is that, as you can see above, when you move lines into or out of parent blocks, their indention level will automatically get updated.

Here are the mappings you’ll need:

```vim
" Move lines around easily
nnoremap <leader>k :m-2<cr>==
nnoremap <leader>j :m+<cr>==
xnoremap <leader>k :m-2<cr>gv=gv
xnoremap <leader>j :m'>+<cr>gv=gv
```

