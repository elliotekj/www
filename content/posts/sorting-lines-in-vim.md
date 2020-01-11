---
title: "Sorting lines in Vim"
date: 2016-11-14
slug: "/2016/11/14/sorting-lines-in-vim/"
category: Code
tags:
  - Vim
---

Amongst Vim’s many commands, there’s the humble yet powerful `:sort`. As you’d expect, it takes a selection or a range and sorts it. By default, that sort is numerical (``through`9`), then alphabetical (`A`through`Z`followed by`a`through`z`).

All that to say that running a generic `:sort` on the characters to the left in the following example would result in them being reordered to how you see them on the right.

```
Original Sorted
    a => 2
    B => B
    c => a
    2 => b
    b => c
```

That’s ever so close to what I’d like. I’d rather it ignore the case of the letters when sorting alphabetically however; something that can easily be done by passing `i` into the command. `:sort i` results in the following.

```
Original Sorted
    a => 2
    B => a
    c => B
    2 => b
    b => c
```

99% of the time, `:sort i` is precisely what I’m after. As it’s functionality I use multiple times a day, I have it remapped. `<leader>s` works well for me.

```vim
xnoremap <leader>s :sort i<cr>
```

* * *

Now for the lesser used, yet still occasionally useful sort options.

`:sort! i` (no space between the command and the `!`) will sort the selection in the reverse order:

```
Original Sorted
    a => c
    B => b
    c => B
    2 => a
    b => 2
```

`:sort u` will remove any duplicate lines:

```
Original Sorted
    a => 2
    B => B
    b => a
    c => b
    2 => c
    b =>
```

And `:sort n` will sort lines based on the first decimal number in the line (use `f` for a float). In it’s most basic use case (the example below), it will look at the entire value of the number, rather than just the first digit in the number. Otherwise, `55` would be sorted before `9` as `5` precedes `9`.

```
Original Sorted
   22 => 1
    1 => 5
   42 => 8
    5 => 22
    8 => 42
   80 => 80
```

It gets better though, as running `:sort n` on lines that contain numbers will result in them being ordered based on the first number in the line, no matter where in the line that number is.

```
Original Sorted
The 5 quick brown foxes => jumped over the 2 lazy dogs
jumped over the 2 lazy dogs => at 4 o'clock in the afternoon
at 4 o'clock in the afternoon => The 5 quick brown foxes
```

* * *

That concludes coverage of the most useful `:sort` commands, but not all of them. `:help sort` has explanations of the rest, should you be curious.

