---
title: "How to set up environment varying code in your Rust web app"
date: 2017-04-14
slug: "/2017/04/14/set-environment-varying-code-rust-web-app/"
category: Code
tags:
  - Rust
---

There are times when you’ll want your app to run different code depending on which environment it’s in: development, production, etc.

For example: You provide your templating engine with a `baseurl` variable. In production, you want it to point to `https://my-app.com`, but in development you want it to point to `http://localhost:8888`.

We can accomplish this in Rust-y web apps with [environment variables](https://en.wikipedia.org/wiki/Environment_variable) and the dotenv crate, as demonstrated in the following post.

### Create a `.env` file

We’ll start by creating a `.env` file at the top level of our local project and inserting the following variable. If you already have a `.env` file, then just insert it on a new line.

```
PRODUCTION=
```

We’ll use that variable to provide a `bool` stating whether or not the app is running in production. Locally, there shouldn’t be any characters after the `=` sign. In your production server’s `.env`, insert the following:

```
PRODUCTION=1
```

### Add the dotenv crate

Now that we have `.env` files with the appropriately configured variable in our various environments, we can use them in our app.

We’re going to be using the popular [dotenv](https://crates.io/crates/dotenv) crate to make the variables available to our app. Let’s add it to our `Cargo.toml`…

```rust
[dependencies]
dotenv = "0.10.0"
// […]
```

…and import it:

```rust
extern crate dotenv;
// …

use dotenv::dotenv;
// …
```

Lastly we’ll tell dotenv to load the variables contained in the project’s `.env` into our app. Place the following right at the top of `fn main`:

```rust
dotenv().ok();
```

### Using the variables

With that done, we can access the environment variables in the file the same way we would access the system’s variables.

Start by importing the standard environment library:

```rust
use std::env;
```

There are a few ways to approach the next part. If you’re going to be using this across different files and functions in your app (likely), then creating a `lazy_static` is probably the way to go. For brevity, I’m going to assume you’re only using the `PRODUCTION` variable within one function though.

Add the following to the function in question:

```rust
let is_in_production = env::var("PRODUCTION").is_ok();
```

`env::var` returns a result based on (a) if the variable is present and (b) if it is valid unicode. The variable with nothing after the `=` sign we created above was purposefully mal-formatted so that when we call `is_ok` on the result of `env::var`, it returns `false` because `env::var` returns an error. In production, as the variable is correctly formatted in that environment, `is_ok` will return `true`.

Now in our function we can do:

```rust
if is_in_production {
    // Our app is running in production…
} else {
    // Our app isn't running in production…
}
```

### Conclusion

This approach can be extended for code that varies again if running in staging or testing or both. Just set, for example, `STAGING=1` where appropriate and add an `else if` branch to the existing conditional(s):

```rust
let is_in_production = env::var("PRODUCTION").is_ok();
let is_in_staging = env::var("STAGING").is_ok();

if is_in_production {
    // Our app is running in production…
} else if is_in_staging {
    // Our app is running in staging…
} else {
    // Our app isn't running in production or staging…
}
```

