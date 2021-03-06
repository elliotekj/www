---
title: "Setting Iron’s response MIME type with middleware"
date: 2017-06-29
slug: "/2017/06/29/setting-irons-response-mime-type-middleware"
category: Code
tags:
  - Rust
---

If your JSON API is powered by [Iron](http://ironframework.io/), you may well have a lot of duplicate code that sets the MIME type of each `Response`. Something like this:

```rust
use iron::mime::Mime;

pub fn example_handler(req: &mut Request) -> IronResult<Response> {
    let mime = "application/json".parse::<Mime>().unwrap();

    // …

    Ok(Response::with((mime, status::Ok, some_json)))
}
```

As we can see above, the code for setting a MIME type is generic and doesn’t need anything except a `Response` to modify. It is therefore a prime `AfterMiddleware` candidate, which once implemented will remove the need for the code repetition in each and every one of our routes’ handlers. Here’s a very brief `AfterMiddleware` description from the [docs](https://docs.rs/iron/0.5.1/iron/middleware/trait.AfterMiddleware.html):

> `AfterMiddleware` receive both a `Request` and a `Response` and are responsible for doing any response post-processing.

### Writing the middleware

As the docs said, `AfterMiddleware` receives both the `Request` and the `Response`. We don’t need to do anything to the `Request` so we’ll just mark it as unused with `_`. We do however want to modify the `Response` which can be done very straightforwardly with [`.set_mut()`](https://docs.rs/iron/0.5.1/iron/trait.Set.html#method.set_mut). Pieced together, we end up with this:

```rust:title=src/middleware.rs
use iron::{AfterMiddleware, IronResult, Request, Response};
use iron::prelude::*;
use iron::mime::Mime;

pub struct MimeJson;

impl AfterMiddleware for MimeJson {
    fn after(&self, _: &mut Request, mut res: Response) -> IronResult<Response> {
        res.set_mut("application/json".parse::<Mime>().unwrap());
        Ok(res)
    }
}
```

### Using the middleware

Not that we have our middleware in place, we need to use it. The following snippet, for example, uses it to set the MIME type of every handler in the `api_v1_router` router:

```rust:title=src/main.rs
extern crate iron;
extern crate router;
extern crate mount;

// Import the middleware:
use middleware;

fn main() {
    let api_v1_router = {
        let mut router = Router::new();
        router.get("/example", example_handler, "example");

        // `api_v1` specific middleware:
        let mut chain = Chain::new(router);
        chain.link_after(middleware::MimeJson);
        chain
    };

    let mut mount = Mount::new();
    mount.mount("/api/v1", api_v1_router);

    Iron::new(mount).http("127.0.0.1:8888").unwrap();
}
```

With that done we can go back and update our original `example_handler`, getting rid of all the MIME type code:

```rust
pub fn example_handler(req: &mut Request) -> IronResult<Response> {
    // …

    Ok(Response::with((status::Ok, some_json)))
}
```

