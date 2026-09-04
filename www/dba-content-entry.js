// =========================================================================
// Database Administration - Entry Level
// =========================================================================
// Examples throughout this course use PostgreSQL's own tools (psql, pg_dump,
// pg_basebackup) via the same kind of simulated terminal the Cloud Computing
// and APIs courses use - real syntax, realistic canned output, not a live
// database server. The database itself, when a schema is needed, is the
// same TaskFlow database (employees, orders, departments) used elsewhere in
// this platform.
// =========================================================================
const DBA_ENTRY_BASIC = [
  {
    title: "What does a database administrator actually do?",
    body: "Writing a query and administering the database that query runs against are genuinely different jobs, even though they both involve SQL. A database administrator (DBA) is responsible for the database as a system: making sure it's actually reachable and fast, that data survives hardware failure, that only the right people and applications can access it, and that it doesn't quietly run out of disk space at 2am. Where a data analyst asks 'what does this data say', a DBA asks a different set of questions entirely - is this database healthy right now, when did we last successfully back it up, and could we actually recover it if this server disappeared today. This course focuses on that second set of questions - the operational side of running a real database, not writing queries against one.",
    altExplain: "Writing queries and administering the database they run against are different jobs. A DBA keeps the database itself healthy, backed up, secure, and fast - not just answering questions with SQL.",
    visual: null,
    keyTakeaway: "A DBA's job is the database as a system - availability, backups, security, performance - not the queries running against it.",
    commonMistake: "Assuming strong SQL query-writing skills alone prepare someone for database administration - they're related but genuinely different skill sets, and a team often needs both.",
  },
  {
    title: "Users and roles",
    body: "A database doesn't just have one door - every application and person that connects to it does so as a specific database user, called a role in PostgreSQL specifically (some other database systems use the term 'user' and 'role' slightly differently, but the core idea is the same everywhere). Each role has its own credentials and its own set of permissions, separate from the operating system's own user accounts entirely. Creating a role with CREATE ROLE is the first step before that role can do anything at all - by default, a freshly created role can't log in, read any data, or run any commands until it's explicitly given permission to, which is a deliberate safety default, not an oversight.",
    altExplain: "A database role is a specific identity (with its own credentials and permissions) that a person or application connects as - separate from operating system accounts. A new role starts with no permissions at all by default.",
    visual: null,
    cli: {
      hint: "CREATE ROLE app_reader WITH LOGIN PASSWORD 'changeme123';",
      commands: {
        "create role app_reader with login password 'changeme123';": "CREATE ROLE",
      },
    },
    refBox: {
      syntax: "CREATE ROLE role_name WITH LOGIN PASSWORD 'password';",
      desc: "Creates a new database role that can log in - by default it has no permissions on anything yet.",
      example: "CREATE ROLE app_reader WITH LOGIN PASSWORD 'changeme123';",
    },
    keyTakeaway: "A freshly created role can log in (if given LOGIN) but can't read or write anything by default - permissions have to be explicitly granted, covered in the next lesson.",
    commonMistake: "Reusing one shared 'admin' role's credentials across every application and person that needs database access - if that one credential leaks, everything is compromised, and there's no way to tell which application or person actually did what.",
    challenge: {
      prompt: "Try creating the app_reader role using the command above.",
      hint: "Type the exact command shown, including the password in quotes.",
      solution: "CREATE ROLE app_reader WITH LOGIN PASSWORD 'changeme123';",
    },
  },
  {
    title: "Granting and revoking privileges",
    body: "GRANT gives a role a specific permission on a specific object - GRANT SELECT ON orders TO app_reader lets that role read the orders table, and nothing else, unless further grants are made. REVOKE takes a previously granted permission back. The core discipline here is the principle of least privilege: give a role only the specific permissions it actually needs to do its job, not broad access 'just in case' - a reporting tool that only ever reads data should never also be granted permission to delete rows, even if it would technically work fine either way, since the extra permission is pure unnecessary risk with no corresponding benefit. GRANT ALL exists and is tempting to reach for out of convenience, but it's almost always broader than what any single role genuinely needs.",
    altExplain: "GRANT gives a role a specific permission on a specific object; REVOKE takes it back. The principle of least privilege means giving only what's actually needed - never broad access 'just in case'.",
    visual: null,
    cli: {
      hint: "GRANT SELECT ON orders TO app_reader;",
      commands: {
        "grant select on orders to app_reader;": "GRANT",
      },
    },
    refBox: {
      syntax: "GRANT permission ON object TO role;   /   REVOKE permission ON object FROM role;",
      desc: "Grants or revokes a specific permission (SELECT, INSERT, UPDATE, DELETE, etc.) on a specific table or other object.",
      example: "GRANT SELECT, INSERT ON orders TO app_writer;",
    },
    keyTakeaway: "The principle of least privilege means granting exactly what a role needs and nothing more - not because it's stricter for its own sake, but because unused permissions are pure risk with zero benefit.",
    commonMistake: "Granting broad access (GRANT ALL) out of convenience during setup, planning to narrow it down later - that follow-up narrowing very often never actually happens once things are working.",
    challenge: {
      prompt: "Try granting SELECT on the orders table to app_reader using the command above.",
      hint: "Type the exact command shown.",
      solution: "GRANT SELECT ON orders TO app_reader;",
    },
  },
  {
    title: "Creating and dropping databases",
    body: "A single database server can host multiple separate databases, each with its own set of tables, isolated from the others - CREATE DATABASE taskflow_prod sets up a brand new, empty one. DROP DATABASE removes one entirely, along with everything in it, immediately and without a confirmation prompt in most tools - there's no 'are you sure' built into the command itself, and no undo once it's run. This makes DROP DATABASE one of the more genuinely dangerous commands a DBA has access to; the only real safety net is a recent backup, which is exactly why backups are covered in depth later in this course.",
    altExplain: "CREATE DATABASE sets up a new, empty database on the server. DROP DATABASE removes one entirely and immediately - no confirmation prompt, no undo. A recent backup is the only real safety net.",
    visual: null,
    cli: {
      hint: "CREATE DATABASE taskflow_staging;",
      commands: {
        "create database taskflow_staging;": "CREATE DATABASE",
      },
    },
    keyTakeaway: "DROP DATABASE has no built-in confirmation and no undo - a recent, tested backup is the only real protection against running it against the wrong target.",
    commonMistake: "Running a destructive command like DROP DATABASE while connected to a production server, having meant to run it against a local test database - always double-check which server a connection is actually pointed at first.",
    challenge: {
      prompt: "Try creating a new staging database using the command above.",
      hint: "Type the exact command shown.",
      solution: "CREATE DATABASE taskflow_staging;",
    },
  },
  {
    title: "Backups: why and how often",
    body: "A backup is a copy of the database's data, stored separately, so that hardware failure, a bad deployment, or human error deleting the wrong rows doesn't mean permanently losing everything. pg_dump captures a database's current contents to a file that can be restored later - a genuinely simple tool for a genuinely critical job. How often to back up depends entirely on how much data loss would actually be acceptable if the absolute worst happened right now: a database backed up once a day can lose up to a full day's worth of changes in a worst-case failure, which is fine for some systems and completely unacceptable for others. This tradeoff - how much data you could stand to lose - has a name, RTO/RPO, covered in more depth in this course's deep-dive module.",
    altExplain: "A backup is a separate copy of the data, so a failure or mistake doesn't mean losing everything. How often to back up depends on how much data loss would actually be acceptable in a worst case.",
    visual: null,
    cli: {
      hint: "pg_dump taskflow_prod > taskflow_backup.sql",
      commands: {
        "pg_dump taskflow_prod > taskflow_backup.sql": "pg_dump: dumping database \"taskflow_prod\"\npg_dump: dumping contents of table \"employees\"\npg_dump: dumping contents of table \"orders\"\npg_dump: dumping contents of table \"departments\"\n[backup written to taskflow_backup.sql, 2.4 MB]",
      },
    },
    refBox: {
      syntax: "pg_dump database_name > output_file.sql",
      desc: "Dumps a database's current contents to a file, which can later be restored - PostgreSQL's basic backup tool.",
      example: "pg_dump taskflow_prod > backup_2026_09_01.sql",
    },
    keyTakeaway: "How often to back up is really a question about how much data loss would be acceptable in a worst case - not a generic 'best practice' number that fits every system equally.",
    commonMistake: "Treating 'we take backups' as the finish line, without ever actually testing that a backup can be restored successfully - covered directly in a later lesson, since an unverified backup is really just an assumption.",
    challenge: {
      prompt: "Try backing up the taskflow_prod database using the command above.",
      hint: "Type the exact command shown, including the > redirect and filename.",
      solution: "pg_dump taskflow_prod > taskflow_backup.sql",
    },
  },
  {
    title: "Restoring from a backup",
    body: "A backup is only useful if it can actually be turned back into a working database - psql taskflow_prod < taskflow_backup.sql replays a pg_dump backup file's contents back into a database, recreating its tables and data. Restoring into a brand new, empty database (rather than directly on top of a production database that's still receiving traffic) is the safer default whenever the goal is testing that a backup genuinely works, or recovering into a fresh environment - restoring on top of a live database can conflict with data that's already there. This is also exactly the command a DBA reaches for after a real incident: create a new database, restore the most recent good backup into it, verify it, and only then decide how to bring it into production.",
    altExplain: "Restoring replays a backup file's contents back into a database. Restoring into a fresh, empty database (not directly on top of a live one) is the safer default, especially just to test that a backup actually works.",
    visual: null,
    cli: {
      hint: "psql taskflow_recovery < taskflow_backup.sql",
      commands: {
        "psql taskflow_recovery < taskflow_backup.sql": "SET\nSET\nCREATE TABLE\nCREATE TABLE\nCREATE TABLE\nCOPY 6\nCOPY 5\nCOPY 3\n[restore complete]",
      },
    },
    refBox: {
      syntax: "psql database_name < backup_file.sql",
      desc: "Restores a pg_dump backup file's contents into a database - typically a fresh, empty one when testing or recovering.",
      example: "psql taskflow_recovery < taskflow_backup.sql",
    },
    keyTakeaway: "A backup that's never been restored is really just an unverified assumption - the restore command itself is simple, but actually running it (even just to test) is the part that's easy to skip.",
    commonMistake: "Only testing backups by confirming the backup file exists and has a plausible size, rather than actually restoring it somewhere and checking the data is genuinely intact and complete.",
    challenge: {
      prompt: "Try restoring the backup into a fresh recovery database using the command above.",
      hint: "Type the exact command shown, including the < redirect.",
      solution: "psql taskflow_recovery < taskflow_backup.sql",
    },
  },
  {
    title: "Monitoring: is the database healthy?",
    body: "A DBA needs to know a database is struggling before users start complaining, not after - monitoring is what makes that possible. pg_stat_activity is a built-in view showing every current connection and what each one is doing right now, immediately useful for answering 'is something stuck or running unusually long' during an active incident. Beyond moment-to-moment queries like this, real monitoring tracks trends over time: connection count approaching a hard limit, disk space steadily filling up, query response times gradually creeping upward - the kind of slow-moving problem that's easy to miss in the moment but obvious in hindsight once it's already caused an outage. The goal is catching the trend early enough to act before it becomes an actual incident.",
    altExplain: "pg_stat_activity shows what's happening on the database right now - useful during an active incident. Real monitoring also tracks trends over time (disk filling up, connections rising) to catch problems before they become outages.",
    visual: null,
    cli: {
      hint: "SELECT pid, state, query FROM pg_stat_activity;",
      commands: {
        "select pid, state, query from pg_stat_activity;": " pid  | state  |              query\n------+--------+----------------------------------\n 4021 | active | SELECT * FROM orders WHERE ...\n 4033 | idle   | \n 4041 | active | UPDATE employees SET department...\n(3 rows)",
      },
    },
    keyTakeaway: "The most dangerous problems are usually the slow-moving ones - gradually filling disk, slowly rising query times - not the sudden ones, since gradual trends are easy to miss without deliberate monitoring.",
    commonMistake: "Only checking on the database's health reactively, after users start reporting something is slow or broken, rather than tracking trends proactively so the same problem gets caught and fixed earlier.",
    challenge: {
      prompt: "Try checking current database activity using the command above.",
      hint: "Type the exact command shown.",
      solution: "SELECT pid, state, query FROM pg_stat_activity;",
    },
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "CREATE ROLE name WITH LOGIN PASSWORD '...';", desc: "Creates a new database role - starts with zero permissions by default.", example: "CREATE ROLE app_reader WITH LOGIN PASSWORD '...';" },
      { syntax: "GRANT / REVOKE permission ON object TO/FROM role;", desc: "Gives or takes back a specific permission - grant only what's actually needed.", example: "GRANT SELECT ON orders TO app_reader;" },
      { syntax: "CREATE DATABASE / DROP DATABASE", desc: "Creates or permanently removes a whole database - DROP has no undo.", example: "CREATE DATABASE taskflow_staging;" },
      { syntax: "pg_dump db_name > file.sql", desc: "Backs up a database's contents to a file.", example: "pg_dump taskflow_prod > backup.sql" },
      { syntax: "psql db_name < file.sql", desc: "Restores a backup file's contents into a database.", example: "psql taskflow_recovery < backup.sql" },
      { syntax: "SELECT * FROM pg_stat_activity;", desc: "Shows current connections and what each is doing right now.", example: "Useful during an active incident" },
    ],
  },
];

