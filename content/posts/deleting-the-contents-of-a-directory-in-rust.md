---
title: "Deleting the contents of a directory in Rust"
date: 2017-03-20
slug: "/2017/03/20/deleting-the-contents-of-a-directory-in-rust"
category: Code
tags:
  - Rust
---

There are various ways to delete the contents of a directory. You could, for example, delete the directory itself with [`fs::remove_dir_all`](https://doc.rust-lang.org/std/fs/fn.remove_dir_all.html) and then create a new directory with the same name.

A more refined solution, which will go through the contents of a directory and delete each child without actually destroying and recreating the parent, looks like this:

```rust
use std::fs::{self, ReadDir};
use std::io::Error;

fn main() {
    let demo_dir = fs::read_dir("/path/to/dir");
    delete_dir_contents(demo_dir);
}

fn delete_dir_contents(read_dir_res: Result<ReadDir, Error>) {
    if let Ok(dir) = read_dir_res {
        for entry in dir {
            if let Ok(entry) = entry {
                let path = entry.path();

                if path.is_dir() {
                    fs::remove_dir_all(path).expect("Failed to remove a dir");
                } else {
                    fs::remove_file(path).expect("Failed to remove a file");
                }
            };
        }
    };
}
```

[`ReadDir`](https://doc.rust-lang.org/std/fs/struct.ReadDir.html) provides an iterator over the contents of a directory. It’s worth noting that it’s a non-recursive iterator, which is why we’re using `fs::remove_dir_all` here. That standard function will delete a directory along with all of it’s contents, which avoids us having to recursively walk and delete. As I’m here, I’ll recommend the [walkdir](https://crates.io/crates/walkdir) crate for all of your recursive walking needs though.

Note: In production, the `delete_dir_contents` function is the sort of thing you’d probably want to break out into a `utils` module.

