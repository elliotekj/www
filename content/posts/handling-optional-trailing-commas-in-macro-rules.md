---
title: "Handling optional trailing commas in macro_rules!"
date: 2017-07-03
slug: "/2017/07/03/handling-optional-trailing-commas-macro_rules/"
category: Code
tags:
  - Rust
---

Here’s a nice little trick I discovered whilst dissecting [the `router!` macro](https://docs.rs/router/0.5.1/router/macro.router.html) for [iron-middlefiddle](https://github.com/elliotekj/iron-middlefiddle). You can optionally allow trailing commas in a macro with the following:

```rust
$(,)*
```

If you’re unfamiliar with the macro syntax in Rust then here’s how it breaks down:

```rust
// Start a repetition:
$(
// It's a repetition of commas:
,
// End the repetition:
)
// Allow zero or more of these repetitions:
*
```

And here’s how it looks in action:

```rust
macro_rules! router {
    (
        // Start a repetition:
        $(
            // The pattern of each repetition:
            $route_id:ident: $method:ident $glob:expr => $handler:expr
        // End the repetition:
        )
        // Each repetition will be separated by a comma:
        ,
        // Allow one or more of these repetitions:
        +
        // Allow zero or more commas after the last repetition:
        $(,)*
    ) => { ... };
}
```

As you have probably deduced, it’s not an ideal solution because it not only makes zero or one trailing commas valid; but also two, three, four or sixteen trailing commas valid. Overall though, I think this is a nicer way of handling things than the two other options:

1. Explicitly stating you expect or do not expect a trailing comma, resulting in a compile error if the user respectively does not or does leave a trailing comma. This option gets a bonus thumbs-down because such a treatment of trailing commas is not in keeping with the rest of the Rust language.

2. Adding repetitious code in the macro to explicitly handle zero or one (and only one) trailing commas.

