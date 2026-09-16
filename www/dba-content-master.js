// =========================================================================
// Database Administration - Master Level
// =========================================================================
const DBA_MASTER_BASIC = [
  {
    title: "Choosing a database engine for a new system",
    body: "A relational database (like PostgreSQL) enforces a fixed schema and strong consistency guarantees, and excels at data with real relationships between different pieces of it - exactly the kind of data this platform's own SQL course works with throughout. A document or NoSQL database trades some of that structure and consistency for flexibility (a schema that can vary row to row) and, for some workloads, easier horizontal scaling. Neither is universally 'better' - a system with genuinely relational data and a need for strong consistency (financial records, inventory counts) fits a relational database well; a system with highly variable, loosely-structured data at very large scale (a product catalog with wildly different attributes per category) may fit a document database better. This decision, made early in a system's life, is genuinely expensive to reverse later, which is exactly why it deserves real, deliberate thought rather than defaulting to whatever's most familiar.",
    altExplain: "Relational databases enforce structure and strong consistency, fitting genuinely relational data well. Document/NoSQL databases trade some structure for flexibility and easier scaling for some workloads. Neither is universally better - the choice depends on the actual data and requirements, and is expensive to reverse later.",
    visual: null,
    keyTakeaway: "This is a genuinely expensive decision to reverse once a system is built around it - worth real, deliberate consideration of the actual data and consistency requirements, not just defaulting to whatever's most familiar to the team.",
    commonMistake: "Choosing a database engine based purely on team familiarity or current trends, without weighing the actual shape of the data and consistency requirements the specific system genuinely has.",
  },
  {
    title: "Database schema design for scale",
    body: "A schema that works well at a small scale can become a genuine bottleneck at a much larger one - a heavily normalized schema (data split across many related tables, each fact stored in exactly one place, covered in this platform's own SQL course) minimizes redundancy and keeps data consistent, but can require many joins for a common query, which gets more expensive as tables grow large. Denormalization - deliberately duplicating some data across tables to avoid an expensive join - trades some redundancy and a harder consistency-keeping burden for meaningfully faster reads on a specific, known, frequently-run query pattern. This is a genuine tradeoff to make deliberately for specific, measured bottlenecks, not a wholesale rejection of normalization as a general design principle.",
    altExplain: "A normalized schema minimizes redundancy but can need many joins for common queries, which get more expensive at scale. Denormalization deliberately duplicates some data to avoid a specific expensive join - a real tradeoff for known bottlenecks, not a rejection of normalization generally.",
    visual: null,
    keyTakeaway: "Denormalization is a deliberate, targeted response to a specific, measured performance bottleneck - not a general alternative design philosophy to apply everywhere out of habit.",
    commonMistake: "Denormalizing a schema broadly and speculatively 'for performance' before any actual bottleneck has been measured, taking on real redundancy and consistency-maintenance cost without a corresponding, proven benefit.",
  },
  {
    title: "CAP theorem and distributed database trade-offs",
    body: "The CAP theorem describes a genuine, unavoidable tradeoff for any distributed database (one spread across multiple servers): during a network partition (some servers can't communicate with others, which will eventually happen in any real distributed system), a system can guarantee either consistency (every node sees the same, most up-to-date data) or availability (every request gets a response, even if it might be slightly stale), but not both at the same time. A system that chooses consistency during a partition may refuse some requests entirely rather than risk returning stale data; a system that chooses availability will keep responding, but some responses may briefly be inconsistent with each other until the partition resolves. This isn't a design flaw to engineer around - it's a fundamental, unavoidable tradeoff in distributed systems, and different real systems deliberately make different choices based on what actually matters more for their specific use case.",
    altExplain: "CAP theorem: during a network partition, a distributed database can guarantee consistency (same data everywhere) or availability (always responds, possibly with slightly stale data), but not both. This is a fundamental, unavoidable tradeoff, not a flaw to design around.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A banking system processing account balance transfers experiences a network partition. Which CAP tradeoff most likely makes sense for this specific system?",
      options: ["Prioritize availability always, even risking two conflicting balance updates", "Prioritize consistency, even if it means refusing some requests during the partition, to avoid ever showing an incorrect balance", "CAP theorem doesn't apply to financial systems", "Neither consistency nor availability actually matters here"], correct: 1,
      explanation: "A banking system where an incorrect or inconsistent balance is a genuinely serious problem is a strong case for prioritizing consistency during a partition - briefly refusing some requests is a far better outcome than risking two conflicting updates to the same account balance.",
    },
    keyTakeaway: "CAP theorem's tradeoff is unavoidable, but WHICH side to prioritize is a genuine, deliberate choice based on a specific system's actual stakes - not a universal answer that fits every system equally.",
    commonMistake: "Treating CAP theorem as an abstract concept rather than a concrete design decision that has to be made deliberately for a specific system, based on what that system's users would actually be more harmed by - inconsistency or unavailability.",
  },
  {
    title: "Database observability at scale",
    body: "The monitoring covered in this course's entry level (checking pg_stat_activity, tracking disk space) works fine for a single database, but a system running many databases - across services, regions, or shards - needs monitoring that aggregates across all of them into one coherent view, not dozens of separate dashboards someone has to check individually. This typically means shipping metrics (query latency, connection counts, replication lag, disk usage) from every database instance into a centralized observability platform, where trends, anomalies, and correlations across the whole fleet become visible at once - a replication lag spike on one specific shard, for instance, showing up clearly against the backdrop of every other shard's normal, healthy baseline, rather than being missed entirely because nobody happened to be looking at that one specific database at that moment.",
    altExplain: "At scale, monitoring needs to aggregate across many databases into one coherent view, not dozens of separate dashboards. Centralized observability makes an anomaly on one specific database visible against the backdrop of the whole fleet's normal baseline.",
    visual: null,
    keyTakeaway: "Centralized observability's real value at scale is making one instance's anomaly visible against the whole fleet's normal baseline - a problem easy to miss when monitoring each database in isolation, one dashboard at a time.",
    commonMistake: "Scaling to many database instances while still monitoring each one individually and separately, rather than aggregating into a centralized view where cross-instance trends and anomalies actually become visible.",
  },
  {
    title: "Cost optimization for cloud databases",
    body: "A managed cloud database's cost is driven by several real, separate factors - compute (the server size provisioned), storage (data volume, which typically only grows), and data transfer (moving data in and out, particularly across regions) - and genuine savings usually come from addressing a specific one of these deliberately, not a vague, general 'reduce cost' directive. Right-sizing (matching provisioned compute to actual measured load, rather than a comfortable but excessive overestimate) is often the single largest lever, alongside archiving genuinely old, rarely-accessed data to cheaper storage instead of leaving it on the same expensive, high-performance storage as actively-used data. Reserved capacity (committing to a certain usage level in advance for a meaningfully lower rate) is a real further saving, but only once actual usage patterns are well-understood and reasonably stable - committing to reserved capacity before that is a real, genuine risk of overcommitting.",
    altExplain: "Cloud database cost is driven by compute, storage, and data transfer - real savings target one specific factor deliberately. Right-sizing compute and archiving old data to cheaper storage are common big levers; reserved capacity saves more, but only once usage is well-understood.",
    visual: null,
    keyTakeaway: "Right-sizing compute to actual measured load is very often the single largest cost lever - genuine savings usually come from addressing one specific cost driver deliberately, not a vague general cost-cutting effort.",
    commonMistake: "Committing to reserved capacity for cost savings before actual usage patterns are well-understood and reasonably stable - a real risk of locking in a commitment that doesn't actually match real, evolving usage.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Relational vs document/NoSQL", desc: "An expensive-to-reverse choice - depends on actual data structure and consistency requirements, not team familiarity.", example: "Genuinely relational data with strong consistency needs → relational" },
      { syntax: "Normalization vs denormalization", desc: "Denormalization is a targeted response to a specific, measured bottleneck - not a general design philosophy.", example: "Duplicate data deliberately to avoid one known expensive join" },
      { syntax: "CAP theorem", desc: "During a partition: consistency or availability, not both. Which to prioritize is a deliberate choice per system.", example: "Banking: prioritize consistency over availability" },
      { syntax: "Centralized observability", desc: "Aggregates metrics across many database instances into one view - makes anomalies visible against the fleet baseline.", example: "One shard's lag spike, visible against the rest" },
      { syntax: "Cost optimization", desc: "Right-size compute to actual load; archive old data to cheaper storage; reserve capacity only once usage is stable.", example: "Right-sizing is often the single largest lever" },
    ],
  },
];

