// =========================================================================
// Database Administration - Professional Level
// =========================================================================
const DBA_PRO_BASIC = [
  {
    title: "Vacuuming and table bloat",
    body: "PostgreSQL doesn't immediately reclaim space when a row is updated or deleted - it marks the old version as dead and leaves it in place, since another transaction might still need to see it under PostgreSQL's concurrency model. VACUUM is the process that goes back and reclaims that dead space, making it available for new rows again. Without regular vacuuming, a table with heavy update or delete traffic accumulates bloat - dead rows piling up, quietly making the table (and every index on it) larger and slower to scan than its actual live data would justify. PostgreSQL runs an autovacuum process automatically by default, but a table with unusually heavy write traffic can still outpace it, which is exactly why bloat is worth checking on directly rather than assuming autovacuum alone always keeps up.",
    altExplain: "Updates and deletes leave dead row versions behind instead of immediately reclaiming space. VACUUM reclaims it. Without enough vacuuming, dead rows pile up as bloat, making a table and its indexes larger and slower than the live data alone would justify.",
    visual: null,
    cli: {
      hint: "SELECT relname, n_dead_tup FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 5;",
      commands: {
        "select relname, n_dead_tup from pg_stat_user_tables order by n_dead_tup desc limit 5;": "  relname  | n_dead_tup\n-----------+------------\n orders    |      18420\n employees |        340\n(2 rows)",
      },
    },
    keyTakeaway: "Autovacuum handles most tables automatically, but a table with heavy write traffic can outpace it - checking dead tuple counts directly is how you'd actually notice before it becomes a performance problem.",
    commonMistake: "Assuming autovacuum alone is always sufficient without ever checking - a heavily-written table can accumulate bloat faster than the default autovacuum settings account for.",
    challenge: {
      prompt: "Try checking which tables have the most dead rows using the command above.",
      hint: "Type the exact command shown.",
      solution: "SELECT relname, n_dead_tup FROM pg_stat_user_tables ORDER BY n_dead_tup DESC LIMIT 5;",
    },
  },
  {
    title: "Partitioning large tables",
    body: "A single table with hundreds of millions of rows becomes slow to query, slow to vacuum, and slow to back up, even with good indexing - partitioning splits it into smaller physical pieces (partitions) that are queried and maintained as one logical table, while PostgreSQL transparently only touches the specific partitions a query actually needs. Partitioning by range on a date column is a very common pattern for time-series-like data (orders, events, logs) - a query filtered to last month's orders only scans that one month's partition, not the entire table's history, and an old partition that's no longer needed can be dropped instantly, without the slow row-by-row DELETE a non-partitioned table would require for the same cleanup.",
    altExplain: "Partitioning splits a huge table into smaller physical pieces, queried as one logical table - PostgreSQL only touches the specific partitions a query actually needs. Range partitioning by date is common for time-series data like orders or logs.",
    visual: null,
    cli: {
      hint: "CREATE TABLE orders_2026_09 PARTITION OF orders FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');",
      commands: {
        "create table orders_2026_09 partition of orders for values from ('2026-09-01') to ('2026-10-01');": "CREATE TABLE",
      },
    },
    keyTakeaway: "Partitioning's real value is that a query only touches the specific partitions it needs, and an old partition can be dropped instantly - both meaningfully faster than the equivalent operation on one giant unpartitioned table.",
    commonMistake: "Partitioning a table that's never actually queried by the partition key (like date) - if queries don't naturally filter on that column, PostgreSQL can't skip irrelevant partitions, and most of partitioning's benefit is lost.",
    challenge: {
      prompt: "Try creating a September 2026 partition for the orders table using the command above.",
      hint: "Type the exact command shown.",
      solution: "CREATE TABLE orders_2026_09 PARTITION OF orders FOR VALUES FROM ('2026-09-01') TO ('2026-10-01');",
    },
  },
  {
    title: "Read replicas vs read-write splitting in application code",
    body: "Having a read replica (covered at a basic level earlier in this course) only helps if application code actually sends read-only queries to it - this doesn't happen automatically just because a replica exists. Read-write splitting means the application itself is written to route SELECT queries to a replica connection while routing INSERT, UPDATE, and DELETE to the primary - sometimes handled explicitly in application code, sometimes by a connection-routing proxy sitting in front of both. The genuine complication is replication lag: a replica is very slightly behind the primary, so a write followed immediately by a read of that same data (checking a record right after creating it) can hit a replica that hasn't caught up yet and return stale or missing results - a real design consideration, not just a wiring exercise.",
    altExplain: "A replica only helps if the application actually sends read queries to it - read-write splitting routes reads to a replica and writes to the primary. Replication lag means a read right after a write can hit a replica that hasn't caught up yet.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An application creates a new order, then immediately re-reads it to show a confirmation page, routing that read to a replica. What's the real risk here?",
      options: ["No risk, replicas are always instantly in sync", "Replication lag could mean the replica hasn't received the new order yet, showing a broken or empty confirmation page", "This risk only applies to updates, not new rows", "Replicas can't be read from at all"], correct: 1,
      explanation: "This is exactly the replication lag problem - a replica is very slightly behind the primary, so a read immediately following a write can land on a replica that hasn't caught up yet. A common fix is routing that specific kind of read (right after its own write) back to the primary instead.",
    },
    keyTakeaway: "Read-write splitting isn't automatic just because a replica exists - it requires deliberate application logic, and replication lag is a real design consideration, not an edge case to ignore.",
    commonMistake: "Assuming a read immediately following a write will always see that write's data on a replica - replication lag, even at milliseconds, can genuinely cause this to fail in exactly this scenario.",
  },
  {
    title: "Query timeouts and statement_timeout",
    body: "A single runaway query - a missing WHERE clause, an unexpectedly expensive join - can consume resources indefinitely if nothing stops it, potentially degrading the whole database for every other query running alongside it. statement_timeout sets a hard limit on how long any single query is allowed to run before PostgreSQL automatically cancels it, protecting the system from exactly this scenario. Setting this too aggressively cancels legitimate long-running queries (a large reporting job, a bulk data migration) that genuinely need more time; setting it too loosely defeats the protection it's meant to provide. A common practical pattern is a lower default timeout for regular application connections, with specific exceptions or a separate, more permissive connection for genuinely long-running administrative or reporting work.",
    altExplain: "statement_timeout caps how long any single query can run before PostgreSQL cancels it automatically - protects against one runaway query degrading everything else. Too aggressive cancels legitimate long queries; too loose defeats the protection.",
    visual: null,
    cli: {
      hint: "SET statement_timeout = '30s';",
      commands: {
        "set statement_timeout = '30s';": "SET",
      },
    },
    keyTakeaway: "statement_timeout is a genuine tradeoff to tune deliberately - a lower default for regular application traffic, with a separate exception path for work that legitimately needs more time.",
    commonMistake: "Setting one single statement_timeout value globally for every connection and every kind of work, rather than distinguishing between regular application queries and genuinely long-running administrative work that needs a different limit.",
    challenge: {
      prompt: "Try setting a 30-second statement timeout for the current session using the command above.",
      hint: "Type the exact command shown.",
      solution: "SET statement_timeout = '30s';",
    },
  },
  {
    title: "Connection pooling tools",
    body: "The connection pooling concept covered at a basic level earlier in this course is usually implemented in practice with a dedicated pooling tool - PgBouncer is the standard one for PostgreSQL - sitting between the application and the database, maintaining a smaller set of real database connections and handing them out to application requests as needed, rather than the application connecting directly to PostgreSQL itself. This matters at real scale because PostgreSQL's own per-connection overhead (each one holds real memory and process resources) makes it genuinely expensive to allow thousands of direct application connections, even if the database's own connection limit could technically permit it - a pooler lets far more application instances be served from a much smaller number of actual underlying database connections.",
    altExplain: "PgBouncer (the standard PostgreSQL pooling tool) sits between the application and the database, maintaining a small set of real connections and handing them out as needed - rather than the application connecting directly, which gets expensive at real scale.",
    visual: null,
    keyTakeaway: "A pooling tool lets far more application instances be served from a much smaller number of actual database connections, since each real connection carries genuine memory and process overhead on the database server itself.",
    commonMistake: "Scaling an application to many instances, each connecting directly to the database, without a pooling layer in front - the database's per-connection overhead can become the actual bottleneck well before query performance does.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "VACUUM / autovacuum", desc: "Reclaims dead row space - autovacuum runs automatically but can be outpaced on heavy-write tables.", example: "SELECT relname, n_dead_tup FROM pg_stat_user_tables ..." },
      { syntax: "CREATE TABLE ... PARTITION OF ...", desc: "Splits a huge table into smaller physical pieces, queried as one logical table.", example: "PARTITION OF orders FOR VALUES FROM (...) TO (...)" },
      { syntax: "Read-write splitting", desc: "Routes reads to a replica, writes to the primary - requires deliberate app logic, watch for replication lag.", example: "A read right after a write can hit a lagging replica" },
      { syntax: "SET statement_timeout = '...';", desc: "Caps how long a single query can run before being auto-cancelled.", example: "SET statement_timeout = '30s';" },
      { syntax: "PgBouncer / connection pooling", desc: "Maintains a small set of real connections, handed out to the application - avoids per-connection overhead at scale.", example: "Thousands of app instances via a small connection pool" },
    ],
  },
];

