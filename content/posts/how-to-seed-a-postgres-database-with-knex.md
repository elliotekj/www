---
title: "How to seed a Postgres database with Knex"
date: 2017-04-26
slug: "/2017/04/26/seed-postgres-database-knex"
category: Code
tags:
  - Postgres
  - Database
---

[Diesel](https://github.com/diesel-rs/diesel) is my ORM & query builder of choice for Rust projects, it doesn’t provide a way to seed a database though. I went looking for a seeding crate and came up empty handed, so settled on looking for a Node package instead. Though even NPM had a surprisingly limited number options, I found [Knex](http://knexjs.org/) which has served me well so far.

Though we’ll just be using Knex’s seeding functionality in this post, it too is a fully functional query builder. Though I haven’t used it for query building, it’s syntax looks pretty nice and I would certainly consider it for any future Node projects.

Let’s get cracking then. I’m going to assume that you already have Postgres setup on your machine.

### Setting up Knex

Once you’ve `cd`’d into your project, run the following to install the Knex package and the Node Postgres client needed by Knex:

```
$ yarn add knex pg --dev
```

Once that’s done, run the snippet below to create a new `knexfile.js`.

Note: If you prefer to use `knex` as a command, install it globally too with `yarn global add knex` then run `knex init` instead of this…

```
$ ./node_modules/.bin/knex init
```

### Configuring knex

If you open the `knexfile.js` initialised above, you’ll see it houses the settings for development, staging & production databases. We’re just going to configure a test database in this post — from there, you’ll be able to configure any other environments you need.

Replace the contents of `module.exports` with the following configuration for our test db:

```js
test: {
    client: 'pg',
    connection: 'postgres://username@localhost/your_app_name_test',
    migrations: {
        directory: __dirname + '/migrations'
    },
    seeds: {
        directory: __dirname + '/seeds/test'
    }
},
```

`client`, as the name suggests, specifies the database client we’re using for the environment. This post centres around PostgreSQL, Knex supports 6 different kinds of database though, including MySQL, MariaDB and Oracle.

`connection` is simply our database URL, which’ll need updating to the actual DB you’re targeting.

`migrations` → `directory`, as you might have guessed, is the path to the dir that houses your migrations. The above path is Diesel’s default — you’ll want to update it depending on where yours are kept.

`seeds` → `directory` is where Knex will add generated seed files.

For a full list of configuration options, read through the [relevant section](http://knexjs.org/#Installation-client) of Knex’s documentation.

### Creating seeds

With installation and configuration out of the way, we’re ready to start building some seeds. Back in your terminal, run the following to create a `users` seed file:

```
$ ./node_modules/.bin/knex seed:make users_seed --env test
```

That will generate a `users_seed.js` file and place it in the seeds directory we specified for our test environment earlier — `./seeds/test/`.

Open up the file and you’ll see that it creates a nice little starting point for us. Though I prefer to `dropdb` a database before seeding it for tests, you can leave the `.del()` function in there if you like.

Start by updating `table_name` on lines 4 and 7 to the name of the table you’re seeding — in this case, `users`. You can then delete lines 8 through 10 and insert your own data. Note that in the generated file, the `id` of the seeded rows is being specified. Unless you know what you’re doing, don’t include the `id` in your own data as it will mess up `BIGSERIAL` auto-incrementation. An example entry for a user could look something like this:

```js
return knex('users').insert([
    {
        email: "elliot@elliotekj.com",
        password_hash: "$argon2d$m=4096,t=3,p=1$JGFyZ29uMmQkb[...]",
        password_hash_random_salt: "9FT2UFEWRZOFtz5CQ0542HRTHREs5lalk",
        password_reset_active: false,
        password_reset_hash: null,
        password_reset_time: null,
        first_name: "Elliot",
        last_name: "Jackson",
        created_at: "2017-04-20 12:29:45.964056",
        updated_at: "2017-04-20 12:29:45.964056",
    },
]);
```

Remember that we’re working with Node and that `insert` just takes an array of objects. That structure means that, depending on your needs, you can create large amounts of seed data very easily with something like [faker](https://www.npmjs.com/package/faker) and a simple loop that pushes to an array that is then passed to `insert`.

### Seeding

With all that said and done, we’re ready to actually seed our database which is no harder than running:

```
$ ./node_modules/.bin/knex seed:run
```

### Wrapping up

Now that you know how to create and populate a single seed file for a single DB, you can start adding more data, more seed files and more environments by repeating the same methods outlined above.

The full documentation for Knex can be found here: [knexjs.org](http://knexjs.org)