const DBA_MASTER_INTERMEDIATE = [
  {
    title: "Multi-tenant database architecture",
    body: "A multi-tenant system serving many separate customers from shared infrastructure has several genuinely different architectural options, each with real tradeoffs. Separate databases per tenant give the strongest isolation (one tenant's problem can't directly affect another's database) but the highest operational overhead, since every migration, backup, and monitoring task now has to run across potentially thousands of separate databases instead of one. A shared database with a tenant_id column on every table is far simpler to operate, but every single query must correctly filter by tenant - a single missed filter is a serious cross-tenant data leak, echoing this platform's own APIs course's coverage of the same underlying risk. Schema-per-tenant within one shared database is a middle ground, offering better isolation than a shared-tables approach without the full operational overhead of fully separate databases.",
    altExplain: "Separate databases per tenant give the strongest isolation but the highest operational overhead. A shared database with a tenant_id column is simpler but every query must filter correctly - a missed filter is a serious data leak. Schema-per-tenant is a middle ground.",
    visual: null,
    keyTakeaway: "This is a genuine spectrum of isolation-versus-operational-overhead tradeoffs, not a single correct answer - the right point on that spectrum depends on how many tenants, how sensitive their data is, and how much operational overhead is actually manageable.",
    commonMistake: "Defaulting to a shared-database-with-tenant_id design purely for its operational simplicity, without weighing how serious the consequences of a single missed tenant filter would actually be for this specific system's data.",
  },
  {
    title: "Data warehousing vs OLTP databases",
    body: "A production application's database - optimized for many small, fast transactions (OLTP, online transaction processing) - is generally a poor fit for large, complex analytical queries scanning millions of rows, since those two access patterns genuinely conflict: a long-running analytical query can compete for the same resources a live application needs for its own fast, small transactions. A data warehouse is a separate database, specifically structured and optimized for exactly this kind of large-scale analytical querying, typically populated by an ETL (extract, transform, load) process that regularly copies and reshapes data out of the OLTP system into the warehouse's own structure. This separation lets analytical workloads run as large and slow as they genuinely need to, without ever risking the production application's own performance.",
    altExplain: "A production app's OLTP database (optimized for many small, fast transactions) is a poor fit for large analytical queries, which conflict with that access pattern. A data warehouse is a separate database structured for analytics, populated by an ETL process from the OLTP system.",
    visual: null,
    keyTakeaway: "The core reason for a separate data warehouse is resource contention - a large analytical query and a live application's fast, frequent transactions genuinely compete for the same resources if run against the same database.",
    commonMistake: "Running large, complex analytical queries directly against a live production OLTP database, risking real performance degradation for actual users of the application, rather than against a separate warehouse built for exactly this purpose.",
  },
  {
    title: "Change data capture (CDC) and event streaming",
    body: "Change data capture reads a database's own internal change log (the same write-ahead log PostgreSQL uses for replication and point-in-time recovery, covered earlier in this course) and turns every insert, update, and delete into a stream of events other systems can subscribe to - keeping a search index, a cache, or a data warehouse continuously in sync with the database, without the application itself having to remember to publish an event on every single write. This is a meaningfully more reliable pattern than an application explicitly publishing events on every write, since it's driven directly by the database's actual committed changes rather than depending on the application never forgetting a step, and it naturally captures every change, including ones made outside the application's own normal code paths.",
    altExplain: "CDC reads a database's own internal change log and turns every write into an event stream other systems can subscribe to, keeping them in sync automatically. More reliable than an app explicitly publishing events, since it's driven by the database's actual committed changes, not app code remembering to do so.",
    visual: null,
    keyTakeaway: "CDC's reliability advantage over application-level event publishing is that it's driven by the database's own actual committed changes - it can't be forgotten or skipped the way a manual publish-an-event step in application code sometimes is.",
    commonMistake: "Relying on application code to explicitly publish an event on every write to keep downstream systems in sync, rather than CDC reading the database's own change log directly - a missed or buggy publish call in application code is a real, common failure mode CDC avoids.",
  },
  {
    title: "Database chaos engineering",
    body: "Assuming a failover, backup restore, or replica promotion will work correctly during a real incident, purely because it's configured and looks correct on paper, is a real, common gap - chaos engineering closes it by deliberately triggering real failures (killing a primary database process, simulating network partition between servers) in a controlled test environment, specifically to observe whether the system actually recovers the way it's supposed to. This directly extends the 'test your restore, don't just assume it works' principle from this course's earlier backup module to every other kind of failure a database system might face, not backups specifically - the same underlying discipline of proving resilience through deliberate, controlled testing rather than simply assuming it based on configuration alone.",
    altExplain: "Chaos engineering deliberately triggers real failures (killing a primary, simulating a network partition) in a controlled test environment, to observe whether recovery actually works as intended - extending 'test your restore, don't just assume it' to every kind of failure, not just backups.",
    visual: null,
    keyTakeaway: "Chaos engineering is the same underlying discipline as testing a backup restore, applied more broadly - proving resilience through deliberate, controlled testing, rather than simply trusting that a correctly-configured system will behave correctly during a real failure.",
    commonMistake: "Assuming a failover or recovery process works correctly purely because it's configured and looks correct on paper, without ever deliberately testing it under conditions resembling a genuine failure.",
  },
  {
    title: "Building a DBA team's runbooks and playbooks",
    body: "A single runbook (covered at a professional level earlier in this course) helps one person handle one specific known scenario; a mature DBA team needs a maintained library of them, covering the range of failures the team has actually encountered or reasonably anticipates - and, just as importantly, a process for keeping that library genuinely current as the systems it describes actually change, rather than slowly going stale and misleading. Playbooks that get reviewed and updated after every real incident (capturing what actually happened, what the existing runbook got right or missed) turn every genuine incident into future preparation for the next one, rather than a one-time, non-repeating disruption whose lessons quietly evaporate once the immediate fire is out.",
    altExplain: "A mature DBA team needs a maintained library of runbooks, kept genuinely current as systems change - reviewed and updated after every real incident, so each one becomes future preparation rather than a one-time disruption whose lessons are lost.",
    visual: null,
    keyTakeaway: "A runbook library's real value depends entirely on staying current - reviewing and updating it after every real incident is what keeps it genuinely useful, rather than slowly becoming outdated and actively misleading.",
    commonMistake: "Writing runbooks once and never revisiting them as the underlying systems and infrastructure genuinely evolve - an outdated runbook followed confidently during a real incident can be actively worse than having no runbook at all.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Multi-tenant architecture spectrum", desc: "Separate DBs (max isolation, max overhead) to shared tables with tenant_id (simple, requires correct filtering everywhere).", example: "Schema-per-tenant as a middle ground" },
      { syntax: "OLTP vs data warehouse", desc: "A live app's OLTP database is a poor fit for large analytical queries - a separate warehouse avoids resource contention.", example: "ETL moves data from OLTP into the warehouse" },
      { syntax: "Change data capture (CDC)", desc: "Reads the database's own change log to keep other systems in sync automatically - more reliable than app-published events.", example: "Driven by actual committed changes, not app code" },
      { syntax: "Database chaos engineering", desc: "Deliberately triggers real failures in a test environment to verify recovery actually works, not just looks correct on paper.", example: "The same discipline as testing a backup restore, applied broadly" },
      { syntax: "Living runbooks", desc: "A maintained library, reviewed and updated after every real incident - stays useful only if kept genuinely current.", example: "An outdated runbook can be worse than none" },
    ],
  },
];

