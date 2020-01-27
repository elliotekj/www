---
slug: "/docs/thea/install"
title: Thea » Install & Update
layout: thea-docs.html
repo_path: thea-install.md
---

## Install Thea Locally

Until Thea reaches its 1.0.0 release, the only way to install it will be via Cargo, Rust's build tool and package manager. If you don't have Rust setup on your machine, you can get the whole development environment setup by running [the single command shown on their website](https://www.rust-lang.org/learn/get-started).

Once you've done that, you can install Thea by running:

```shell
$ cargo install thea
```

## Install Thea on a Server

As with a local installation, you'll need to install Rust (see how above) on your server. However, you'll also need to install `build-essential`:

```shell
$ sudo apt install build-essential
```

You can now install Thea:

```shell
$ cargo install thea
```

## Update Thea

You can run the same command to update Thea whether you're in a local or server environment:

```shell
$ cargo install --force thea
```

If you're managing Thea with a systemd service on your server, remember to run:

```shell
$ sudo systemctl restart your-service
```