// =========================================================================
// Database Administration - Entry Level - Intermediate track
// =========================================================================
const DBA_ENTRY_INTERMEDIATE = [
  {
    title: "Indexes: what they are and why they matter",
    body: "Without an index, finding rows matching a condition means scanning every single row in a table, checking each one - fine for a hundred rows, genuinely slow for ten million. An index is a separate structure the database maintains alongside a table, built on one or more columns, that lets it jump directly to matching rows instead of scanning everything - CREATE INDEX idx_orders_status ON orders(status) speeds up any query filtering on that column. This speed isn't free: every INSERT, UPDATE, or DELETE on that table now also has to update the index, so adding indexes is a genuine tradeoff between faster reads and slightly slower writes - not something to apply to every column reflexively.",
    altExplain: "Without an index, finding matching rows means scanning the whole table. An index lets the database jump straight to them instead - but every write now also has to update the index, so it's a real tradeoff, not a free speedup.",
    visual: null,
    cli: {
      hint: "CREATE INDEX idx_orders_status ON orders(status);",
      commands: {
        "create index idx_orders_status on orders(status);": "CREATE INDEX",
      },
    },
    refBox: {
      syntax: "CREATE INDEX index_name ON table(column);",
      desc: "Builds an index on a column, speeding up queries that filter or sort on it, at some cost to write speed.",
      example: "CREATE INDEX idx_orders_status ON orders(status);",
    },
    keyTakeaway: "An index trades faster reads for slightly slower writes - a genuinely good trade for columns queried often, a genuinely bad one for columns rarely searched on.",
    commonMistake: "Adding an index to every column 'just in case' it helps some future query - each one has a real, ongoing write cost, so indexes should be added deliberately, based on how the table is actually queried.",
    challenge: {
      prompt: "Try creating an index on the orders table's status column using the command above.",
      hint: "Type the exact command shown.",
      solution: "CREATE INDEX idx_orders_status ON orders(status);",
    },
  },
  {
    title: "Reading a query plan (EXPLAIN)",
    body: "EXPLAIN shows how the database actually intends to execute a given query - which tables it'll scan, whether it'll use an index or scan every row, and in what order it plans to join tables together - rather than just running the query and hoping it's fast. A plan showing 'Seq Scan' (sequential scan, checking every row) on a large table where an index exists and should apply is a strong signal something's off - maybe the index doesn't actually cover the columns being filtered on, or the query is written in a way that prevents the database from using it. Reading a query plan is the single most direct way to answer 'why is this specific query slow', rather than guessing at possible causes.",
    altExplain: "EXPLAIN shows exactly how the database plans to run a query - which scans, which indexes, in what order - rather than just running it and hoping. It's the direct way to answer 'why is this query slow', not a guess.",
    visual: null,
    cli: {
      hint: "EXPLAIN SELECT * FROM orders WHERE status = 'open';",
      commands: {
        "explain select * from orders where status = 'open';": "                          QUERY PLAN\n----------------------------------------------------------\n Index Scan using idx_orders_status on orders\n   Index Cond: (status = 'open'::text)\n   Estimated rows: 2",
      },
    },
    keyTakeaway: "Seeing 'Index Scan' in a plan for a large, selective query is generally what you want to see; 'Seq Scan' on a large table is worth investigating, not necessarily a guaranteed problem on its own.",
    commonMistake: "Guessing at why a query is slow (adding random indexes, rewriting the query blindly) instead of running EXPLAIN first to see exactly what the database is actually doing.",
    challenge: {
      prompt: "Try checking the query plan for filtering open orders using the command above.",
      hint: "Type the exact command shown.",
      solution: "EXPLAIN SELECT * FROM orders WHERE status = 'open';",
    },
  },
  {
    title: "Locks and blocking",
    body: "A lock prevents two operations from conflicting with each other on the same data at the same time - when one transaction is updating a row, the database holds a lock on it so a second transaction trying to update that same row has to wait, rather than the two writes corrupting each other. This waiting is normal and usually invisible, lasting milliseconds. Blocking becomes a real, visible problem when a transaction holds a lock far longer than expected - left open by a forgotten COMMIT, or stuck waiting on something else entirely - and every other transaction needing that same data queues up behind it, sometimes cascading into what looks like the whole database grinding to a halt, when really it's one long-held lock at the root of it.",
    altExplain: "A lock stops two operations from conflicting on the same data at once - normal and usually invisible. Blocking is when one transaction holds a lock far longer than expected, and everything else needing that data queues up behind it.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Several queries against the orders table have suddenly become very slow, all around the same time, with no recent change in traffic. What's a likely first thing to check?",
      options: ["Whether the internet connection is slow", "Whether a long-running transaction is holding a lock other queries are stuck waiting behind", "Whether the table needs more columns", "Whether the database needs to be restarted immediately"],
      correct: 1,
      explanation: "A sudden, simultaneous slowdown across multiple queries touching the same table is a classic sign of blocking - one transaction holding a lock longer than expected, with everything else queuing up behind it. Checking for long-running or stuck transactions is the natural first step, well before more drastic measures.",
    },
    keyTakeaway: "A sudden slowdown affecting many queries at once on the same table is a classic sign of blocking - one long-held lock, not necessarily many separate problems.",
    commonMistake: "Restarting the database as a first response to sudden widespread slowness, before checking whether a single long-held lock (fixable by ending just that one transaction) is actually the root cause.",
  },
  {
    title: "Connection limits and pooling",
    body: "Every application connecting to a database consumes a connection, and a database server can only hold open so many at once - a hard limit, not a soft guideline. A web application creating a brand new database connection for every single incoming request can exhaust that limit surprisingly quickly under real traffic, since establishing a connection has real overhead and holding many open at once adds up fast. Connection pooling solves this by maintaining a smaller set of already-open connections that get reused across many requests, rather than constantly opening and closing new ones - dramatically reducing how many connections are actually needed at once, and how much overhead each request pays.",
    altExplain: "A database can only hold so many open connections at once - a hard limit. Connection pooling reuses a smaller set of already-open connections across many requests, instead of opening a fresh one for every single request.",
    visual: null,
    cli: {
      hint: "SHOW max_connections;",
      commands: {
        "show max_connections;": " max_connections\n------------------\n 100\n(1 row)",
      },
    },
    keyTakeaway: "The connection limit is a hard ceiling, not a soft guideline - once it's hit, new connection attempts fail outright rather than queuing or degrading gracefully.",
    commonMistake: "Assuming a spike in traffic can be handled by just letting the application open more connections - past the server's connection limit, new connections are refused, not slowed down.",
    challenge: {
      prompt: "Try checking the server's current connection limit using the command above.",
      hint: "Type the exact command shown.",
      solution: "SHOW max_connections;",
    },
  },
  {
    title: "Disk space and storage growth",
    body: "A database that runs out of disk space doesn't degrade gracefully - it typically stops accepting writes entirely, which for most real applications means a full outage, not just slower performance. Tables grow over time as data accumulates, and so do indexes, write-ahead logs, and backup files sitting on the same disk - all of it competing for the same finite space. Tracking disk usage as a trend over time (not just a one-time check) is what turns 'the database is about to run out of space' from a surprise outage into a routine, scheduled task - adding storage, archiving old data, or cleaning up old backup files - well before it ever becomes urgent.",
    altExplain: "A database running out of disk space typically stops accepting writes entirely - a full outage, not just a slowdown. Tracking disk usage as a trend over time turns this into a routine task instead of a surprise.",
    visual: null,
    cli: {
      hint: "SELECT pg_size_pretty(pg_database_size('taskflow_prod'));",
      commands: {
        "select pg_size_pretty(pg_database_size('taskflow_prod'));": " pg_size_pretty\n----------------\n 2847 MB\n(1 row)",
      },
    },
    keyTakeaway: "A database running low on disk space fails hard (writes stop entirely), not gracefully - which is exactly why tracking usage as a trend, before it's urgent, matters so much more than for most other resources.",
    commonMistake: "Only discovering a disk space problem once writes actually start failing, rather than tracking storage growth as a routine trend that gets acted on well before it becomes an emergency.",
    challenge: {
      prompt: "Try checking the taskflow_prod database's current size using the command above.",
      hint: "Type the exact command shown.",
      solution: "SELECT pg_size_pretty(pg_database_size('taskflow_prod'));",
    },
  },
  {
    title: "Replication: keeping a copy in sync",
    body: "Replication keeps a second, continuously updated copy of a database on a separate server, automatically staying in sync with the original (called the primary) as changes happen. This serves two genuinely different purposes at once: if the primary server fails entirely, a replica can be promoted to take over, meaningfully reducing downtime compared to restoring from a backup from scratch; and read-heavy traffic (reports, dashboards) can be pointed at a replica instead of the primary, spreading out load without ever risking a slow report query competing with the application's actual writes. Replication is not a substitute for backups, even though both involve a second copy of the data - a mistake made on the primary (an accidental DELETE) replicates to the copy just as faithfully as any legitimate change does, which a backup, taken independently, can protect against.",
    altExplain: "Replication keeps a second, continuously synced copy of a database on another server - useful for failover if the primary goes down, and for spreading out read-heavy traffic. It's not a substitute for backups: a mistake on the primary replicates too.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A team has replication set up and believes it means they don't need separate backups anymore. What's the flaw in that reasoning?",
      options: ["Replication is slower than backups", "A mistake (like an accidental DELETE) on the primary replicates to the copy just as faithfully as any real change", "Replicas can't be read from", "There's no actual flaw - replication does replace the need for backups"],
      correct: 1,
      explanation: "Replication protects against hardware failure by keeping a synced copy, but it faithfully copies everything - including mistakes. An accidental DELETE on the primary shows up on the replica too. Backups, taken independently, are what protect against that specific kind of failure.",
    },
    keyTakeaway: "Replication and backups solve different problems - hardware failure and read-scaling versus recovering from a mistake or corruption - and a real setup generally needs both, not one instead of the other.",
    commonMistake: "Treating replication as a full substitute for backups since both involve 'another copy of the data' - a replica faithfully copies mistakes too, which is exactly the scenario backups are meant to protect against.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "CREATE INDEX name ON table(column);", desc: "Speeds up reads on that column, at some cost to write speed - a real tradeoff, not a free win.", example: "CREATE INDEX idx_orders_status ON orders(status);" },
      { syntax: "EXPLAIN query;", desc: "Shows exactly how the database plans to execute a query - the direct way to diagnose slowness.", example: "EXPLAIN SELECT * FROM orders WHERE status = 'open';" },
      { syntax: "Locks vs blocking", desc: "Locks are normal and brief; blocking is a lock held far longer than expected, queuing everything behind it.", example: "Check for long-running transactions first" },
      { syntax: "SHOW max_connections;", desc: "The server's hard connection limit - pooling reuses connections instead of opening new ones per request.", example: "SHOW max_connections;" },
      { syntax: "pg_size_pretty(pg_database_size(...))", desc: "Checks current database size - track this as a trend, not a one-time number.", example: "SELECT pg_size_pretty(pg_database_size('taskflow_prod'));" },
      { syntax: "Replication ≠ backups", desc: "Replication protects against hardware failure; backups protect against mistakes and corruption. Most real setups need both.", example: "A replica copies mistakes too" },
    ],
  },
];