const DBA_MASTER_ADVANCED = [
  {
    title: "Zero-downtime major version upgrades",
    body: "Upgrading a database's major version (not just a minor patch) can involve real, breaking changes to internal storage formats, meaning a straightforward in-place upgrade often requires real downtime while data is converted. Zero-downtime approaches typically use logical replication: standing up a new server running the new version, replicating live data into it from the old version while both run simultaneously, and only cutting traffic over once the new version is fully caught up and verified - at which point the switch itself can be a matter of seconds, rather than the potentially hours-long downtime a direct in-place upgrade might require on a large database. This is meaningfully more complex to set up and execute correctly than a simple in-place upgrade, which is exactly why it's reserved for systems where genuine downtime during the upgrade window truly isn't acceptable.",
    altExplain: "A major version upgrade can involve breaking storage format changes, meaning in-place upgrades often need real downtime. Zero-downtime approaches use logical replication to a new server running alongside the old one, cutting over in seconds once it's caught up - more complex, reserved for when downtime truly isn't acceptable.",
    visual: null,
    keyTakeaway: "The real complexity of a zero-downtime upgrade is worth taking on specifically when genuine downtime during the upgrade window isn't acceptable - for many systems, a simpler in-place upgrade during a planned, low-traffic maintenance window is a perfectly reasonable choice instead.",
    commonMistake: "Reaching for a fully zero-downtime upgrade approach by default for every major version upgrade, without weighing whether a simpler in-place upgrade during a planned maintenance window would actually be acceptable for this specific system.",
  },
  {
    title: "Designing for multi-cloud / avoiding vendor lock-in",
    body: "A database tightly coupled to one specific cloud provider's proprietary features can become genuinely difficult and expensive to move later, if a future business need (cost, compliance, a specific region only another provider offers) ever calls for it. Designing with portability in mind means favoring standard, widely-supported database engines and features over a provider's own proprietary extensions where a genuinely reasonable standard alternative exists, and keeping infrastructure configuration itself in portable, provider-agnostic tooling rather than deeply provider-specific scripts. This is a real, deliberate tradeoff, not a free choice: some genuinely valuable proprietary features get intentionally left unused specifically to preserve future portability, which is a real, ongoing cost worth weighing honestly against how likely a future migration actually is for a specific system.",
    altExplain: "A database tightly coupled to one cloud provider's proprietary features becomes hard and expensive to move later. Designing for portability means favoring standard, widely-supported features over proprietary ones - a real tradeoff, since some genuinely valuable proprietary features get intentionally left unused.",
    visual: null,
    keyTakeaway: "Avoiding vendor lock-in is a genuine tradeoff, not a free choice - it means intentionally forgoing some real, valuable proprietary features, worth weighing honestly against how likely an actual future migration is for a specific system.",
    commonMistake: "Pursuing full multi-cloud portability reflexively for every system, regardless of how genuinely likely a future migration actually is - the real cost of forgoing proprietary features is worth honestly weighing against that likelihood, not assumed to always be worth paying.",
  },
  {
    title: "Database security incident response",
    body: "A suspected database security breach needs a genuinely different, more careful response than a routine performance incident - the immediate priority shifts to containment (cutting off further unauthorized access, which might mean revoking credentials or isolating network access) and preserving evidence (logs, connection history) for later investigation, rather than a routine incident's usual priority of restoring normal service as fast as possible. Rotating every credential that could plausibly have been exposed - not just the one specifically confirmed compromised - and a careful, deliberate audit of exactly what data may have actually been accessed are both essential, deliberate steps, not just conservative extra caution layered on top of an otherwise-normal incident response.",
    altExplain: "A security breach needs different priorities than a routine incident: containment and evidence preservation first, not just fast service restoration. Rotating every plausibly-exposed credential (not just the confirmed one) and auditing what was actually accessed are essential steps, not just extra caution.",
    visual: null,
    keyTakeaway: "A security incident's priorities genuinely differ from a routine performance incident - containment and evidence preservation come first, which can mean deliberately accepting some continued disruption rather than rushing straight back to normal service.",
    commonMistake: "Responding to a suspected security breach with the same priorities as a routine performance incident - rushing to restore normal service can destroy evidence or leave a still-active unauthorized access path open.",
  },
  {
    title: "Mentoring and leading a DBA/platform team",
    body: "As a DBA grows into a more senior or leadership role, the actual job shifts meaningfully - from being the person who personally fixes every database problem, to building a team and a set of systems (runbooks, monitoring, automated safeguards) that can prevent and handle problems even when that one senior person isn't the one directly involved. This means deliberately investing time in things that don't look like immediate technical output - documenting tribal knowledge that currently lives only in one person's head, pairing with less experienced team members on real incidents rather than just quietly resolving it solo and faster, and building genuinely blameless post-incident review processes that focus on what the system and its safeguards should learn, not on assigning individual fault for a mistake.",
    altExplain: "Growing into DBA leadership means shifting from personally fixing every problem to building a team and systems that can handle problems without you directly involved - documenting tribal knowledge, pairing on incidents, and running blameless post-incident reviews focused on systemic learning, not individual fault.",
    visual: null,
    keyTakeaway: "The real shift in a senior DBA role is from personal technical output to building a team and systems resilient enough not to depend on any one specific person - which often means deliberately investing time in things that don't look like immediate technical output.",
    commonMistake: "Continuing to personally resolve every incident solo as quickly as possible even after growing into a more senior role, rather than deliberately using incidents as opportunities to build the team's collective knowledge and capability.",
  },
  {
    title: "Capstone: designing complete database architecture for a scenario",
    body: "Designing a real database architecture means weighing this entire course's tools together for one specific system, not applying a single default architecture regardless of context. A new e-commerce platform expecting rapid growth reasonably needs: a relational database (genuinely relational order/inventory data), sensible normalization with deliberate, targeted denormalization only where a specific bottleneck is actually measured, partitioning on order tables by date once they grow large, a read replica for reporting traffic kept separate from the primary, an automated and tested backup strategy with a deliberately chosen RTO/RPO, monitoring and alerting wired to an on-call runbook, and a clear-eyed decision about multi-region and multi-tenant needs based on the platform's actual customer base - not a generic 'best practice' checklist applied uniformly regardless of what this specific business actually needs and can realistically operate.",
    altExplain: "A real database architecture weighs this whole course's tools together for one specific system's actual needs - relational vs NoSQL, normalization, partitioning, replicas, backup strategy, monitoring, and multi-region/multi-tenant decisions - not a generic checklist applied the same way regardless of context.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A small internal tool used by one team, with no plans for external customers or rapid growth, is being designed. Which approach best fits this specific context?",
      options: ["Full multi-region, sharded, multi-tenant architecture, to be safe", "A single relational database with straightforward normalization, a simple automated backup schedule, and no premature sharding or multi-region complexity", "No database architecture decisions are needed at this scale", "The same architecture as a large-scale e-commerce platform, for consistency across the organization"], correct: 1,
      explanation: "This is precisely the judgment this whole course builds toward: a low-stakes, low-growth internal tool genuinely doesn't need the operational complexity of sharding, multi-region architecture, or elaborate multi-tenancy - a straightforward, well-backed-up relational database is the right-sized choice, not a checklist applied uniformly regardless of actual context.",
      },
      keyTakeaway: "The real skill from this entire course is judgment - weighing which tools genuinely matter for a specific system's actual scale, stakes, and growth trajectory, not applying every advanced technique uniformly to every database regardless of context.",
      commonMistake: "Applying every advanced technique from this course (sharding, multi-region, elaborate multi-tenancy) to every system by default, regardless of its actual scale and stakes - a small internal tool and a large-scale public platform genuinely warrant very different levels of architectural complexity.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Zero-downtime major upgrades", desc: "Logical replication to a new-version server, cutting over once caught up - complex, reserved for when downtime isn't acceptable.", example: "Simple in-place upgrade is fine for many systems" },
      { syntax: "Avoiding vendor lock-in", desc: "Favoring portable, standard features over proprietary ones - a real tradeoff against genuinely valuable features.", example: "Weigh against how likely a future migration actually is" },
      { syntax: "Security incident response", desc: "Containment and evidence preservation first, not fast service restoration - rotate every plausibly-exposed credential.", example: "Different priorities than a routine performance incident" },
      { syntax: "DBA leadership", desc: "Shifts from personal fixing to building team/systems resilience - documentation, pairing, blameless post-incident review.", example: "Not depending on any one specific person" },
      { syntax: "Full architecture design", desc: "Weighs this whole course's tools against one specific system's actual scale and stakes.", example: "A small internal tool needs far less complexity than a large public platform" },
    ],
  },
];

