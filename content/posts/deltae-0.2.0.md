---
title: "DeltaE 0.2.0"
date: 2017-06-30
slug: "/2017/06/30/deltae-0-2-0"
category: Code
tags:
  - DeltaE
---

In the wee hours of this morning I released DeltaE `0.2.0`, my Rust implementation of the CIEDE2000 colour differentiation algorithm. The update brings 2 main improvements:

1. A new [`from_rgb`](https://docs.rs/delta_e/0.2.0/delta_e/struct.DE2000.html#method.from_rgb) method which will handle the conversions to LAB values for you and return the colour difference.
2. An extensive test suite based on the data in Table 1 of [“The CIEDE2000 Color-Difference Formula: implementation Notes, Supplementary Test Data, and Mathematical Observations”](http://www.ece.rochester.edu/~gsharma/papers/CIEDE2000CRNAFeb05.pdf)

With the addition of those tests, the library has reached a point where I feel comfortable in the thought of others using it. If no issues arise in the next month or so, I’ll bump this release to `1.0.0`.

You’ll find DeltaE `0.2.0` in the usual places: [crates.io](https://crates.io/crates/delta_e) & [GitHub](https://github.com/elliotekj/DeltaE).