// =========================================================================
// Deep-dive module: Backup & Recovery Strategy (Database Administration) -
// referenced by the isModuleStub entry at the top of DBA_ENTRY_ADVANCED below.
// =========================================================================
MODULES["dba-backup-recovery"] = {
  id: "dba-backup-recovery",
  title: "Backup & Recovery Strategy",
  icon: "server",
  accent: "#b23a2e",
  tagline: "Everything between \"we take backups\" and actually being able to recover, on purpose, under pressure.",
  whatYouLearn: [
    "Explain the difference between full, incremental, and differential backups",
    "Define RTO and RPO and use them to decide how often to back up",
    "Explain point-in-time recovery and what it protects against",
    "Apply the 3-2-1 backup rule",
    "Explain why testing a restore matters as much as taking the backup",
    "Spot the backup mistakes that quietly turn into unrecoverable data loss",
  ],
  lessons: [
    {
      title: "Why \"we have backups\" isn't enough",
      body: "A backup that exists is not the same thing as a backup that works - a corrupted backup file, one that was silently failing for weeks before anyone noticed, or one that simply can't be restored in any reasonable amount of time during a real incident, all technically count as 'having backups' while providing none of the actual protection the phrase implies. The real question a backup strategy needs to answer isn't 'do backups exist', it's 'if the absolute worst happened right now, could we actually get the data back, and how much would we lose, and how long would it take' - a genuinely different, more specific question. Every lesson in this module builds toward being able to answer that specific question with real confidence, not just a general sense that backups are 'handled'.",
      altExplain: "A backup existing isn't the same as a backup working - it could be corrupted, silently failing, or too slow to restore during a real incident. The real question is 'could we actually recover, and how much would we lose, and how fast' - not just 'do backups exist'.",
      visual: null,
      keyTakeaway: "The real test of a backup strategy is a specific question - could we recover right now, how much would we lose, how long would it take - not the vague, reassuring 'do we have backups'.",
      commonMistake: "Treating 'backups are configured and running' as the finish line of a backup strategy, rather than the starting point for actually answering whether a real recovery would work.",
    },
    {
      title: "Full, incremental, and differential backups",
      body: "A full backup captures the entire database's contents, every time - simple to restore from (just that one file), but the slowest to take and the most storage-hungry, especially for a large database backed up frequently. An incremental backup only captures what's changed since the last backup of any kind, whether that was full or itself incremental - fast and space-efficient to take, but restoring requires replaying the full backup plus every single incremental since, in exact order, which takes longer and has more that could go wrong. A differential backup is a middle ground: it captures everything changed since the last full backup specifically, so restoring only ever needs the full backup plus the single most recent differential - a smaller, simpler restore than a long incremental chain, at the cost of each differential growing larger over time until the next full backup resets it.",
      altExplain: "Full: everything, every time - simple to restore, slow to take. Incremental: only what changed since the last backup of any kind - fast to take, but restoring means replaying a whole chain in order. Differential: everything since the last full backup - a middle ground, simpler restore than incremental.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A team takes a full backup every Sunday and incremental backups every other day. Their database fails on a Saturday. What does restoring actually require?",
        options: ["Just Saturday's incremental backup", "The Sunday full backup plus every incremental from Monday through Saturday, replayed in order", "Only the most recent incremental, regardless of the others", "This scenario can't be recovered from"],
        correct: 1,
        explanation: "This is exactly the tradeoff incremental backups make: each one is fast and small on its own, but a full restore needs the entire chain - the original full backup, plus every incremental since, applied in the correct order. Missing or corrupting any single one in that chain breaks the whole restore.",
      },
      keyTakeaway: "An incremental chain is only as strong as its weakest link - losing or corrupting any single incremental in the sequence can break the ability to restore everything after it.",
      commonMistake: "Choosing incremental backups purely for their speed and storage savings, without accounting for how much longer and riskier the actual restore becomes as the chain grows longer between full backups.",
    },
    {
      title: "RTO and RPO: how much data and time can you afford to lose",
      body: "RPO (Recovery Point Objective) answers 'how much data can we afford to lose', measured in time - an RPO of 1 hour means backups need to happen at least that often, since a failure right before the next scheduled backup could lose up to that much. RTO (Recovery Time Objective) answers a different question - 'how long can we afford to be down while recovering' - and is shaped by how fast a restore can actually be performed, not just how the backup was taken. These two numbers, set deliberately based on what a specific system and its users can actually tolerate, are what should drive every other decision in this module - how often to back up, which backup type to use, whether replication is worth the added complexity - rather than picking a backup strategy first and hoping it happens to be good enough.",
      altExplain: "RPO: how much data you can afford to lose, in time (how far apart backups need to be). RTO: how long you can afford to be down while recovering. These two numbers should drive the backup strategy, not the other way around.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A system can tolerate losing at most 15 minutes of data in a worst-case failure. What does this directly imply about backup frequency?",
        options: ["Backups should happen once a day", "Backups (or continuous methods like write-ahead log shipping) need to happen at least every 15 minutes", "This has no bearing on backup frequency", "Backups should happen once a week"],
        correct: 1,
        explanation: "A 15-minute RPO means the maximum acceptable gap between backups is 15 minutes - a failure right before the next one would otherwise lose more data than the system can tolerate. This is exactly how RPO is meant to directly drive the backup schedule.",
      },
      keyTakeaway: "RPO and RTO should be decided first, based on what's actually tolerable for a given system - the backup strategy is what gets built to satisfy them, not the other way around.",
      commonMistake: "Picking a backup schedule based on convenience or habit (like 'once a night, that's standard') without first working out what RPO that schedule actually implies, and whether it's genuinely acceptable for this specific system.",
    },
    {
      title: "Point-in-time recovery",
      body: "A full or incremental backup restores a database to whatever moment that specific backup was taken - but real incidents often need something more precise, like 'restore to exactly 2:47pm, one minute before a bad deployment started deleting rows.' Point-in-time recovery makes this possible by combining a base backup with a continuous log of every change made since (PostgreSQL's write-ahead log, or WAL) - restoring the base backup, then replaying that log forward only up to the exact target moment, rather than either the last full backup or the current, already-corrupted state. This is precisely how a specific, well-understood mistake (a bad UPDATE with no WHERE clause, say) gets surgically undone without losing every other legitimate change that happened around the same time.",
      altExplain: "Point-in-time recovery restores to an exact moment (not just 'whenever the last backup was'), by combining a base backup with a continuous log of every change since, replayed forward only up to the target time.",
      visual: null,
      keyTakeaway: "Point-in-time recovery's real value is precision - restoring to the exact moment just before a specific mistake, not the blunter 'whenever the last backup happened to run'.",
      commonMistake: "Assuming a full or incremental backup alone can restore to any arbitrary moment - without a continuous change log (like WAL) in the mix, a backup can only restore to the specific moment it was actually taken.",
    },
    {
      title: "The 3-2-1 backup rule",
      body: "The 3-2-1 rule is a simple, memorable heuristic for backup resilience: keep at least 3 copies of the data (the original plus 2 backups), store them on at least 2 different types of storage media (not all on the same disk, or even the same server), and keep at least 1 copy somewhere physically offsite. Each part of this defends against a genuinely different failure: multiple copies protect against one backup being corrupted; different storage media protects against a failure mode affecting one entire type of storage at once; an offsite copy protects against something that takes out an entire physical location - a fire, a flood, a full building or region-wide outage - which a same-building backup, no matter how many copies exist, offers no protection against at all.",
      altExplain: "3-2-1: at least 3 copies of the data, on at least 2 different types of storage, with at least 1 copy offsite. Each part protects against a different failure - one bad backup, one storage type failing, or an entire physical location being lost.",
      visual: null,
      refBox: {
        syntax: "3 copies - 2 storage types - 1 offsite",
        desc: "A simple heuristic for backup resilience - each part defends against a different category of failure.",
        example: "Production DB + local backup disk + offsite cloud backup",
      },
      keyTakeaway: "Each part of 3-2-1 defends against a specific, different failure mode - it's not an arbitrary number, and skipping any one part leaves a genuine, specific gap.",
      commonMistake: "Keeping multiple backup copies that are all stored in the same physical location - satisfies the 'multiple copies' part in name only, since a single site-wide incident (fire, flood, regional outage) would still take out everything at once.",
    },
    {
      title: "Testing a restore (not just taking backups)",
      body: "The only way to genuinely know a backup works is to actually restore it somewhere and check the result - not check that the backup file exists, not check that it has a plausible file size, but actually run the restore and verify the data that comes back is complete and correct. A regular, scheduled restore test (monthly, say, restoring into an isolated test environment) catches problems - a corrupted file, a backup process that's been silently failing, a restore that takes far longer than the system's RTO actually allows - while there's still time to fix them, rather than discovering any of this for the first time during a real, live incident, when it's already far too late to do anything but hope.",
      altExplain: "The only way to really know a backup works is to actually restore it and check the data. A regular, scheduled test restore catches problems while there's still time to fix them - not during a real incident, when it's too late.",
      visual: null,
      keyTakeaway: "An untested backup is a genuine unknown, not a safety net - the only way to convert 'probably fine' into real confidence is to actually restore it and check.",
      commonMistake: "Considering a backup 'verified' because the backup process completed without an error message - a successful-looking backup process and a genuinely restorable, correct backup are not the same guarantee.",
    },
    {
      title: "Backup verification and corruption",
      body: "A backup file can become corrupted at any point after it's created - a storage failure, an interrupted transfer, bit rot sitting untouched on a disk for months - and a corrupted backup often looks completely fine right up until the moment someone actually tries to restore from it. Checksums (a computed value that changes if even a single byte of the file changes) let a corruption be detected automatically, by comparing a backup file's current checksum against the one recorded when it was first created, without needing a full test restore every single time to catch it. Combining routine checksum verification with periodic full test restores (the previous lesson) is what actually closes the gap between 'a backup exists' and 'a backup can genuinely be trusted.'",
      altExplain: "A backup can become corrupted after it's created, often without any obvious sign until someone tries to restore it. Checksums let corruption be detected automatically, without needing a full test restore every single time.",
      visual: null,
      keyTakeaway: "Corruption doesn't announce itself - a corrupted backup file generally looks completely normal until the exact moment someone actually tries to use it, which is why proactive checksum verification matters.",
      commonMistake: "Assuming a backup, once successfully created, will remain reliable indefinitely with no further checking - storage itself can degrade or fail silently over time, corrupting a file that was perfectly fine when it was first written.",
    },
    {
      title: "Retention policies",
      body: "Keeping every backup ever taken, forever, is rarely realistic or even genuinely useful - storage costs grow without bound, and a corruption or mistake that isn't discovered for months needs a backup from that far back to actually recover from, which an aggressive short-term-only retention policy would have already deleted. A retention policy defines how long different backups are kept: daily backups for the last week, weekly backups for the last month, monthly backups for the last year, say - balancing genuine recovery needs (how far back might a real mistake need to be found) against the real, ongoing cost of storing every single one indefinitely. Getting retention too short is a real, common way for a backup strategy to quietly fail months later, discovered only once the specific backup that was actually needed has already been deleted.",
      altExplain: "A retention policy decides how long different backups are kept (recent ones daily, older ones weekly or monthly), balancing how far back a real mistake might need to be found against the ongoing cost of storing everything forever.",
      visual: null,
      keyTakeaway: "Retention that's too short is a slow, quiet failure mode - it doesn't show up until the exact moment an old backup is actually needed and turns out to have already been deleted.",
      commonMistake: "Setting retention purely to minimize storage cost, without separately asking how far back a real, undiscovered mistake or slow corruption might realistically need to be traced.",
    },
    {
      title: "Common backup mistakes",
      body: "A recurring handful of mistakes account for most real backup failures. Backing up to the same server (or same disk) as the production database protects against nothing beyond accidental deletion of a table - any hardware failure or full-server incident takes out the backup right alongside the data it was meant to protect. Never actually testing a restore, covered earlier in this module, means a backup strategy's real reliability stays completely unknown until the worst possible moment to find out. Not monitoring whether backup jobs are actually succeeding lets a silent failure run for weeks or months, discovered only when a restore is actually needed and there's nothing usable to restore from. And treating backup and disaster recovery as pure IT/DBA concerns, entirely disconnected from the actual business impact of downtime or data loss, tends to produce a strategy whose RTO and RPO don't remotely match what the business genuinely needs.",
      altExplain: "The recurring mistakes: backing up to the same server as production, never testing a restore, not monitoring whether backup jobs are actually succeeding, and treating backup strategy as a pure technical concern disconnected from what the business actually needs.",
      visual: null,
      keyTakeaway: "Most real backup failures trace back to one of a small, repeat set of mistakes - the technical mechanics of taking a backup are the easy part; avoiding these surrounding mistakes is the harder, more important part.",
      commonMistake: "Focusing entirely on the technical correctness of the backup process itself (the right commands, the right schedule) while overlooking where backups are actually stored, whether they're monitored, and whether anyone has ever tested restoring one.",
    },
    {
      title: "Practice: designing a backup strategy for a scenario",
      body: "Designing a real backup strategy means working through this module's ideas together for one specific system, not applying a single generic template everywhere. A small internal tool used by one team, where losing a day of data would be a mild inconvenience, reasonably needs a much lighter strategy - daily full backups, a week of retention, tested restores done occasionally - than a payments system, where even a few minutes of data loss is unacceptable and demands a tight RPO, continuous log-based backup, and rigorously tested, frequent restores. Every earlier lesson in this module - RTO/RPO, backup type, 3-2-1, retention, testing - is a dial to set deliberately based on a specific system's actual stakes and tolerance for loss, not a fixed, one-size-fits-all checklist to apply identically everywhere.",
      altExplain: "A real backup strategy is designed for one specific system's actual stakes - a low-stakes internal tool and a payments system reasonably need very different RTO/RPO, backup frequency, and testing rigor, not the same generic template.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A payments system where even a few minutes of data loss is genuinely unacceptable is being designed. Which backup approach best fits that specific requirement?",
        options: ["Weekly full backups only, since payments data doesn't change that often", "A tight RPO using continuous write-ahead log shipping, with rigorously and frequently tested restores", "The same daily-backup approach used for a low-stakes internal tool, for consistency", "No backups needed if the system has replication"],
        correct: 1,
        explanation: "A near-zero acceptable data loss window specifically calls for continuous, log-based backup (enabling point-in-time recovery down to seconds) rather than periodic full backups alone, paired with restore testing rigorous enough to trust the RTO under real pressure - not a generic, one-size-fits-all schedule.",
      },
      keyTakeaway: "Designing a backup strategy is weighing this module's tools against one specific system's real stakes - not selecting a single default and applying it everywhere regardless of what's actually at risk.",
      commonMistake: "Applying the same backup strategy uniformly across every system a team manages, regardless of how differently acceptable data loss and downtime actually are between something low-stakes and something genuinely critical.",
    },
  ],
};