const DBA_MASTER_QUIZ_BANK = {
  basic: [
    { q: "What should primarily drive the choice between a relational and a document/NoSQL database?", options: ["Whatever the team is most familiar with", "The actual shape of the data and its consistency requirements", "Whichever is currently more popular", "Database choice doesn't matter much either way"], correct: 1 },
    { q: "When does denormalization genuinely make sense?", options: ["Applied broadly by default for performance", "As a targeted response to a specific, measured query bottleneck", "Never, normalization should always be maximized", "Only for very small databases"], correct: 1 },
    { q: "According to CAP theorem, what can't a distributed database guarantee simultaneously during a network partition?", options: ["Speed and storage", "Consistency and availability", "Security and cost", "Backups and replication"], correct: 1 },
    { q: "Why does monitoring need to change at scale (many database instances)?", options: ["It doesn't need to change", "Individual dashboards per instance make cross-instance trends and anomalies easy to miss - centralized observability aggregates them", "Monitoring becomes unnecessary at scale", "Only cost monitoring matters at scale"], correct: 1 },
    { q: "What's often the single largest lever for cloud database cost optimization?", options: ["Switching database engines entirely", "Right-sizing compute to actual measured load", "Disabling all monitoring", "Increasing replica count"], correct: 1 },
  ],
  intermediate: [
    { q: "What's the tradeoff with separate databases per tenant in a multi-tenant system?", options: ["No tradeoff, it's always the best choice", "Strongest isolation, but the highest operational overhead across potentially thousands of databases", "It's the simplest option to operate", "It only works for a small number of tenants"], correct: 1 },
    { q: "Why use a separate data warehouse instead of running analytics directly on the production database?", options: ["Warehouses are always cheaper", "Large analytical queries compete for the same resources a live application needs for its fast, small transactions", "Production databases can't run SELECT queries", "This is purely a stylistic preference"], correct: 1 },
    { q: "What makes change data capture (CDC) more reliable than application-published events?", options: ["It's not actually more reliable", "It's driven by the database's own actual committed changes, not dependent on app code remembering to publish an event", "CDC doesn't require any infrastructure", "It only works for read-only databases"], correct: 1 },
    { q: "What does database chaos engineering directly extend from this course's earlier backup lessons?", options: ["Nothing, it's an unrelated practice", "The principle of testing recovery for real, rather than just assuming a configured system will behave correctly during a failure", "The 3-2-1 backup rule specifically", "It only applies to backup testing, not other failures"], correct: 1 },
    { q: "What keeps a runbook library genuinely useful over time?", options: ["Writing it once, thoroughly, at the start", "Reviewing and updating it after every real incident as systems actually change", "Making it as long and detailed as possible", "Runbooks don't need maintenance once written"], correct: 1 },
  ],
  advanced: [
    { q: "Why do zero-downtime major version upgrades typically use logical replication?", options: ["It's the only way to upgrade at all", "It lets a new-version server run alongside the old one, cutting over in seconds once caught up, avoiding the downtime an in-place upgrade might need", "It's simpler than an in-place upgrade", "It removes the need for backups during the upgrade"], correct: 1 },
    { q: "What's the real cost of designing for multi-cloud portability?", options: ["There is no real cost", "Intentionally forgoing some genuinely valuable proprietary features to preserve future portability", "It always saves money immediately", "It only affects backup strategy"], correct: 1 },
    { q: "What's the immediate priority in a suspected security breach, different from a routine incident?", options: ["Restoring normal service as fast as possible, same as any incident", "Containment and evidence preservation, even if it means accepting some continued disruption", "Ignoring it until confirmed", "Immediately deleting all logs"], correct: 1 },
    { q: "What does the shift into DBA leadership primarily involve?", options: ["Personally resolving every incident faster than before", "Building a team and systems (documentation, pairing, blameless review) that don't depend on any one specific person", "Doing less technical work overall with no other focus", "Avoiding incidents entirely"], correct: 1 },
    { q: "What's the central skill this course's capstone emphasizes?", options: ["Applying every advanced technique to every system by default", "Judgment - weighing which tools genuinely fit a specific system's actual scale and stakes", "Always choosing the most complex, most scalable architecture available", "Avoiding all architectural decisions until forced to"], correct: 1 },
  ],
};

// Wire this course into the shared registry (COURSE_CONTENT is declared in
// data.js, loaded before this file - we're adding to it, not replacing it).
COURSE_CONTENT.dba = {
  entry: {
    basic: DBA_ENTRY_BASIC,
    intermediate: DBA_ENTRY_INTERMEDIATE,
    advanced: DBA_ENTRY_ADVANCED,
    quiz: DBA_QUIZ_BANK,
  },
  professional: {
    basic: DBA_PRO_BASIC,
    intermediate: DBA_PRO_INTERMEDIATE,
    advanced: DBA_PRO_ADVANCED,
    quiz: DBA_PRO_QUIZ_BANK,
  },
  master: {
    basic: DBA_MASTER_BASIC,
    intermediate: DBA_MASTER_INTERMEDIATE,
    advanced: DBA_MASTER_ADVANCED,
    quiz: DBA_MASTER_QUIZ_BANK,
  },
};
