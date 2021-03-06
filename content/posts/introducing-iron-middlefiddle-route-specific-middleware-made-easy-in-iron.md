---
title: "Introducing iron-middlefiddle: Route specific middleware made easy in Iron"
date: 2017-07-01
slug: "/2017/07/01/introducing-iron-middlefiddle-route-specific-middleware-made-easy-iron"
category: Code
tags:
  - Rust
---

Route specific middleware is a fairly common need in web apps. As soon as you introduce something like authentication into the mix, you’ll probably want a way to apply middleware to routes you only want users to be able to access if they’re logged in.

As things stand, route specific middleware in Iron is a repetitive and messy business, which is where `iron_middlefiddle` comes in. It provides a macro which turns the tricky into the trivial, allowing you to add middleware to any number of routes within a [`Router`](https://docs.rs/router/0.5.1/router/struct.Router.html) easily.

```rust
let mut frontend_router = Router::new();

// Add some `frontend_router` routes and the middleware they should use:

middlefiddle! {
    router => frontend_router,
    routes => {
        lorem: get "/lorem" => controllers::lorem::index,
        ipsum: get "/ipsum" => controllers::ipsum::index,
        dolor: get "/dolor" => controllers::dolor::index,
    },
    middleware => {
        Middleware::BeforeMiddleware => middleware::auth::TokenValidity,
    },
};

// Add some more `frontend_router` routes that aren't going to need the middleware:

frontend_router.get("/amet", controllers::amet::index, "amet");
```

`iron_middlefiddle` is [well documented](https://docs.rs/iron-middlefiddle/0.1.1/iron_middlefiddle/) and [available on crates.io](https://crates.io/crates/iron-middlefiddle). Naturally, you’ll find its source code in [the repo on GitHub](https://github.com/elliotekj/iron-middlefiddle).