const DBA_PRO_INTERMEDIATE = [
  {
    title: "Analyzing slow query logs",
    body: "PostgreSQL can log every query that takes longer than a configured threshold (log_min_duration_statement), producing a slow query log that's often the single most direct source of real performance problems in a production database - rather than guessing which queries might be slow, the log shows exactly which ones actually were, how often, and how long each took. Tools like pg_stat_statements go further, aggregating this into a running summary - total time spent, average time, call count per distinct query pattern - making it possible to spot the query that's individually fast but runs constantly and accounts for more total database time than a single dramatically slow query that only runs once a day.",
    altExplain: "A slow query log shows exactly which queries actually ran slowly in production, rather than guessing. pg_stat_statements aggregates this further - total time, average time, call count - so a fast-but-frequent query's real total impact becomes visible too.",
    visual: null,
    cli: {
      hint: "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5;",
      commands: {
        "select query, calls, mean_exec_time from pg_stat_statements order by mean_exec_time desc limit 5;": "                query                 | calls | mean_exec_time\n---------------------------------------+-------+----------------\n SELECT * FROM orders WHERE employee...|  8420 |          142.3\n UPDATE employees SET department...    |    12 |           89.1\n(2 rows)",
      },
    },
    keyTakeaway: "A query that's individually fast but runs extremely often can account for more total database time than a dramatically slow query that only runs occasionally - aggregated stats reveal this, a raw slow-query log alone might not.",
    commonMistake: "Only chasing the single slowest individual query in a log, without checking aggregated call counts - a frequent, moderately-slow query can be a bigger real problem than a rare, very slow one.",
    challenge: {
      prompt: "Try checking the slowest queries by average execution time using the command above.",
      hint: "Type the exact command shown.",
      solution: "SELECT query, calls, mean_exec_time FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 5;",
    },
  },
  {
    title: "Autovacuum tuning",
    body: "Autovacuum's default settings are reasonable for a typical, moderately-active table, but a table with unusually heavy write traffic often needs more aggressive settings than the database-wide default provides. autovacuum_vacuum_scale_factor controls what fraction of a table's rows need to be dead before autovacuum triggers on it - the default (commonly 20%) means a huge table needs a huge number of dead rows to trigger a vacuum, which can be far too infrequent for a table that's written to constantly. These settings can be tuned per-table, not just globally, letting a handful of genuinely high-traffic tables get more aggressive, more frequent vacuuming without changing the default behavior for every other, lower-traffic table in the database.",
    altExplain: "Autovacuum's default trigger threshold (a percentage of dead rows) can be far too infrequent for a huge, heavily-written table. Settings can be tuned per-table, not just globally, so specific high-traffic tables get more aggressive vacuuming without changing the default everywhere.",
    visual: null,
    cli: {
      hint: "ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.05);",
      commands: {
        "alter table orders set (autovacuum_vacuum_scale_factor = 0.05);": "ALTER TABLE",
      },
    },
    keyTakeaway: "Autovacuum tuning is most effective applied per-table to the specific tables that actually need it, rather than changing the global default and affecting every table's vacuum behavior at once.",
    commonMistake: "Tuning autovacuum globally to be more aggressive because one or two tables need it, adding unnecessary vacuum overhead to every other table in the database that didn't actually need the change.",
    challenge: {
      prompt: "Try setting a more aggressive autovacuum threshold specifically on the orders table using the command above.",
      hint: "Type the exact command shown.",
      solution: "ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.05);",
    },
  },
  {
    title: "Table and index bloat cleanup",
    body: "Regular VACUUM reclaims dead space for reuse within a table, but doesn't actually shrink the table's file size on disk - the space stays allocated to that table for future use rather than being returned to the operating system. VACUUM FULL does return space to the disk, but it works by rewriting the entire table into a new file and requires an exclusive lock for the whole operation, meaning nothing else can read or write that table until it finishes - completely impractical to run on a large, actively-used production table during normal hours. REINDEX rebuilds a bloated index from scratch, similarly locking, but tools like pg_repack exist specifically to perform the equivalent of VACUUM FULL and REINDEX without that exclusive lock, at the cost of needing extra temporary disk space and more complexity to run.",
    altExplain: "Regular VACUUM reclaims space for reuse but doesn't shrink the file on disk. VACUUM FULL does, but needs a full exclusive lock - impractical on a large active table. Tools like pg_repack achieve the same result without that lock, at the cost of extra complexity.",
    visual: null,
    keyTakeaway: "VACUUM FULL's exclusive lock is the real reason it's rarely usable directly on a large, actively-used production table - the disk space it reclaims comes at the cost of unavailability for the whole operation.",
    commonMistake: "Running VACUUM FULL directly on a large, actively-used production table during normal hours, not accounting for the exclusive lock making that table completely unavailable for the entire duration.",
  },
  {
    title: "Deadlocks: detection and prevention",
    body: "A deadlock happens when two transactions each hold a lock the other one needs, and each is waiting for the other to release it first - neither can ever proceed, since both are waiting on each other simultaneously. PostgreSQL detects this situation automatically and resolves it by picking one of the two transactions to fail with an error, letting the other proceed - the database can't tell which transaction is more important, only that the deadlock itself must be broken somehow. Deadlocks are most commonly prevented by having every part of an application consistently update or lock multiple rows in the same order every time - if every transaction always locks row A before row B, two transactions can never end up each holding one and waiting on the other simultaneously.",
    altExplain: "A deadlock is two transactions each holding a lock the other needs, both waiting on each other forever. PostgreSQL detects this and fails one of them automatically. Prevention usually means always locking multiple rows in a consistent order everywhere in the application.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Two different parts of an application sometimes update both an order row and an employee row together, but in inconsistent order - one part updates the order first then the employee, another does employee first then order. What risk does this create?",
      options: ["No risk, order doesn't matter for updates", "A deadlock: two transactions could each hold one row's lock while waiting for the other's, with neither able to proceed", "This only matters for read queries, not updates", "This risk only exists with more than two tables involved"], correct: 1,
      explanation: "Inconsistent lock ordering across an application is exactly the classic setup for a deadlock - if transaction A locks order-then-employee while transaction B locks employee-then-order, they can each end up holding one lock and waiting on the other, with PostgreSQL eventually having to fail one of them to break the standoff.",
    },
    keyTakeaway: "Deadlock prevention is mostly a discipline problem across an entire application's codebase - consistent lock ordering everywhere - not something a database setting alone can fully solve.",
    commonMistake: "Treating an occasional deadlock error as a database bug to work around case by case, rather than fixing the underlying inconsistent lock ordering across the application that's actually causing it.",
  },
  {
    title: "Backup automation and scheduling",
    body: "Manually running pg_dump when someone remembers to is not a real backup strategy - production backups need to run automatically, on a defined schedule, with the result (success, failure, how long it took) actually monitored and alerted on, not just assumed to be working. A typical setup uses a scheduler (cron, or a managed cloud provider's built-in backup scheduling) to trigger backups at a defined interval, writes them to a separate storage location (satisfying the 3-2-1 rule covered in this course's backup module), and sends an alert specifically when a scheduled backup fails to complete, rather than only when someone happens to notice. The goal is a backup process nobody has to remember to run manually, and a failure that gets noticed within minutes, not discovered weeks later during an actual recovery attempt.",
    altExplain: "Production backups need to run automatically on a schedule, with success/failure actually monitored and alerted on - not manually triggered when someone remembers, and not assumed to be working without checking.",
    visual: null,
    keyTakeaway: "The real goal of backup automation is a failure that gets noticed within minutes of happening, not one discovered weeks later during an actual recovery attempt when it's already too late to fix.",
    commonMistake: "Automating the backup schedule itself but never adding monitoring or alerting for failures - an automated backup that silently fails for weeks is barely better than no backup automation at all.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "pg_stat_statements", desc: "Aggregates query stats - reveals a frequent-but-fast query's real total impact, not just the single slowest one.", example: "ORDER BY mean_exec_time or calls" },
      { syntax: "Per-table autovacuum tuning", desc: "Tune aggressive settings on specific high-traffic tables, not the global default.", example: "ALTER TABLE orders SET (autovacuum_vacuum_scale_factor = 0.05);" },
      { syntax: "VACUUM FULL / REINDEX / pg_repack", desc: "Reclaim disk space or rebuild indexes - the first two need an exclusive lock, pg_repack avoids it at the cost of complexity.", example: "pg_repack for large active tables" },
      { syntax: "Deadlocks", desc: "Two transactions waiting on each other's locks - prevented by consistent lock ordering across the whole application.", example: "Always lock row A before row B, everywhere" },
      { syntax: "Automated + monitored backups", desc: "Backups need to run on a schedule automatically, with failures actually alerted on.", example: "A silent failure is barely better than no backup" },
    ],
  },
];

