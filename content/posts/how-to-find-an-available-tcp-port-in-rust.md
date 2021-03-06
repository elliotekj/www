---
title: "How to find an available TCP port in Rust"
date: 2017-07-25
slug: "/2017/07/25/find-available-tcp-port-rust"
category: Code
tags:
  - Rust
---

Let’s say you’re writing your own deployment solution in Rust. The basic flow you have in mind might go something like this:

1. Pull the latest commits down onto the server
2. Build the app (if it’s written in a compiled language)
3. Start the app
4. Move traffic to the new version of the app
5. Remove the old version

The problem is that you’ve already got the old version of the app running so the new version will fail to start because the port it requires is already taken. What you need is a way to find a port that’s available, tell the app to start on that port, and then redirect traffic upstream to it.

This post will focus on finding one such available port in Rust.

### Basics

The interface to the code we’re about to write will be the `get_available_port` method. Using it in your code will look something like this.

```rust
fn main() {
    if let Some(available_port) = get_available_port() {
        println!("port `{}` is available", available_port);
    }
}
```

### Finding the port

We can now move on to defining `get_available_port`. As per [Rust’s standard library](https://doc.rust-lang.org/std/net/enum.SocketAddr.html#method.port), ports are `u16`s. We’ll wrap that in an `Option` in case the method fails to find an available port.

To keep the results sensible, we’ll only look for availability from port 8000 to port 8999. Ranges in Rust have an inclusive lower bound and an exclusive upper bound, which is why we define the 8000 to 8999 range as `8000..9000`.

```rust
fn get_available_port() -> Option<u16> {
    (8000..9000)
        .find(|port| port_is_available(*port))
}
```

Rust’s [`find`](https://doc.rust-lang.org/std/iter/trait.Iterator.html#method.find) method will break on the first element in the iteration for which the closure returns `true`. It will then return that element as an `Option`.

We now need to define the `port_is_available` method, which will take the port the iterator is processing and return the `bool` needed by `find`.

Start by importing `TcpListener` from the standard library:

```rust
use std::net::TcpListener;
```

Now add the `port_is_available` definition:

```rust
fn port_is_available(port: u16) -> bool {
    match TcpListener::bind(("127.0.0.1", port)) {
        Ok(_) => true,
        Err(_) => false,
    }
}
```

### Summary

That’s really all there is to it. Your final code should look something like this:

```rust
use std::net::TcpListener;

fn main() {
    if let Some(available_port) = get_available_port() {
        println!("port `{}` is available", available_port);
    }
}

fn get_available_port() -> Option<u16> {
    (8000..9000)
        .find(|port| port_is_available(*port))
}

fn port_is_available(port: u16) -> bool {
    match TcpListener::bind(("127.0.0.1", port)) {
        Ok(_) => true,
        Err(_) => false,
    }
}
```

### Testing

All that’s left to do is to make sure this actually works. If you do a `cargo
run`, you should see “port `8000` is available”, assuming you don’t already have something running on `127.0.0.1:8000`.

Let’s use [Netcat](https://en.wikipedia.org/wiki/Netcat) (if you’re using a Unix OS, it’s already installed) to quickly get something using port 8000. Run the following in a new terminal window:

```
$ nc -l 127.0.0.1 8000
```

Now, if you go back and do another `cargo run`, you should see “port `8001` is available” because port 8000 is in use.

