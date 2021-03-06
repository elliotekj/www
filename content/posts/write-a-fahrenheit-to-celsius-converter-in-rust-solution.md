---
title: "“Write a Fahrenheit to Celsius converter in Rust” solution"
date: 2017-01-22
slug: "/2017/01/22/write-a-fahrenheit-to-celsius-converter-in-rust-solution"
category: Code
tags:
  - Rust
---

![The program in action](/static/posts/write-a-fahrenheit-to-celsius-converter-in-rust-solution/demo.gif)

I started playing with [Rust](https://www.rust-lang.org/en-US/) this weekend and, as a sidebar, am absolutely loving it so far.

One of the recommended programs to write once you’ve got the basics down is a Fahrenheit to Celsius converter. There isn’t only one correct way to solve this problem but, mainly for anyone taking to Google for a solution, here’s mine.

```rust
use std::io;

fn main() {
  println!("What temperature would you like to convert to celsius?");

  let mut input_temp = String::new();

  io::stdin().read_line(&mut input_temp)
    .expect("Failed to read line.");

  let input_temp = input_temp.trim().parse::<f64>().unwrap();

  let converted_temp: f64 = (input_temp - 32.0) * 5.0/9.0;

  println!("{} degrees fahrenheit is {} degrees celsius.", input_temp, converted_temp);
}
```

I’m keeping my experiments in a public [“learning-rust” repo](https://github.com/elliotekj/learning-rust), should you be interested.