const DBA_PRO_ADVANCED = [
  {
    title: "Sharding: splitting data across multiple databases",
    body: "Partitioning, covered earlier in this level, splits one table across multiple physical pieces within a single database server. Sharding goes further, splitting data across entirely separate database servers - each shard holds a distinct subset of the data (customers A through M on one server, N through Z on another, say), and the application needs its own logic to know which shard holds a given piece of data before it can query it. This solves a genuine scaling problem partitioning alone can't - a single server's total capacity, no matter how well-partitioned its tables are - but at real, significant cost: cross-shard queries (joining data that lives on different shards) become dramatically harder, and rebalancing data across shards as growth becomes uneven is a genuinely difficult, ongoing operational challenge.",
    altExplain: "Sharding splits data across entirely separate database servers (not just physical pieces within one server, like partitioning). It solves a scaling problem partitioning alone can't, but cross-shard queries and rebalancing become genuinely hard operational challenges.",
    visual: null,
    keyTakeaway: "Sharding solves a real scaling limit partitioning can't - one server's total capacity - but at the real cost of much harder cross-shard queries and rebalancing, which is exactly why it's reached for only once other options are genuinely exhausted.",
    commonMistake: "Reaching for sharding as an early scaling solution before genuinely exhausting simpler options (indexing, partitioning, read replicas, caching) - sharding's operational complexity is substantial enough that it's usually a last resort, not a first one.",
  },
  {
    title: "Multi-region database architecture",
    body: "A database serving users across multiple geographic regions faces a real tradeoff: keeping all data in one region means users far away experience real added latency on every query, while replicating data across multiple regions for lower latency everywhere introduces the genuine complexity of keeping those geographically distant copies consistent with each other. Some systems solve this by keeping a single-region primary (the source of truth) with read replicas in other regions - low-latency reads everywhere, at the cost of writes always needing to reach the single primary region regardless of where the request came from. True multi-region writes (accepting writes in multiple regions simultaneously) solve the write-latency problem too, but bring in real distributed-systems complexity around conflict resolution when the same data gets modified in two regions at nearly the same moment.",
    altExplain: "Multi-region databases trade off latency against consistency complexity. A single-region primary with regional read replicas gives fast reads everywhere but writes still go to one region. True multi-region writes solve that too, but introduce real conflict-resolution complexity.",
    visual: null,
    keyTakeaway: "Single-region-primary-with-regional-replicas is a meaningfully simpler starting point than true multi-region writes - it solves read latency cleanly while sidestepping the genuine conflict-resolution complexity multi-region writes introduce.",
    commonMistake: "Reaching for full multi-region write architecture by default for global latency, without first considering whether a simpler single-primary-with-regional-replicas setup would satisfy the actual requirement (which is very often read-heavy).",
  },
  {
    title: "Database as code: schema migrations in CI/CD",
    body: "Manually running schema changes by hand against production is error-prone and leaves no reliable record of exactly what changed, when, or why. Treating schema migrations as code - version-controlled migration files, each describing one specific change, applied in a fixed order by a migration tool - brings the same discipline to database schema that version control already brings to application code: every change is reviewable before it ships, the exact history of every schema change is preserved, and the same migration can be applied identically and repeatably across development, staging, and production environments. Running migrations automatically as part of a CI/CD deployment pipeline, rather than as a separate manual step someone has to remember, is what actually makes this discipline reliable in practice rather than just a nice idea occasionally followed.",
    altExplain: "Schema migrations as version-controlled code (not manual changes run by hand) bring the same review, history, and repeatability that version control already gives application code. Running them automatically in CI/CD, not as a manual step, is what actually makes this reliable.",
    visual: null,
    keyTakeaway: "The real value of migrations-as-code is repeatability and history - the exact same, reviewed change applied identically everywhere, with a permanent record of what changed and why, not just a faster way to type schema changes.",
    commonMistake: "Writing migration files but still applying them manually and inconsistently across environments, missing the actual reliability benefit that comes specifically from running them automatically as part of a real deployment pipeline.",
  },
  {
    title: "Compliance and data retention regulations",
    body: "Real-world data regulations (like GDPR in the EU) impose genuine, specific requirements on how personal data is stored and deleted - a user's legal right to have their data permanently erased on request (the 'right to be forgotten') is a real operational requirement a database and its backups both need to actually support, not just a policy document. This gets genuinely complicated by backups specifically: if a user's data is deleted from the live database but still sits in a backup taken last week, has it actually been erased in a way that satisfies the regulation? Different organizations handle this differently (a bounded backup retention window after which old backups naturally age out, or backup-level deletion tooling), but the deletion requirement doesn't automatically apply to backups just because it applies to the live database - it takes deliberate, specific design.",
    altExplain: "Regulations like GDPR require genuinely supporting a user's right to have their data permanently deleted - which gets complicated by backups specifically, since deleting from the live database doesn't automatically erase copies sitting in existing backups too.",
    visual: null,
    keyTakeaway: "A deletion requirement satisfied in the live database doesn't automatically extend to existing backups - handling this properly takes deliberate, specific design, not just assuming the live-database deletion is sufficient.",
    commonMistake: "Treating 'right to be forgotten' as satisfied purely by deleting a user's row from the live production database, without accounting for that same data potentially still existing in older backups.",
  },
  {
    title: "On-call and incident response for databases",
    body: "A database incident at 3am needs a genuinely different kind of preparation than a daytime performance investigation - a clear, written runbook covering the most likely failure scenarios (disk full, replication broken, a runaway query) lets whoever's actually on call follow specific, pre-thought-through steps under real time pressure, rather than improvising an unfamiliar system's recovery process from scratch while an outage is actively ongoing. Effective on-call for a database also depends heavily on the monitoring and alerting covered throughout this course actually firing early enough to catch a problem before it becomes a full outage - the person on call can only respond as well as the alert that woke them up actually tells them what's genuinely wrong.",
    altExplain: "A database incident needs a written runbook for likely scenarios, so whoever's on call can follow pre-thought-through steps under pressure instead of improvising from scratch. This depends on monitoring actually catching problems early enough to alert on.",
    visual: null,
    keyTakeaway: "A runbook's real value is having likely scenarios already thought through calmly, in advance - not improvising an unfamiliar recovery process for the first time while an actual outage is in progress.",
    commonMistake: "Having monitoring and alerting in place but no actual written runbook for what to do once an alert fires - the person on call ends up improvising the response itself, even though the problem was caught in time.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Sharding", desc: "Splits data across separate database servers - solves a real scaling limit, at real cross-shard query/rebalancing cost.", example: "Usually a last resort, not a first scaling step" },
      { syntax: "Multi-region: single primary vs multi-write", desc: "Single primary + regional read replicas is simpler; true multi-region writes solve write latency but add conflict-resolution complexity.", example: "Start with regional replicas for read-heavy latency" },
      { syntax: "Migrations as code, run in CI/CD", desc: "Version-controlled, reviewed schema changes applied automatically and repeatably.", example: "Not a manual step someone has to remember" },
      { syntax: "Compliance and backups", desc: "A deletion requirement in the live DB doesn't automatically extend to existing backups - needs deliberate design.", example: "GDPR right-to-be-forgotten across backup retention" },
      { syntax: "Runbooks + on-call", desc: "Pre-written steps for likely failure scenarios, so on-call response isn't improvised from scratch under pressure.", example: "Only as good as the monitoring that triggers it" },
    ],
  },
];

