---
title: "SQLite and iOS: Getting started with GRDB"
date: 2019-12-09
slug: "/2019/12/11/sqlite-ios-getting-started-with-grdb"
category: Code
tags:
  - Swift
  - Database
excerpt: An introduction to SQLite databases on iOS, covering setup, migrations, and basic querying.
---

Designed to provide local data storage for individual applications and devices, SQLite is a small, fast, highly reliable SQL database engine that I have a lot of love for.

[GRDB](https://github.com/groue/GRDB.swift) is a fantastic SQLite toolkit maintained by [Gwendal Roué](https://github.com/groue) that does all the hard work for us: it provides, amongst other features, a query interface so we don't have to write raw SQL (though you can still do that if you need to), migrations, database observation, and encryption. It's what I use in my own projects, and it's what we'll be using in this article.

This article will cover setting up a local SQLite database for your iOS app, writing migrations, writing a struct to the database without any manual value mapping, and querying data pre-modelled into a struct. There will be [a follow-up article](https://elliotekj.com/2019/12/20/sqlite-ios-advanced-grdb) that'll cover some of GRDB's more advanced features.

---

### Part 1: How to setup GRDB in your app

This section will cover installing GRDB, creating the database file, connecting to it, and writing a migration.

#### Installation

First things first, you need to add GRDB to your project. Carthage isn't supported, but CocoaPods and the Swift Package Manager are.

```ruby:title=Podfile
pod 'GRDB.swift'
```

```swift:title=Package.swift
let package = Package(
    dependencies: [
        .package(url: "https://github.com/groue/GRDB.swift.git", ...)
    ]
)
```

#### Creating the database file and connecting to it

Now that GRDB is installed, we can get down to business. Create a file named DatabaseManager.swift, AppDatabase.swift, or something similar. This is where your migrations will live alongside the setup function.

```swift:title=DatabaseManager.swift
import GRDB

var dbQueue: DatabaseQueue!

class DatabaseManager {

    static func setup(for application: UIApplication) throws {
        let databaseURL = try FileManager.default
            .url(for: .applicationDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
            .appendingPathComponent("db.sqlite")

        dbQueue = try DatabaseQueue(path: databaseURL.path)
        dbQueue.setupMemoryManagement(in: application)
    }

}
```

Right at the top on line 3 you'll see the global `dbQueue` variable. The connection to the database gets closed when the `DatabaseQueue` gets deallocated, so for most use cases you'll want it kept in memory throughout the lifetime of your app.

You'll notice that we never explicitly create the db.sqlite file, we just compose its path. That's because the `DatabaseQueue` initializer on line 12 will automatically create the database file for us if it can't find an existing one.

`setupMemoryManagement` on line 13 tells GRDB to automatically run `dbQueue.releaseMemory()` both when your app enters the background and if your app receives memory warnings; `releaseMemory` will then free up as much of the memory GRDB is using as possible.

All that's left to do is call the `setup` method in your AppDelegate:

```swift:title=AppDelegate.swift {2}
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    try! DatabaseManager.setup(for: application)
    return true
}
```

### Adding migrations

We now have a database and a connection to it, but before we can insert data, we still need to define a table and its columns.

GRDB's `DatabaseMigrator` is responsible for registering and applying migrations. If you're unfamiliar with the concept, migrations provide an easy way to evolve the structure of a database over time. **They are guaranteed to be applied in order, and only once.**

For example, say you added a new feature to version 2 of your app that required a new column in one of your tables (or even a new table entirely). GRDB will check when the `DatabaseMigrator` is run and see that there's a new migration that has yet to be applied to the database. It will then run that migration, ignoring all the other ones that have already been run, and the database structure in version 2 of your app will now match your updated model(s).

```swift:title=DatabaseManager.swift
class DatabaseManager {

    static var migrator: DatabaseMigrator {
        var migrator = DatabaseMigrator()

        migrator.registerMigration("createProject") { db in
            try db.create(table: "project") { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("name", .text).notNull()
                t.column("description", .text)
                t.column("due", .date)
            }
        }

        return migrator
    }

}
```

Most of the above is fairly self-explanatory, but we'll run through it quickly just in case.

You can see that line 6 marks the start of a new migration. It's important to remember that once the first version of your app has been released, you can't go back and make changes to old migrations because those changes won't be applied on user's devices. Any changes must be applied in a new migration.

Line 7 creates a new table named `project`, then lines 8 and 9 specify the name, type, and characteristics of 2 columns. `autoIncrementedPrimaryKey` is the best way to define a primary key that's numeric, as it automatically prevents reuse of the value over the lifetime of the database.

Once your first migration(s) are in place, don't forget to update your `setup` method to run the migrations.

```swift:title=DatabaseManager.swift {5}
class DatabaseManager {

    static func setup(for application: UIApplication) throws {
        // Existing setup code…
        try migrator.migrate(dbQueue)
    }

}
```

Should you need to make alterations to your tables in future versions of your app, you can do so quite straightforwardly by registering a new migration.

```swift:title=DatabaseManager.swift
static var migrator: DatabaseMigrator {
    var migrator = DatabaseMigrator()

    // `createProject` migration…

    migrator.registerMigration("v2") { db in
        try db.alter(table: "project") { t in
            t.add(column: "isDraft", .boolean).notNull().defaults(to: true)
        }

        try db.rename(table: "project", to: "collection")
    }

    return migrator
}

```

> 💡 Tip from the GRDB docs
>
> Database table names should be singular and camel-cased (e.g. country, > postalAddress). Names that follow another convention are totally OK, but you > will need to perform extra configuration when using Associations.

In the early days of an app's development, its database schema changes frequently. To avoid a pileup of migrations before v1 is even out the door, you can tell GRDB to automatically reset the database if it detects a change to an existing migration.

```swift filename=DatabaseManager.swift highlight=4,5,6
static var migrator: DatabaseMigrator {
    // Migrations…

    #if DEBUG
    migrator.eraseDatabaseOnSchemaChange = true
    #endif

    return migrator
}

```

---

### Part 2: Reading from and writing to your database

We'll ignore line 11 in the "alterations snippet" in Part 1, meaning that we now have a `project` table that has `id`, `name`, `description`, `due`, and `isDraft` columns that need modelling into a struct. That's what we'll be doing in Part 2, along with some simple reading and writing.

#### Structuring your data

Create a new group in your project and name it Models. Within that group, create a Project.swift file and add the following struct.

```swift filename=Models/Project.swift
struct Project {
    var id: Int64?
    var name: String
    var description: String?
    var due: Date?
    var isDraft: Bool
}
```

GRDB recommends using an `Int64` for auto-incrementing ids, so that's what we'll do. You'll notice that it's written as an optional — that's because an instance of the struct can exist before it's been written to the database for the first time and thus before it's been assigned its database `id`.

`name` isn't optional because we added the `notNull` constraint to it during the migration. The inverse is why `description` and `due` are both optional.

`isDraft` was specified during the "v2" migration. It too was assigned the `notNull` constraint, but importantly, it was also assigned a default value. After the first release of your app, you can't create a non-nullable column without a default value because any records created prior will not have assigned a value to the inexistent column.

#### Adopting GRDB's protocols

Next, `import GRDB` if you haven't already, then add the following below the Project struct:

```swift filename=Models/Project.swift
extension Project: Codable, FetchableRecord, MutablePersistableRecord { }
```

Adopting `FetchableRecord` tells GRDB that a `Project` can be initialized from a database row, and adopting `MutablePersistableRecord` tells GRDB that a `Project` can be inserted into, updated in, and deleted from the database. `Codable` is simply shorthand for `Decodable & Encodable`.

As we're working with such a simple model, we could stop here and reading and writing of the database would work just fine. There's one improvement we can make to writing though before we move onto reading.

Let's say we have the following:

```swift
do {
    try dbQueue.write { db in
        var project = Project(
            name: "Getting started with GRDB",
            description: "A blog post",
            due: Date().addingTimeInterval(24 * 60 * 60)
        )

        try! project.insert(db)

        print(project)
    }
} catch {
    print("\(error)")
}
```

At the moment it'll run just fine and the `Project` will be written to the database. However, `print` on line 11 will return something like this:

```
Project(id: nil, name: "Getting started with GRDB", description: Optional("A blog post"), due: Optional(2019-12-11 14:16:15 +0000), isDraft: true)
```

As you can see, the project's `id` is still `nil` even though the write succeeded. To get the `id`, you'd need to go back in and read from the database, which is far from ideal. Fortunately, we can tell GRDB to mutate the variable `insert` was called on once the insertion has completed.

Go back to your model and add the following to the extension:

```swift filename=Models/Project.swift highlight=3,4,5
extension Project: Codable, FetchableRecord, MutablePersistableRecord {

    mutating func didInsert(with rowID: Int64, for column: String?) {
        id = rowID
    }

}
```

Now, if you were to run the `write` snippet above, `print` would return the `id` without having to go back for an extra read:

```
Project(id: Optional(1), name: "Getting started with GRDB", description: Optional("A blog post"), due: Optional(2019-12-11 14:16:15 +0000), isDraft: true)
```

#### Querying the database

We've already seen an example of a write, but let's break it down quickly.

```swift
do {
    try dbQueue.write { db in
        var project = Project(
            name: "Getting started with GRDB",
            description: "A blog post",
            due: Date().addingTimeInterval(24 * 60 * 60)
        )

        try! project.insert(db)
    }
} catch {
    print("\(error)")
}
```

On line 2 you can see that `write` is called on the global `dbQueue` connection we made earlier. `write` synchronously executes the database updates; one of the nice things about it is that concurrent reads are guaranteed not to return any partial updates.

Line 9 is where the SQL `INSERT` is actually performed.

Time to do some reading. Go back to Project.swift and add another extension — this one will house our queries.

A simple query to, for example, only return `Project`s that are drafts would look like this:

```swift filename=Models/Project.swift
extension Project {

    static func drafts() -> QueryInterfaceRequest<Project> {
        return Project.filter(Column("isDraft") == true)
    }

}
```

Not bad, but the readability could be improved and the room for developer error could be lessened. Let's map the columns to an enum.

```swift filename=Models/Project.swift
extension Project {

    private enum Columns {
        static let id = Column(CodingKeys.id)
        static let name = Column(CodingKeys.name)
        static let description = Column(CodingKeys.description)
        static let due = Column(CodingKeys.due)
        static let isDraft = Column(CodingKeys.isDraft)
    }

    static func drafts() -> QueryInterfaceRequest<Project> {
        return Project.filter(Columns.isDraft == true)
    }

}
```

Much better. Here are some examples of how that query can now be used:

```swift
do {
    try dbQueue.read { db in
        let drafts = try Project.drafts().fetchAll(db)
        let oneDraft = try Project.drafts().fetchOne(db)
        let tenDrafts = try Project.drafts().limit(10).fetchAll(db)
        let draftsCount = try Project.drafts().fetchCount(db)
    }
} catch {
    print("\(error)")
}
```

You might want to order the results:

```swift filename=Models/Project.swift
extension Project {

    static func dueDrafts() -> QueryInterfaceRequest<Project> {
        return Project
            .filter(Columns.isDraft == true)
            .order(Columns.due)
    }

}
```

Or have multiple filters:

```swift filename=Models/Project.swift
extension Project {

    static func draftsDueSoon() -> QueryInterfaceRequest<Project> {
        return Project
            .filter(Columns.isDraft == true)
            .filter(Columns.due < Date().addingTimeInterval(24 * 60 * 60))
            .order(Columns.due)
    }

}
```

Or get a specific draft:

```swift filename=Models/Project.swift
extension Project {

    static func draft(withId id: Int64) -> QueryInterfaceRequest<Project> {
        return Project.filter(Columns.id == id)
    }

}
```

```swift
do {
    try dbQueue.read { db in
        let draft = try Project.draft(withId: 12).fetchOne(db)
    }
} catch {
    print("\(error)")
}
```

As it's specifically matching against the row id, the above could also be written as:

```swift
do {
    try dbQueue.read { db in
        let draft = try Project.fetchOne(db, key: 12)
    }
} catch {
    print("\(error)")
}
```

As you can see, GRDB's query interface makes database requests very approachable, even if you have no experience writing SQL.

---

### Until next time

GRDB is packed with features — far too many to go through in a single post and many of which don't belong in a "getting started" guide. I'll write about my favourite ones (including reacting to database changes and saving custom types) in a follow-up post next week, but even then, there'll still be things I won't have covered. Fortunately, GRDB has excellent [documentation](https://github.com/groue/GRDB.swift). I'd encourage you to check out.