// =========================================================================
// Database Administration - Entry Level - Advanced track
// =========================================================================
const DBA_ENTRY_ADVANCED = [
  { isModuleStub: true, moduleId: "dba-backup-recovery" },
  {
    title: "High availability and failover",
    body: "High availability means a database stays reachable even when a single component fails - typically achieved by pairing a primary server with one or more replicas, ready to be promoted to take over automatically or with minimal manual effort if the primary goes down. Failover is that actual switch - the moment a replica becomes the new primary. A well-designed failover process is fast and mostly automatic; a poorly designed one requires someone to be paged at 3am to manually run a sequence of commands under pressure, which is exactly when mistakes are most likely to happen. The real measure of a high-availability setup isn't just 'does it exist', but how much downtime users would genuinely experience during a real failure, and whether that failover has ever actually been tested rather than just configured.",
    altExplain: "High availability pairs a primary database with replicas ready to take over if it fails. Failover is that actual switch. A well-designed failover is fast and mostly automatic - a poorly designed one needs manual intervention exactly when mistakes are most likely.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A team has a replica set up for high availability but has never actually simulated the primary failing. What's the real gap here?",
      options: ["There's no gap - having a replica is sufficient on its own", "The failover process itself (promoting the replica) has never been tested, so its actual speed and reliability during a real failure are unknown", "Replicas can't be promoted to primary at all", "This only matters for very large databases"],
      correct: 1,
      explanation: "Having a replica is necessary but not sufficient - the failover process itself (detecting the failure, promoting the replica, redirecting traffic) is what determines actual downtime during a real incident, and an untested process is just as much an unknown as an untested backup restore.",
    },
    keyTakeaway: "An untested failover process is exactly as much of an unknown as an untested backup restore - having the pieces in place isn't the same as knowing they'll actually work under real pressure.",
    commonMistake: "Considering high availability 'done' once a replica exists, without ever actually testing the failover process itself under conditions resembling a real failure.",
  },
  {
    title: "Database security hardening",
    body: "Beyond the basic user/role permissions covered earlier in this course, real database security involves several further layers. Network-level restrictions (only allowing connections from specific, known application servers, not the open internet) prevent an attacker from even attempting to connect in the first place. Encryption in transit (requiring SSL/TLS for every connection) stops credentials and data from being readable if network traffic is ever intercepted. Encryption at rest protects the actual data files on disk, in case physical storage is ever stolen or improperly accessed outside the database itself. Regularly auditing which roles have which permissions - not just when they're first granted, but on an ongoing basis - catches permissions that made sense once but were never revoked after they stopped being needed, a very common, quiet source of unnecessary risk.",
    altExplain: "Beyond user permissions: network-level restrictions (only known servers can connect), encryption in transit (SSL/TLS) and at rest, and regularly auditing existing permissions - not just when first granted - to catch access that's no longer actually needed.",
    visual: null,
    keyTakeaway: "Permissions naturally accumulate over time as roles change and projects end - a regular audit, not just careful granting up front, is what actually catches access that's outlived its original purpose.",
    commonMistake: "Treating security as something configured once during initial setup, rather than an ongoing practice - network rules, encryption, and especially permissions all need periodic review as a system and its team genuinely change over time.",
  },
  {
    title: "Capacity planning",
    body: "Capacity planning means looking at current trends - storage growth, connection counts, query volume - and projecting forward, so that scaling up happens on a deliberate, planned schedule rather than as a rushed, reactive emergency once a hard limit is actually hit. A database growing 10% a month, tracked and projected forward, gives a team real, concrete lead time to plan a storage upgrade or a more significant architectural change (like adding replicas, or partitioning a very large table) well in advance - as opposed to discovering the problem only once writes actually start failing due to a full disk. This connects directly back to the disk space and connection limit lessons earlier in this course: monitoring answers 'what's happening right now', while capacity planning specifically asks 'where is this heading, and when will it actually become a problem.'",
    altExplain: "Capacity planning projects current trends (storage growth, connections, query volume) forward, so scaling happens on a deliberate schedule instead of as a rushed emergency once a hard limit is actually hit.",
    visual: null,
    keyTakeaway: "Monitoring answers 'what's happening right now'; capacity planning specifically asks 'where is this heading, and when will it become a real problem' - a genuinely different, forward-looking question.",
    commonMistake: "Only reacting to resource limits once they're actually hit, rather than projecting current growth trends forward far enough to plan and execute a scaling response well ahead of an actual, forced deadline.",
  },
  {
    title: "Migrations without downtime",
    body: "A schema migration - adding a column, changing a data type, splitting a table - can lock a table while it runs, blocking every other query trying to use it for as long as the migration takes; on a small table this is instant and unnoticeable, but on a large, actively-used production table it can mean real, visible downtime. Zero-downtime migration techniques break a risky change into smaller, safer steps: adding a new column as nullable first (fast, no need to touch every existing row) rather than as required with a default value (which may need to rewrite the entire table); or running an old and new version of a schema side by side temporarily while application code and data both gradually transition over, rather than attempting one single, all-at-once cutover on a live, actively-used system.",
    altExplain: "A schema migration can lock a table, blocking queries for as long as it runs - unnoticeable on a small table, real downtime on a large one. Zero-downtime techniques break risky changes into smaller, safer steps instead of one all-at-once cutover.",
    visual: null,
    keyTakeaway: "The real risk in a migration is usually how long a table stays locked, not whether the change itself is correct - breaking a risky change into smaller steps directly targets that specific risk.",
    commonMistake: "Running a schema change that requires rewriting an entire large, actively-used table during normal business hours, without considering a safer, staged approach or at least scheduling it for genuinely low-traffic hours.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "High availability + failover", desc: "A replica ready to take over if the primary fails - only as good as its last actual failover test.", example: "Test the failover, not just the replica setup" },
      { syntax: "Network rules + encryption + audits", desc: "Security layers beyond basic permissions - and permissions need ongoing review, not just careful initial granting.", example: "SSL/TLS in transit, encryption at rest" },
      { syntax: "Capacity planning", desc: "Projects current trends forward to scale on a deliberate schedule, not a reactive emergency.", example: "10%/month growth leads to planning the next upgrade now" },
      { syntax: "Zero-downtime migrations", desc: "Breaks a risky schema change into smaller, safer steps instead of one all-at-once cutover.", example: "Add nullable first, backfill separately" },
    ],
  },
];