const DBA_PRO_QUIZ_BANK = {
  basic: [
    { q: "Why might a heavily-written table need more than the default autovacuum?", options: ["Autovacuum never runs automatically", "A table with heavy write traffic can accumulate dead rows faster than default autovacuum settings account for", "This never happens in practice", "Autovacuum only applies to reads"], correct: 1 },
    { q: "What's the main benefit of partitioning a large table by date?", options: ["It makes every query faster automatically regardless of filtering", "A query filtered to a specific date range only scans the relevant partitions, and old partitions can be dropped instantly", "It removes the need for indexes", "It only helps with backup speed"], correct: 1 },
    { q: "What's the real complication with read-write splitting?", options: ["There is none, it's automatic once a replica exists", "Replication lag can mean a read immediately following a write hits a replica that hasn't caught up yet", "Reads can't be sent to replicas at all", "It only works with a single application server"], correct: 1 },
    { q: "What does statement_timeout protect against?", options: ["Disk space running out", "A single runaway query consuming resources indefinitely and degrading other queries", "Users typing the wrong password", "Backup failures"], correct: 1 },
    { q: "Why use a tool like PgBouncer instead of connecting directly to the database?", options: ["It makes queries run faster", "Each direct database connection has real overhead - a pooler serves many application instances from far fewer real connections", "It replaces the need for authentication", "It's only useful for read replicas"], correct: 1 },
  ],
  intermediate: [
    { q: "Why check aggregated query stats (like pg_stat_statements) instead of just the slowest single query?", options: ["Aggregated stats are always inaccurate", "A frequent-but-fast query can account for more total database time than a rare, very slow one", "This isn't useful information", "It only matters for very small databases"], correct: 1 },
    { q: "Why tune autovacuum settings per-table rather than globally?", options: ["Per-table tuning isn't actually possible", "So specific high-traffic tables get more aggressive vacuuming without changing the default for every other table", "Global tuning is always better", "This only matters for partitioned tables"], correct: 1 },
    { q: "Why is VACUUM FULL rarely run directly on a large, active production table?", options: ["It doesn't actually reclaim any space", "It requires an exclusive lock for the whole operation, making the table unavailable until it finishes", "It only works on empty tables", "It's slower than a normal VACUUM but otherwise has no downside"], correct: 1 },
    { q: "What's the most common way to prevent deadlocks across an application?", options: ["Disabling locks entirely", "Always locking multiple rows in a consistent order everywhere in the application", "Only using read-only queries", "Increasing the connection limit"], correct: 1 },
    { q: "What makes an automated backup process actually reliable?", options: ["Just scheduling it to run automatically", "Scheduling it automatically AND monitoring/alerting when a scheduled backup fails", "Running it manually whenever convenient", "Taking more frequent backups regardless of monitoring"], correct: 1 },
  ],
  advanced: [
    { q: "What's the key difference between partitioning and sharding?", options: ["They're the same thing", "Partitioning splits a table within one server; sharding splits data across entirely separate database servers", "Sharding is always simpler to implement", "Partitioning requires multiple servers"], correct: 1 },
    { q: "What's a simpler starting point than full multi-region writes for global latency?", options: ["There is no simpler option", "A single-region primary with regional read replicas", "Sharding by region", "Ignoring latency entirely"], correct: 1 },
    { q: "What's the real value of running schema migrations as version-controlled code in CI/CD?", options: ["It's faster to type than manual SQL", "Repeatability and history - the same reviewed change applied identically and traceably everywhere", "It removes the need for a database entirely", "It only matters for very small teams"], correct: 1 },
    { q: "Why doesn't deleting a user's data from the live database alone necessarily satisfy a 'right to be forgotten' requirement?", options: ["It does, nothing else is needed", "That same data may still exist in older backups, which needs separate, deliberate handling", "Regulations don't apply to databases", "This only matters for non-production databases"], correct: 1 },
    { q: "What's the main value of a written incident runbook?", options: ["It replaces the need for monitoring", "It lets whoever's on call follow pre-thought-through steps under pressure, instead of improvising from scratch", "It's only useful for training new hires", "It guarantees an incident never happens"], correct: 1 },
  ],
};
