---
title: "Better find and replace in Vim"
date: 2016-08-30
slug: "/2016/08/30/better-find-and-replace-in-vim"
category: Code
tags:
  - Vim
---

Doing a document-wide find and replace in Vim looks like this:

```vim
:%s/find this/replace with this/g
```

Alternatively, we can drop the range of the find and replace from all lines to only the current one by removing the `%`:

```vim
:s/find this/replace with this/g
```

The `%` is just a shortcut for `1,$`, where `$` means the end of the file. Therefore, a find and replace can be run on specific line numbers by doing the following. In this example, we’ll run it on lines 16 through 22 (inclusive):

```vim
:16,22s/find this/replace with this/g
```

Whilst not the most complex of regular expressions, finding and replacing is a common action so the above will be typed out quite often. I have set up shortcuts for the two most common find and replace actions I do: in the whole file and in the current line.

Open up your `.vimrc` and add the following:

```vim
" Better find and replace
map <leader>fr :%s///g<left><left>
map <leader>frl :s///g<left><left>
```

If we break this down, we can see that `<leader>fr` is being mapped to `%s///g<left><left>`. Inserting nothing between the first two slashes tells Vim to replace anything that matched the last search. We use `<left><left>` to move the cursor to the left of the last slash where we type in the replacement text.

Putting all of this together, a document-wide find and replace can now be done by typing the following. My leader key is set to space. If yours is different, adjust accordingly.

```vim
/find this
space+fr replace with this
```

To give more of a real-world example, the following will replace all double quotes in the current file with single quotes:

```vim
/"
space+fr '
```

Similarly, this will replace all double quotes in the current line with single quotes:

```vim
/"
space+frl '
```

![Running find and replace on the current line](/static/posts/better-find-and-replace-in-vim/find-replace-line.gif)

