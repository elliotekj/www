---
title: "Using ripgrep and fzf instead of The Silver Searcher and CtrlP in Vim"
date: 2016-10-30
slug: "/2016/10/30/using-ripgrep-and-fzf-instead-of-the-silver-searcher-and-ctrlp-in-vim"
category: Code
tags:
  - Vim
---

Update 22/11/2016: I have gone back to CtrlP. If you would like to know how to set that up to use ripgrep, please see [here](http://elliotekj.com/2016/11/22/setup-ctrlp-to-use-ripgrep-in-vim/).

I have been using The Silver Searcher and CtrlP with caching turned off for my file-opening needs and it’s a setup that has served me well. Turning off caching doesn’t drag down performance too much, however there is still a noticable speed decrease (as you might expect).

Earlier this week, I went looking for an alternative setup. I had recently [come across ripgrep](http://blog.burntsushi.net/ripgrep/) and wanted to give it a try. In my browsing, I also stumbled upon the fuzzy-finder [fzf](https://github.com/junegunn/fzf). I ended up setting up the pair for use in Vim and have been enjoying a very noticable speed increase since.

![Searching for a file with fzf and ripgrep](/static/posts/using-ripgrep-and-fzf-instead-of-the-silver-searcher-and-ctrlp-in-vim/fzf.gif)

### Installation

Let’s start by installing ripgrep and fzf on our system.

```
$ brew install ripgrep
$ brew install fzf
```

It’s worth noting that ripgrep is a relitively new addition to Homebrew so you may need to update it (`$ brew update`) beforehand.

### Configuration

Next, we’ll integrate them into Vim. I’m using [Vim Plug](https://github.com/junegunn/vim-plug) to manage plugins (if you’re not then I recommend it) and the following, whilst specific to that manager, should be easily adapatable to your preferred one.

Open up your `.vimrc` and in the Vim Plug section add the following lines.

```vim
Plug '/usr/local/opt/fzf'
Plug 'junegunn/fzf.vim'
```

Source the file and install them.

```vim
:so %
:PlugInstall
```

The first of the above `Plug`s will load fzf from where Hombrew installed it. The second will install a [plugin](https://github.com/junegunn/fzf.vim) put together by the creator of fzf which we will look at next.

fzf.vim provides, amongst [others](https://github.com/junegunn/fzf.vim#commands), a `:Files` command which will be the main one we use. I mapped it to `<leader>o` for convenience.

```vim
nnoremap <leader>o :Files<cr>
```

The main thing left to do now it to tell fzf to use ripgrep. We can do so in our `.zshrc` / `.bashrc`.

```
export FZF_DEFAULT_COMMAND='rg --files --hidden --smart-case --glob "!.git/*"'
```

Let’s take a look at those flags:

- `--files`: Makes ripgrep print each file that would be searched, but prevents ripgrep from actually searching it.
- `--hidden`: Makes ripgrep search hidden directories and files.
- `--smart-case`: Makes ripgrep search case-insensitively if the pattern is all lowercase, however if there is a capital the search becomes case-sensitive.
- `--glob`: (with an exclamation mark) makes ripgrep ignore directories matching the passed patterns. In this case, we want to ignore the .git folder.

One flag that I haven’t included, but which you may want to use is `--no-ignore`, which will tell ripgrep to search files and directories listed in `.gitignore`, `.ignore`, etc. By default, files that are set to be ignored in those files are ignored by ripgrep.

