---
title: "SQLite and iOS: Advanced GRDB"
date: 2019-12-20
slug: "/2019/12/20/sqlite-ios-advanced-grdb"
category: Code
tags:
  - Swift
  - Database
excerpt: A follow-on from “Getting Started with GRDB” that covers value observation, table relationships, and custom types.
---

In part 1: ["Getting started with GRDB"](/2019/12/11/sqlite-ios-getting-started-with-grdb), we covered how to setup a local SQLite database for your iOS app, how to write migrations, how to adopt GRDB's protocols within a struct that can then be saved to the database, and lastly we went over some basic querying.

In part 2, we'll have a look at how to observe and react to changes in the database, how to define relationships between tables, and how to save a custom types.

---

### Defining associations

To show you how associations work in GRDB, we'll create a tasks table and setup a "has many" relationship between the project and task tables. Tasks, in turn, will have a "belongs to" relationship with projects.

```swift filename=DatabaseManager.swift highlight=21
class DatabaseManager {

    static var migrator: DatabaseMigrator {
        var migrator = DatabaseMigrator()

        migrator.eraseDatabaseOnSchemaChange = true

        migrator.registerMigration("createProject") { db in
            try db.create(table: "project") { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("name", .text).notNull()
                t.column("description", .text)
                t.column("due", .date)
                t.column("isDraft", .boolean).notNull().defaults(to: true)
            }
        }

        migrator.registerMigration("createTask") { db in
            try db.create(table: "task") { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("projectId", .integer).notNull().indexed().references("project", onDelete: .cascade)
                t.column("name", .text).notNull()
                t.column("isDone", .boolean).notNull().defaults(to: false)
            }
        }

        return migrator
    }

}
```

We went through what most of the above does in part 1; the interesting bit is line 21, where we create a column named `projectId`. The column is defined as an integer (because the primary key of the project table is an integer), then constrained to be `notNull` because we want SQLite to guarantee that all tasks have a project. `indexed` tells SQLite that we want the column to be indexed, which'll increase performance once we start querying for tasks that belong to a project (and thus matching against the value of this column). Lastly, `references` creates a foreign key constraint which tells SQLite that for each row in the tasks table, there exists a project it belongs to. `onDelete: .cascade` upholds that constraint by automatically deleting all tasks that belong a project when that project is deleted from the database.

