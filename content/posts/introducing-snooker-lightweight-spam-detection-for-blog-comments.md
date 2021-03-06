---
title: "Introducing Snooker: Lightweight spam detection for blog comments"
date: 2017-08-15
slug: "/2017/08/15/introducing-snooker-lightweight-spam-detection-for-blog-comments"
category: Code
tags:
  - Snooker
---

If you’ve been following the [Magnificent Walrus](https://elliotekj.com/2017/08/12/initial-thoughts-on-baked-commenting/) [dev logs](https://elliotekj.com/2017/08/13/baked-commenting-dev-log-n1/), you’ll have read that I opted for the “[Snook Algorithm](https://snook.ca/archives/other/effective_blog_comment_spam_blocker)” instead of adding an external dependency in the form of [Akismet](https://akismet.com).

I’ve dubbed it the “Snook Algorithm” because as far as I know, it doesn’t have an official name. It’s the points-based system Jonathan uses (or perhaps _used_ at this point) for filtering spam on [snook.ca](https://snook.ca/).

Each comment starts with 0 points. Points are then awarded and deducted based on a variety of rules. If a comments final score is greater than or equal to 1, the comment is considered valid. If the comments final score is 0 then it’s considered to be worth moderating. If the comments final score is below 0 then it’s considered to be spam.

The first beta of my implementation of the “Snook Algorithm” was released earlier today. You can get it via the usual platforms: [crates.io](https://crates.io/crates/snooker) and [GitHub](https://github.com/elliotekj/snooker).

### Example

Snooker gives the example comment below a score of **-10** based off of the following patterns:

- The `body` has less that 2 links in it: **+2 points**
- The `body` is more that 20 characters long but contains 1 link: **+1 point**
- The link in the `body` contains one keyword considered spammy (“free”): **-1 point**
- The `body` contains one phrase considered spammy (“limited time only”): **-1 point**
- The `body` starts with a word considered spammy when it’s the first word of the comment (“nice”): **-10 points**
- The `author` field doesn’t contain `http://` or `https://`: **+0 points** (unchanged)
- The `url` field contains a keyword considered spammy (“free”): **-1 point**
- None of the URLs use a TLD considered spammy: **+0 points** (unchanged)
- None of the URLs are longer that 30 characters: **+0 points** (unchanged)
- No consonant groups were found: **+0 points** (unchanged)
- No data was provided about the comments previously submitted with this email address: **+0 points** (unchanged)

```rust
use snooker::{Comment, Snooker, Status};

let comment = Comment {
    author: Some("Johnny B. Goode".to_string()),
    url: Some("http://my-free-ebook.com".to_string()),
    body: String::from("
        <p>Nice post! Check out our free (for a limited time only) eBook
        <a href=\"http://my-free-ebook.com\">here</a> that's totally relevant</p>
    "),
    previously_accepted_for_email: None,
    previously_rejected_for_email: None,
    previous_comment_bodies: None,
};

let snooker_result = Snooker::new(comment);
assert_eq!(snooker_result.score, -10);
assert_eq!(snooker_result.status, Status::Spam);
```