const DBA_QUIZ_BANK = {
  basic: [
    { q: "What does a freshly created database role have by default?", options: ["Full access to everything", "No permissions at all until explicitly granted", "Read-only access automatically", "The same access as the role that created it"], correct: 1 },
    { q: "What does the principle of least privilege recommend?", options: ["Granting broad access for convenience", "Granting only the specific permissions a role actually needs", "Never granting any permissions", "Sharing one admin credential across all applications"], correct: 1 },
    { q: "What happens when you run DROP DATABASE?", options: ["It asks for confirmation first", "It moves the database to a recycle bin", "It removes the database immediately, with no built-in undo", "It only removes empty databases"], correct: 2 },
    { q: "What determines how often a database should be backed up?", options: ["A fixed industry standard that applies to every system", "How much data loss would actually be acceptable in a worst case", "The size of the database only", "Whatever is most convenient to schedule"], correct: 1 },
    { q: "Why is testing a restore important?", options: ["It isn't, taking the backup is enough", "It's the only way to actually confirm a backup can be recovered from, not just that it exists", "It makes backups take less storage", "It's only needed for very large databases"], correct: 1 },
  ],
  intermediate: [
    { q: "What's the tradeoff when adding an index?", options: ["No tradeoff, indexes are always beneficial", "Faster reads on that column, at the cost of slightly slower writes", "Slower reads, faster writes", "Indexes only affect storage, not speed"], correct: 1 },
    { q: "What does EXPLAIN show?", options: ["The database's current disk usage", "How the database actually plans to execute a given query", "A list of all users", "The database's version number"], correct: 1 },
    { q: "What's the difference between a lock and blocking?", options: ["They're the same thing", "Locks are normal and brief; blocking is a lock held far longer than expected, queuing everything behind it", "Blocking only happens during backups", "Locks only apply to read operations"], correct: 1 },
    { q: "What does connection pooling solve?", options: ["Disk space issues", "Exhausting the database's connection limit by reusing connections instead of opening a new one per request", "Query performance issues unrelated to connections", "Backup scheduling"], correct: 1 },
    { q: "Why isn't replication a substitute for backups?", options: ["Replication is always slower", "A mistake or accidental deletion on the primary replicates to the copy just as faithfully as any legitimate change", "Replicas can't be read from", "It actually is a full substitute"], correct: 1 },
  ],
  advanced: [
    { q: "What's the key difference between incremental and differential backups?", options: ["They're identical", "Incremental captures changes since the last backup of any kind (forming a chain); differential captures changes since the last full backup only", "Differential is always faster to take", "Incremental backups can't be restored"], correct: 1 },
    { q: "What does RPO measure?", options: ["How long a system can be down", "How much data (in time) can be afforded to lose in a worst case", "The size of the database", "How many backups exist"], correct: 1 },
    { q: "What does the 3-2-1 backup rule recommend?", options: ["3 servers, 2 databases, 1 admin", "At least 3 copies of data, on 2 different storage types, with 1 copy offsite", "3 backups per day", "1 backup is always enough"], correct: 1 },
    { q: "What's the real measure of a high-availability setup?", options: ["Whether a replica exists", "How much actual downtime users would experience during a real failure, and whether failover has been tested", "The number of servers involved", "How much it costs"], correct: 1 },
    { q: "Why do zero-downtime migration techniques break changes into smaller steps?", options: ["To make the migration take longer on purpose", "To avoid long table locks that would otherwise cause real, visible downtime on a large, active table", "Smaller steps are always more correct", "This only matters for small tables"], correct: 1 },
  ],
};

// Wire this course into the shared registry (COURSE_CONTENT is declared in
// data.js, loaded before this file - we're adding to it, not replacing it).
// Professional and Master levels use emptyLevel() for now - the UI shows
// them as "coming soon" until lessons are added, same pattern the API
// course used while it was still being built out.
COURSE_CONTENT.dba = {
  entry: {
    basic: DBA_ENTRY_BASIC,
    intermediate: DBA_ENTRY_INTERMEDIATE,
    advanced: DBA_ENTRY_ADVANCED,
    quiz: DBA_QUIZ_BANK,
  },
  professional: emptyLevel(),
  master: emptyLevel(),
};
