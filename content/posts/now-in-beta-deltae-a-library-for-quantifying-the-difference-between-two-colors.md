---
title: "Now in beta: DeltaE – a library for quantifying the difference between two colors"
date: 2017-05-26
slug: "/2017/05/26/now-beta-deltae-library-quantifying-difference-two-colors"
category: Code
tags:
  - DeltaE
---

I have just published the first beta of my first public crate. [DeltaE](https://crates.io/crates/delta_e) is a pure-Rust implementation of the International Commission on Illumination’s CIEDE2000 algorithm.

The goal of the algorithm is to put a number on the difference our eyes perceive when looking at two colours. If you’re interested in the details, then I recommend [this rundown](https://zschuessler.github.io/DeltaE/learn/). In short though:

- If the returned value is less than 1, then the human eye can’t distinguish between the two colours.
- If the returned value is greater than 1, then we humans can see a difference when presented with the two colours.
- The greater the return value, the more difference the human eye perceives.

* * *

This crate was written to be used in a project I’m currently tinkering with. It’ll come out of beta once I, and hopefully others, have used it some more and I have improved the test suite.

It is entirely based on [Zachary Schuessler](http://zaclee.net/)’s [Javascript implementation](https://github.com/zschuessler/DeltaE/blob/master/src/dE00.js) of the algorithm. He is also the author of the aforementioned rundown so a huge thank you goes out to him for his work.

- DeltaE on Crates.io: [https://crates.io/crates/delta\_e](https://crates.io/crates/delta_e)
- DeltaE on GitHub: [https://github.com/elliotekj/DeltaE](https://github.com/elliotekj/DeltaE)

