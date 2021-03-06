---
title: "Hashing sensitive data in Rust with argon2rs"
date: 2017-04-02
slug: "/2017/04/02/hashing-sensitive-data-in-rust-with-argon2rs"
category: Code
tags:
  - Rust
---

Argon2 is the password hashing algorithm that won the [Password Hashing Competition](https://password-hashing.net) in 2015. It is comprised of 2 main versions: Argon2i, which is optimised to resist [side-channel attacks](https://en.wikipedia.org/wiki/Side-channel_attack); and the version we’re interested in, Argon2d, which is optimised to resist GPU cracking attacks.

The [argon2rs](https://crates.io/crates/argon2rs) crate is a pure rust implementation of Argon2, which supports both of the above versions.

We’ll be using argon2rs’ default values for the number of passes etc., so the only things we need to supply are the data to hash and salt. If you’re not familiar, “salt” refers to random data used in one-way hashing functions — i.e. hashing functions that are too expensive to invert to be practical for attackers — to defend against [dictionary attacks](https://en.wikipedia.org/wiki/Dictionary_attack) and pre-computed [rainbow table](https://en.wikipedia.org/wiki/Rainbow_table) attacks.

A common mistake when hashing data is using the same salt every time. By doing so, all same-value data that is input yields the same hashed value in the database, effectively negating the work the salt was there to do in the first place. For example, if 2 users use `rustacean` as their password then the value of `password_hash` in the database will be the same for both users in the database. Not good.

Generating a unique salt each time is fine and dandy, but at some point we’re going to need to verify the hashed data, say a password, against data the user has input into the system. When that time comes, we’re going to need access to the random salt that was used for the original hash, meaning we need to store _it_ in the database too.

I’m sure you can see the problem with this. By storing salt in the database, we’re back in a situation where using salt in the first place becomes pointless should the database become compromised.

The solution is to not actually hash the data with the random salt directly, but to first hash the random salt with static salt stored locally, then hash the data with the hashed value of the random salt.

In doing this, both the database and the file system would need to be compromised for the aforementioned kinds of attack to be practical.

Enough theory then, let’s take a look at how to use the argon2rs crate to achieve this.

* * *

We’re going to have 3 dependencies: argon2rs, of course, for hashing; [dotenv](https://crates.io/crates/dotenv) for storing a local salt; and [rand](https://crates.io/crates/rand) for generating random salt. Add them to your `Cargo.toml`:

```rust:title=~/myproject/src/Cargo.toml
[dependencies]
argon2rs = "0.2"
dotenv = "0.10"
rand = "0.3"
```

Let’s start by setting up a local salt. At the highest level in your project’s directory, create a file named `.env` and add a `LOCAL_SALT` environment variable. Make sure you add `.env` to your `.gitignore` too.

```:title=~/myproject/.env
LOCAL_SALT=TWQA38DcB6Gyt4l7CG5W£lkj234WKKXP
```

With that done, we can setup the dotenv crate in `main.rs`:

```rust:title=~/myproject/src/main.rs
extern crate dotenv;

use dotenv::dotenv;
use std::env;

fn main() {
    dotenv().ok();

    hash_data();
}

fn hash_data() {
    let local_salt = env::var("LOCAL_SALT").expect("LOCAL_SALT must be set");

    println!("local salt: {}", local_salt);
}
```

Next, we’ll setup random salt generation using the rand crate:

```rust:title=~/myproject/src/main.rs
extern crate dotenv;
extern crate rand;

use dotenv::dotenv;
use rand::Rng;
use std::env;

fn main() { // Unchanged… }

fn hash_data() {
    let local_salt = env::var("LOCAL_SALT").expect("LOCAL_SALT must be set");
    let random_salt = rand::thread_rng().gen_ascii_chars().take(32).collect::<String>();

    println!("local salt: {}", local_salt);
    println!("random salt: {}", random_salt);
}
```

Now we can configure argon2rs to hash the data:

```rust:title=~/myproject/src/main.rs
extern crate argon2rs;
extern crate dotenv;
extern crate rand;

use argon2rs::defaults::{KIB, LANES, PASSES};
use argon2rs::verifier::Encoded;
use argon2rs::{Argon2, Variant};
use dotenv::dotenv;
use rand::Rng;
use std::env;

fn main() {
    dotenv().ok();

    let data_to_hash = /* However it is you receive user input */;
    hash_data(data_to_hash);
}

fn hash_data(data: &str) {
    let local_salt = env::var("LOCAL_SALT").expect("LOCAL_SALT must be set");
    let random_salt = rand::thread_rng().gen_ascii_chars().take(32).collect::<String>();

    let a2 = Argon2::new(PASSES, LANES, KIB, Variant::Argon2d).unwrap();
    let random_salt_hash = Encoded::new(a2, random_salt.as_bytes(), local_salt.as_bytes(), b"", b"").to_u8();
    let random_salt_hash_storable_encoding = String::from_utf8(random_salt_hash).unwrap();

    let a2 = Argon2::new(PASSES, LANES, KIB, Variant::Argon2d).unwrap();
    let data_hash = Encoded::new(a2, data.as_bytes(), random_salt_hash_storable_encoding.as_bytes(), b"", b"").to_u8();
    let data_hash_storable_encoding = String::from_utf8(data_hash).unwrap();

    println!("random salt: {}", random_salt);
    println!("data hash: {}", data_hash_storable_encoding);
}
```

At this point, we’ve finished preparing the data for the database. I’m just printing the values, but you’ll want to take the values of `data_hash_storable_encoding` and `random_salt` and add them to whatever it concerns in whichever database system you’re using.

Now to add a way to compare user-inputted data to the hash in the database:

```rust:title=~/myproject/src/main.rs
extern crate argon2rs;
extern crate dotenv;
extern crate rand;

use argon2rs::defaults::{KIB, LANES, PASSES};
use argon2rs::verifier::Encoded;
use argon2rs::{Argon2, Variant};
use dotenv::dotenv;
use rand::Rng;
use std::env;

fn main() {
    dotenv().ok();

    let data_to_hash = /* However it is you receive user input */;
    hash_data(data_to_hash);

    let user_input = /* However it is you receive user input */;
    let hashed_data = /* Retrieve the previously hashed data from your database */;
    let random_salt = /* Retrieve the randomly generated salt from your database */;
    compare_input_to_hashed_value(user_input, hashed_data, random_salt);
}

fn hash_data(data: &str) { // Unchanged… }

fn compare_input_to_hashed_value(input: &str, hashed_value: &str, random_salt: &str) {
    let local_salt = env::var("LOCAL_SALT").expect("LOCAL_SALT must be set");

    let a2 = Argon2::new(PASSES, LANES, KIB, Variant::Argon2d).unwrap();
    let random_salt_hash = Encoded::new(a2, random_salt.as_bytes(), local_salt.as_bytes(), b"", b"").to_u8();
    let random_salt_hash_storable_encoding = String::from_utf8(random_salt_hash).unwrap();

    let a2 = Argon2::new(PASSES, LANES, KIB, Variant::Argon2d).unwrap();
    let data_hash = Encoded::new(a2, input.as_bytes(), random_salt_hash_storable_encoding.as_bytes(), b"", b"").to_u8();
    let data_hash_storable_encoding = String::from_utf8(data_hash).unwrap();

    if data_hash_storable_encoding == hashed_value {
        println!("They're equal!");
    } else {
        println!("They're not equal.");
    }
}
```

And there we have it. You should now be able to pass the same data into this system twice and wind up with 2 different hash values in your database.

I’m no security expert, but from what I’ve gleaned in my research this approach to hashing is a good one. If you _are_ an expert and find something wrong with it, please do reach out. I’ll update this post accordingly.

Happy Rusting.

