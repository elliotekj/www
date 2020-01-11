---
title: "Matching, saving and replacing text with the regex crate"
date: 2017-03-10
slug: "/2017/03/10/matching-saving-and-replacing-text-with-the-regex-crate/"
category: Code
tags:
  - Rust
  - Regex
---

Work continued on [flyingV](https://github.com/elliotekj/flyingV), one of my side-projects, last week. An interesting challenge I came up against was to find all of the matches to a particular regex across multiple files. For each match, I needed to save a specific portion of it then replace a specific portion of it with a new string.

The following uses the [regex crate](https://crates.io/crates/regex) and is written in Rust. Captures are a feature of the regex language, not the regex crate itself though so if you aren’t familiar with them, there should still be something in this post for you.

To business then. The pattern I was matching against was any [tera](https://github.com/Keats/tera) `for` loop containing quotes. Here’s an example loop I’d want to match:

```
{% for page in "20*/**/*" %}
```

My original regex looked something like this:

```rust
lazy_static! {
    pub static ref GLOB_FOR_LOOP_REGEX: Regex = Regex::new(r#"\{%\sfor\s\w*\sin\s"[^\s]*"\s%}"#).unwrap();
}
```

If you’re reading this and aren’t familiar with Rust or the regex crate, here’s what’s happening:

1. [`lazy_static!`](https://crates.io/crates/lazy_static) is a macro for creating `static`s that require code to run in order to be initialised.
2. `pub static ref GLOB_FOR_LOOP_REGEX: Regex` creates a `pub`lic `static` named `GLOB_FOR_LOOP_REGEX` of type `Regex`.
3. `Regex::new(r#"..."#)` creates a new regex from the pattern inside the parens. `r#"..."#` is Rust’s [raw string literal](https://doc.rust-lang.org/reference.html#raw-string-literals) syntax; a very handy way of creating a string without having to escape any characters.
4. `.unwrap();` unwraps what `Regex::new()` returns, leaving us with a `Regex` rather than a `Result<Regex, Error>` (as long as our regex is valid).

In its current state, the above pattern…

```
\{%\sfor\s\w*\sin\s"[^\s]*"\s%}
```

…will match `for` loops that look like the example loop. Once matched, we have no way of accessing different parts of the match to work with though.

I want to save the contents of the quotes in each loop then replace the quotes and everything in-between them with a new string. This is where regex’s captures come into play.

A capture is specified in a regular expression by parens. For each set of parens in a regex, the characters matched by the pattern within said parens will be saved in a numbered list of captures, which can then be accessed.

For example, we can update the above pattern to capture whatever is in-between the quotes by adding parens like so:

```
\{%\sfor\s\w*\sin\s"([^\s]*)"\s%}
--------------------^------^
```

We can then access them like this:

```rust
lazy_static! {
    pub static ref GLOB_FOR_LOOP_REGEX: Regex = Regex::new(r#"\{%\sfor\s\w*\sin\s"([^\s]*)"\s%}"#).unwrap();
}

fn main() {
    let text = r#"{% for page in "20*/**/*" %}"#;
    let captures = GLOB_FOR_LOOP_REGEX.captures(text).unwrap();

    println!("{}", captures.get(1).unwrap().as_str());
    // Prints → 20*/**/*
}
```

Now that we have an understanding of how captures work, we can update the original pattern to capture all of the parts of the matched loops we’re going to need.

```
(\{%\sfor\s\w*\sin)\s"([^\s]*)"\s(%})
^-----------------^ ^------^ ^--^
         1 2 3
```

1. Saves the start of the `for` loop syntax and the key used for looping.
2. Saves the contents of the quotes.
3. Saves the closing `for` loop syntax.

With those captures in place, we can rebuild the loop, replacing what needs to be replaced, saving what needs to be saved and deleting what needs to be deleted.

This is the function I ended up with in flyingV:

```rust
lazy_static! {
    pub static ref GLOB_FOR_LOOP_REGEX: Regex = Regex::new(r#"(\{%\sfor\s\w*\sin)\s"([^\s]*)"\s(%})"#).unwrap();
}

fn extract_custom_loops(html: &mut String) -> (String, HashMap<String, String>) {
    let mut custom_loops = HashMap::new();
    let mut custom_loop_count: u32 = 0;

    *html = GLOB_FOR_LOOP_REGEX.replace_all(html, |captures: &Captures| {
        let glob = captures.get(2).map_or("", |m| m.as_str()).to_string();
        let id = format!(" __CUSTOM_LOOP_{}__", custom_loop_count);

        custom_loops.insert(glob, id.clone());
        custom_loop_count += 1;

        return format!("{} {} {}", captures.get(1).map_or("", |m| m.as_str()), id, captures.get(3).map_or("", |m| m.as_str()));
    }).into_owned();

    (html.to_string(), custom_loops)
}
```

On line 9, we’re saying that we want to replace each of the regex’s matches (`.replace_all`) in the passed `html` string with whatever the second argument returns. `|captures: &Captures|` provides us with a reference to the list of all of the captures from the match to help us define what the replacement text should be.

We start by saving the contents of the quotes to an immutable variable and defining what we want to replace the quotes with (in this case, ` __CUSTOM_LOOP_{}__ ` where `{}` is the match count).

We then save the contents of the quotes to a HashMap along with the string we’re replacing it with and increment the match count so that each loop has a unique id.

Lastly, we use the elements of the original `for` loop we saved via captures earlier to build and return a new `for` loop with the parts we didn’t want deleted and the new string inserted. What is returned is what will be inserted in the `html` in the stead of the characters matched by the pattern.

In this case, something along the lines of…

```
{% for page in __CUSTOM_LOOP_1__ %}
```

…will be returned. Just what we were after.