Now that the required migrations have been done, create a `Task` struct for the newly created table (go back and reference part 1 if you're unsure how to do so). Once you've done that, we can move on to updating our `Project` struct.


```swift filename=Models/Project.swift highlight=1,13,14,15
extension Project: TableRecord, EncodableRecord {

    static let tasks = hasMany(Task.self)

    private enum Columns {
        static let id = Column(CodingKeys.id)
        static let name = Column(CodingKeys.name)
        static let description = Column(CodingKeys.description)
        static let due = Column(CodingKeys.due)
        static let isDraft = Column(CodingKeys.isDraft)
    }

    var tasks: QueryInterfaceRequest<Task> {
        return request(for: Project.tasks)
    }

    static func drafts() -> QueryInterfaceRequest<Project> {
        return Project.filter(Columns.isDraft == true)
    }

}
```

In the above snippet, the `extension` that housed our queries in part 1 has been updated. First, on line 1, `TableRecord` and `EncodableRecord` have been adopted, which gives us access to GRDB's `belongsTo` function. On line 3, that function is then used to tell GRDB of the foreign key.

Lines 13 through 15 provide us with a nice way to query all the tasks that belong to a project simply by doing:

```swift
let tasks = try project.tasks.fetchAll(db)
```

Similarly, we can update the `Task` struct to provide us with a way to fetch the project it belongs to:

```swift filename=Models/Project.swift
extension Task: TableRecord, EncodableRecord {

    static let project = belongsTo(Project.self)

    var project: QueryInterfaceRequest<Project> {
        return request(for: Task.project)
    }

}
```

To then fetch the parent project, all that's needed is:

```swift
let project = try task.project.fetchOne(db)
```

Note that filters can still be applied when querying a `hasMany` relationship.
The following, for example, is valid:

```swift
let doneTasks = try project
    .tasks
    .filter(Column("isDone") == true)
    .fetchAll(db)
```

---

### Observing and reacting to changes

GRDB leverages SQLite's data change notifications to provide us with an efficient `ValueObservation` tool that will, in turn, call either the `onChange` or `onError` callback it is passed.

For this example, we'll implement an observer into a simple `TaskListViewController` whose view we want to update as and when the tasks that belong to a certain project update.

To start, `import GRDB` and define an optional `TransactionObserver` property in your controller; this is where our observer will be kept in memory. `TransactionObserver` is the type returned when `start` is called on a `ValueObservation`.

```swift filename=TaskListViewController.swift
class TaskListViewController: UIViewController {

    private var tasksObserver: TransactionObserver?

}
```

`tasksObserver` now needs a value. We'll break its configuration out into its own function; remember to call `configureTasksObserver` in `viewDidLoad`, or wherever you're handling view setup.

```swift filename=TaskListViewController.swift highlight=12,13
class TaskListViewController: UIViewController {

    private func configureTasksObserver() {
        let project: Project = ...

        let observation = ValueObservation.tracking { db in
            try project.tasks.fetchAll(db)
        }

        tasksObserver = observation.start(
            in: dbQueue,
            onError: onTasksObserverError(_:),
            onChange: onTasksObserverChange(_:)
        )
    }

}
```

When `start` is first called on a `ValueObservation` type, the query in its definition will run once before any changes are made. This is nice because it means we don't have to duplicate the query elsewhere in our setup code to fetch the data required for the first initialization of the controller.

You can see that 2 callbacks are passed into `start` on lines 12 and 13. We still need to define those:

```swift filename=TaskListViewController.swift
class TaskListViewController: UIViewController {

    private func onTasksObserverChange(_ tasks: [Task]) {
        // Update your UI, etc...
    }

    private func onTasksObserverError(_ error: Error) {
        // Update your UI, etc...
    }

}
```

The only thing left to do is clean-up when the controller closes:

```swift filename=TaskListViewController.swift
class TaskListViewController: UIViewController {

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        tasksObserver = nil
    }

}
```

That's all there is to it; GRDB does a great job of making observation straightforward.

Tip: A frequest use case for database observation is keeping the data in a UICollectionView up to date. The [DeepDiff](https://github.com/onmyway133/DeepDiff) package makes a great accompaniment to what we've just covered if that's what you're implementing.

---

### Reading and writing custom data types

GRDB supports strings, integers, dates, booleans, and enums (that adopt `DatabaseValueConvertible`) out of the box. For this example, we'll contrive a requirement that projects can have a user-defined accent colour and banner image that must be modelled into a `ProjectBrand` struct.

```swift filename=DatabaseManager.swift highlight=15,16
class DatabaseManager {

    static var migrator: DatabaseMigrator {
        var migrator = DatabaseMigrator()

        migrator.eraseDatabaseOnSchemaChange = true

        migrator.registerMigration("createProject") { db in
            try db.create(table: "project") { t in
                t.autoIncrementedPrimaryKey("id")
                t.column("name", .text).notNull()
                t.column("description", .text)
                t.column("due", .date)
                t.column("isDraft", .boolean).notNull().defaults(to: true)
                t.column("accentColor", .text)
                t.column("bannerImage", .text)
            }
        }

        return migrator
    }

}
```

You can see on lines 15 and 16 that the two new fields still have to adhere to the basic types when they're in the database, and that they are stored in their own columns.

GRDB will come into play post-read, transforming the two fields into one `ProjectBrand`, and pre-write, splitting the `ProjectBrand` back down to two fields in preparation for SQLite. Let's implement that.

```swift filename=Models/Project.swift
struct Project {
    var id: Int64?
    var name: String
    var description: String?
    var due: Date?
    var isDraft: Bool
    var brand: ProjectBrand
}

struct ProjectBrand {
    var accentColor: String?
    var bannerImage: String?
}

extension Project: TableRecord, FetchableRecord, MutablePersistableRecord {

    enum Columns: String, ColumnExpression {
        case id, name, description, due, isDraft, accentColor, bannerImage
    }

    init(row: Row) {
        id = row[Columns.id]
        name = row[Columns.name]
        description = row[Columns.description]
        due = row[Columns.due]
        isDraft = row[Columns.isDraft]
        brand = ProjectBrand(
            accentColor: row[Columns.accentColor],
            bannerImage: row[Columns.bannerImage]
        )

        super.init(row: row)
    }

    func encode(to container: inout PersistenceContainer) {
        container[Columns.id] = id
        container[Columns.name] = name
        container[Columns.description] = description
        container[Columns.due] = due
        container[Columns.isDraft] = isDraft
        container[Columns.accentColor] = brand.accentColor
        container[Columns.bannerImage] = brand.bannerImage
    }

    mutating func didInsert(with rowID: Int64, for column: String?) {
        id = rowID
    }

}
```

You'll see on line 7 that instead of `accentColor` and `bannerImage` keys in the `Project` struct, we have a `brand` key of type `ProjectBrand`. Your struct should represent your data as you want to use it in your app, now how it is structured in the database.

The two main differences when compared to the `Project` struct we wrote in part 1 are the `init` and `encode` functions. The former is responsible for modelling a database row into a `Project` when the database is read; you can see that lines 27 through 30 transform the `accentColor` and `bannerImage` rows into a `ProjectBrand`. The latter is responsible for splitting the `Project` back down into database rows — lines 41 and 42 break down the `ProjectBrand`.

With all that in place, here's an example of what a `Project` could look like in your app:

```swift
try dbQueue.write { db in
    var projectBrand = ProjectBrand(
      accentColor: "#005eff",
      bannerImage: nil
    )

    var project = Project(
        name: "Advanced GRDB",
        description: "A blog post",
        due: Date().addingTimeInterval(24 * 60 * 60),
        isDraft: true,
        brand: projectBrand
    )

    try! project.insert(db)
}
```

You can see that we can now call `insert` directly on a `Project` type even though it has a key that uses a custom data type. As we're writing to the database in this case, the afore-defined `encode` function will run as part of the write process and breakdown the `ProjectBrand`. Similarly, we could read a `Project` and the `ProjectBrand` would be pre-assembled for us by the `init` function.

```swift
try dbQueue.read { db in
  let project = try Project.fetchOne(db, key: 1)
  print(project)

  // => Project(id: nil, name: "Advanced GRDB", description: Optional("A blog post"), due: Optional(2019-12-11 14:16:15 +0000), isDraft: true, brand: ProjectBrand(accentColor: "#005eff", bannerImage: nil))
}
```

---

### Wrapping up

I hope this 2 part series — the first series I've ever published on this site — has helped you get to grips with SQLite on iOS, and shown you its power and ease of use when paired with GRDB.

There's no comment section on here, but I cross-post to [dev.to](https://dev.to/elliotekj) which does have one. If you have any questions, feel free to ask there.

Thanks for reading.
