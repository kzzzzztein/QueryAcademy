// =========================================================================
// APIs - Master Level
// =========================================================================
const API_MASTER_BASIC = [
  {
    title: "Designing for backward compatibility",
    body: "An additive change - a new optional field in a response, a new optional parameter, a whole new endpoint - is almost always safe, since existing clients simply won't notice or use it. A breaking change - removing a field, renaming one, changing a field's type, or making a previously-optional parameter required - is exactly what versioning exists to manage, since it invalidates an assumption existing client code was already relying on. The most durable strategy is to avoid breaking changes as long as realistically possible: add new fields alongside old ones rather than replacing them outright, and deprecate an old field for a good while before ever actually removing it, giving every existing integration a real window to migrate on its own schedule rather than being broken without warning.",
    altExplain: "Adding new optional fields is almost always safe - existing clients just ignore what they don't use. Removing, renaming, or retyping a field is a breaking change, which is what versioning and deprecation windows exist to manage.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An API wants to rename a task's status field to state to better match internal terminology. What's the safest way to make this change?",
      options: ["Rename it immediately - it's just a field name", "Add state as a new field alongside the existing status field, then deprecate and eventually remove status after a migration window", "Silently rename it and update the documentation only", "This can only be done with a whole new major version"], correct: 1,
      explanation: "Adding the new field alongside the old one, then deprecating and eventually removing the old one after a real migration window, avoids breaking every existing client immediately - a pure rename with no transition period is a breaking change with no warning.",
    },
    keyTakeaway: "The safest form of change is additive - new fields alongside old ones - reserving an actual breaking change (and the version bump it requires) for when it's genuinely unavoidable.",
    commonMistake: "Treating a field rename or type change as a minor, low-risk edit rather than the breaking change it actually is for every client already depending on the old shape.",
  },
  {
    title: "Hypermedia and HATEOAS",
    body: "HATEOAS (Hypermedia as the Engine of Application State) is a REST principle where a response includes links to related actions and resources directly, letting a client discover what it can do next by following links rather than hardcoding URL structures ahead of time. A task response might include a self link back to itself, plus a complete_url for marking it done - if that action later becomes unavailable (the task is already complete, say), the link simply wouldn't be included, and a client built to follow links rather than construct URLs from scratch would naturally adapt to that without needing new code. In practice, genuinely full HATEOAS is fairly rare - it adds real design and implementation complexity - but the core idea (returning actionable links rather than making clients memorize a fixed URL scheme) shows up partially in many production APIs, even ones that wouldn't call themselves HATEOAS-compliant.",
    altExplain: "HATEOAS means a response includes links to related actions, so a client discovers what it can do next by following links rather than hardcoding URLs - reducing how tightly the client is coupled to a fixed URL structure.",
    visual: null,
    refBox: {
      syntax: "{ \"id\": 42, ..., \"_links\": { \"self\": \"/tasks/42\", \"complete\": \"/tasks/42/complete\" } }",
      desc: "A HATEOAS-style response embedding actionable links - a client follows these instead of constructing URLs itself.",
      example: "\"_links\": { \"self\": \"/tasks/42\" }",
    },
    keyTakeaway: "The core value of HATEOAS is reduced client-side coupling to a fixed URL scheme - a client that follows links adapts more gracefully when an API's structure changes.",
    commonMistake: "Assuming an API needs to be fully, formally HATEOAS-compliant to benefit from this idea at all - even partially returning actionable links for available next steps captures much of the practical value.",
  },
  {
    title: "API contracts with OpenAPI",
    body: "OpenAPI (formerly known as Swagger) is a standard, machine-readable format - typically written in YAML or JSON - for describing an API's endpoints, their parameters, and the exact shape of their request and response bodies. Because it's a shared, structured format rather than free-text documentation, tooling can generate interactive API documentation, auto-generate client SDKs in various languages, and validate that an API's actual behavior still matches what the specification promises - a genuine contract between an API and everyone building against it, not just descriptive prose that can silently drift out of date. Maintaining an accurate OpenAPI spec as an API evolves is real, ongoing work, but it pays off directly in reduced miscommunication between an API's maintainers and the (often many) teams or external developers building against it.",
    altExplain: "OpenAPI is a machine-readable format describing an API's endpoints and data shapes. Because it's structured (not free-text docs), tooling can generate interactive docs, client SDKs, and validate that behavior still matches the spec.",
    visual: null,
    refBox: {
      syntax: "paths:\n  /tasks/{id}:\n    get:\n      responses:\n        '200':\n          description: A single task",
      desc: "A tiny fragment of an OpenAPI spec - structured, machine-readable, and the basis for generated docs, SDKs, and contract validation.",
      example: "openapi: 3.0.0\ninfo:\n  title: TaskFlow API",
    },
    keyTakeaway: "An OpenAPI spec is a genuine contract, not just documentation - it's structured enough for tooling to generate SDKs and validate real behavior against it, which free-text docs can't do.",
    commonMistake: "Letting an OpenAPI spec drift out of sync with the API's actual behavior over time - an inaccurate contract is often worse than no formal contract at all, since generated tooling and client code will confidently rely on it being correct.",
  },
  {
    title: "Mocking and contract testing",
    body: "A mock server simulates an API's responses based on an agreed contract (often the same OpenAPI spec covered in the previous lesson), letting a frontend or consumer team start building against it before the real backend is actually finished - unblocking parallel work that would otherwise have to wait in sequence. Contract testing goes a step further over time: it automatically verifies that both sides of an integration - the API provider and each consumer - still agree on the shape of requests and responses, catching a breaking change before it ever reaches production, rather than discovering it only when a consumer's real integration suddenly breaks. This matters most in a system with many independent teams building against shared APIs, where a single breaking change can otherwise ripple out and break several unrelated consumers all at once, often without the API team even realizing who's affected until something has already broken.",
    altExplain: "A mock server simulates an API from an agreed contract, letting consumer teams build against it before the real backend is finished. Contract testing continuously verifies both sides still agree on that contract, catching breaking changes before they reach production.",
    visual: null,
    keyTakeaway: "Contract testing catches a breaking change at the moment it's introduced, rather than only when it actually reaches - and breaks - a real consumer in production.",
    commonMistake: "Relying solely on manual, occasional communication between an API team and its consumers to catch breaking changes, rather than automated contract tests that verify the actual, current behavior on both sides.",
  },
  {
    title: "Deprecation strategy",
    body: "Retiring an old API version responsibly means giving every existing consumer real, visible warning and a genuine window to migrate, not just quietly removing something one day. A Deprecation response header signals that an endpoint (or version) is on its way out, often paired with a Sunset header giving the actual date it will stop working entirely - both readable by automated tooling, not just something buried in a changelog a team might never see. Actively monitoring which clients are still calling a deprecated endpoint - by API key, by version header, or similar - lets a team know when it's genuinely safe to remove it, rather than guessing, and lets them reach out directly to whichever specific consumers are still lagging behind before the actual cutoff date arrives.",
    altExplain: "Deprecating an API version responsibly means real warning (Deprecation and Sunset headers with an actual end date) and monitoring who's still using it, rather than quietly removing something without notice.",
    visual: null,
    cli: {
      hint: "curl -i https://api.taskflow.dev/v1/tasks",
      commands: {
        "curl -i https://api.taskflow.dev/v1/tasks": "HTTP/1.1 200 OK\nDeprecation: true\nSunset: Sat, 31 Jan 2027 00:00:00 GMT\nLink: <https://api.taskflow.dev/v2/tasks>; rel=\"successor-version\"\n\n[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" }\n]",
      },
    },
    refBox: {
      syntax: "Deprecation: true\nSunset: <date>",
      desc: "Standard headers signaling an endpoint is deprecated and the date it will actually stop working.",
      example: "Sunset: Sat, 31 Jan 2027 00:00:00 GMT",
    },
    keyTakeaway: "A Sunset date is a real commitment, not a vague warning - it tells every consumer exactly how much time remains, which is what actually makes a migration deadline credible enough to act on.",
    commonMistake: "Removing a deprecated endpoint without ever having monitored who was still actively using it, discovering only after the fact which specific integrations broke and needed to react on no notice at all.",
    challenge: {
      prompt: "Try checking the deprecation headers on the old v1 tasks endpoint using the command above.",
      hint: "Type the exact command shown, with the -i flag to see the Deprecation and Sunset headers.",
      solution: "curl -i https://api.taskflow.dev/v1/tasks",
    },
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Additive vs breaking changes", desc: "New optional fields are safe; removing, renaming, or retyping a field is breaking.", example: "Add `state` alongside `status`, deprecate later" },
      { syntax: "HATEOAS: \"_links\" in a response", desc: "A client discovers next actions by following links rather than hardcoding URLs.", example: "\"_links\": { \"complete\": \"/tasks/42/complete\" }" },
      { syntax: "OpenAPI spec", desc: "A machine-readable API contract - generates docs, SDKs, and validates real behavior.", example: "paths: /tasks/{id}: get: ..." },
      { syntax: "Mock server + contract testing", desc: "Unblocks parallel work and catches breaking changes before they reach production.", example: "Contract test fails if a response shape changes unexpectedly" },
      { syntax: "Deprecation: true / Sunset: <date>", desc: "Standard headers announcing an endpoint's real retirement date.", example: "Sunset: Sat, 31 Jan 2027 00:00:00 GMT" },
    ],
  },
];

const API_MASTER_INTERMEDIATE = [
  {
    title: "Event-driven APIs and message queues",
    body: "Every pattern covered so far in this course has been request/response: a client asks, the API answers, right away. An event-driven approach flips this around - a producer publishes an event to a queue or topic (\"task 42 was completed\") without knowing or caring who, if anyone, is listening, and one or more consumers process that event whenever they're ready to, entirely decoupled from the producer's own timing. This decoupling is the whole point: the producer doesn't need consumers to be online at the same moment it publishes, and adding a brand-new consumer for an existing event later requires no changes at all to the producer, since it was never aware of any specific consumer to begin with. The tradeoff is that request/response's simple, immediate 'did this succeed' answer becomes much harder to reason about once processing might happen anywhere from milliseconds to hours after an event was actually published.",
    altExplain: "Event-driven means a producer publishes an event without knowing who's listening, and consumers process it whenever they're ready - decoupling both sides from needing to be online at the same time, unlike request/response.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A new team wants to react to every task completion by sending a Slack notification, without requiring any change to the existing task service that marks tasks complete. Which approach fits best?",
      options: ["Add a direct API call from the task service to the new Slack-notifying service", "Have the new team subscribe as a consumer to an existing 'task completed' event, with no changes needed to the producer", "This isn't possible without modifying the task service", "Poll the tasks API constantly from the new service"], correct: 1,
      explanation: "This is exactly the decoupling event-driven architecture provides: a new consumer can subscribe to an existing event stream without the original producer needing any awareness of it or any code changes at all.",
    },
    keyTakeaway: "The core value of an event-driven approach is decoupling - producers and consumers don't need to be online at the same time, and new consumers can be added without touching the producer at all.",
    commonMistake: "Assuming an event-driven system offers the same immediate 'did this succeed' certainty request/response does - processing can genuinely happen anywhere from milliseconds to hours later, and designs need to account for that.",
  },
  {
    title: "Webhooks at scale: retries and dead-letter queues",
    body: "A webhook receiver being temporarily unreachable - down for a deploy, briefly overloaded - is a routine occurrence at any real scale, not an edge case to shrug off. A well-built webhook sender retries a failed delivery with backoff, the same pattern covered earlier in this course for regular API calls, giving a temporarily-down receiver a real chance to recover before the sender gives up. If delivery keeps failing past some reasonable number of retries, the event goes to a dead-letter queue instead of simply being discarded and lost - a holding area for events that couldn't be delivered, which can be inspected, manually reprocessed, or at minimum alerted on, rather than silently vanishing with no record that anything ever happened at all.",
    altExplain: "A webhook receiver being briefly down is routine at scale - a good sender retries with backoff. If it keeps failing, the event goes to a dead-letter queue for inspection and manual reprocessing, instead of just being silently lost.",
    visual: null,
    keyTakeaway: "A dead-letter queue's job isn't retrying forever - it's making sure a repeatedly-failed event is visible and recoverable, not silently discarded with no trace it ever existed.",
    commonMistake: "Building a webhook sender that gives up silently after a failed delivery with no retry and no record kept anywhere, making a receiver's brief downtime indistinguishable from that event simply never having happened.",
  },
  {
    title: "API gateways and service mesh",
    body: "An API gateway, covered earlier in this course, sits at the edge, handling traffic coming from outside the system in (often called north-south traffic) - a client's request into whichever backend service should handle it. A service mesh addresses a different layer entirely: traffic between internal services themselves (east-west traffic) - service A calling service B, which calls service C - typically implemented with a small sidecar proxy running alongside each service, transparently handling retries, timeouts, encryption, and observability for every internal call without each service needing to implement all of that itself. The distinction matters because they solve genuinely different problems: a gateway is about the system's single front door, while a service mesh is about the traffic flowing entirely behind that door, between services that never talk directly to the outside world at all.",
    altExplain: "An API gateway handles traffic from outside the system in (north-south). A service mesh handles traffic between internal services (east-west), typically via a sidecar proxy alongside each service - different layers solving different problems.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A large system has dozens of internal microservices calling each other constantly, and wants consistent retries, timeouts, and encryption for all of that internal traffic without changing each service's own code. What best fits this need?",
      options: ["An API gateway at the edge", "A service mesh, handling east-west traffic between the internal services themselves", "Removing authentication entirely", "A single monolithic service instead"], correct: 1,
      explanation: "This is specifically what a service mesh addresses - traffic between internal services (east-west), typically via a sidecar proxy that transparently handles retries, timeouts, and encryption without each service implementing it individually. An API gateway instead handles traffic entering the system from outside.",
    },
    keyTakeaway: "Gateway = the system's single front door for traffic coming from outside; service mesh = the traffic flowing between internal services entirely behind that door - genuinely different layers, not competing solutions to the same problem.",
    commonMistake: "Using the terms 'gateway' and 'service mesh' interchangeably, when they actually address different traffic (north-south vs east-west) at different layers of a system's architecture.",
  },
  {
    title: "Multi-tenant API design",
    body: "A multi-tenant API serves multiple separate customers or organizations from one shared system, and getting tenant isolation right is the central design challenge - one tenant must never be able to see or affect another tenant's data, even accidentally through a coding mistake. Tenant identification typically happens via a subdomain (acme.taskflow.dev), a header, or a claim embedded directly in an auth token, and every single database query needs to be scoped to the current tenant consistently, everywhere, since a single unscoped query is a serious cross-tenant data leak waiting to happen. Rate limits, and sometimes even feature availability, often also need to be tracked and enforced per-tenant rather than globally across the whole system - one tenant's heavy usage shouldn't be able to degrade service for every other tenant sharing the same infrastructure.",
    altExplain: "A multi-tenant API serves multiple customers from one shared system. Every query must be scoped to the current tenant consistently - a single unscoped query is a serious cross-tenant data leak. Rate limits often need per-tenant tracking too.",
    visual: null,
    keyTakeaway: "Tenant isolation has to be consistent everywhere, not just in most places - a single unscoped database query is enough to leak one tenant's data to another, regardless of how careful the rest of the system is.",
    commonMistake: "Relying on the application layer alone to remember to scope every query to the current tenant, with no additional safety net (like database-level row security) to catch the one query that forgets.",
  },
  {
    title: "Observability: logs, metrics, and traces",
    body: "Logs are discrete, timestamped records of individual events - a request came in, an error occurred, a job finished - genuinely useful for understanding exactly what happened at a specific moment. Metrics are aggregated numbers tracked over time - request rate, error rate, average latency - useful for spotting trends and setting alerts on thresholds, but they don't tell you the specific story behind any single request. Traces follow one individual request as it travels across multiple services, showing exactly where time was spent and where something actually failed along that specific path - essential once a single user-facing request might touch five or six different internal services, where logs and metrics alone can't easily reconstruct the full picture of what happened to that one request specifically. Production APIs at real scale genuinely need all three together, since each answers a different kind of question the other two can't.",
    altExplain: "Logs record individual events. Metrics are aggregated numbers over time (request rate, error rate). Traces follow one specific request across multiple services. Each answers a different kind of question - production systems need all three.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A single user-facing request is slow, and it touches five different internal services along the way. Which observability tool is specifically built to show where in that multi-service path the time was actually spent?",
      options: ["Logs alone", "Metrics alone", "A trace, following that specific request across all five services", "None of these can show this"], correct: 2,
      explanation: "This is exactly what tracing is built for - following one individual request as it crosses multiple services, showing where time was spent and where something failed along that specific path. Logs and metrics alone can't easily reconstruct this for a single request.",
    },
    keyTakeaway: "Logs, metrics, and traces each answer a genuinely different question - which specific event happened, what's the overall trend, and where did this one specific request spend its time - not three versions of the same thing.",
    commonMistake: "Relying only on logs or only on metrics for debugging a distributed, multi-service system, when the actual question ('why was this one specific request slow') is exactly what tracing, not logs or metrics alone, is built to answer.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Event-driven: publish/subscribe", desc: "Decouples producer and consumer - neither needs the other online at the same time.", example: "Producer publishes \"task.completed\", any consumer can subscribe" },
      { syntax: "Webhook retries + dead-letter queue", desc: "Retry a failed delivery with backoff; route repeated failures somewhere visible, not lost.", example: "Retry 3x, then move to dead-letter queue" },
      { syntax: "Gateway (north-south) vs service mesh (east-west)", desc: "Different layers - edge traffic in, vs traffic between internal services.", example: "Gateway: client → services. Mesh: service A → service B" },
      { syntax: "Tenant isolation", desc: "Every query scoped consistently to the current tenant - a single miss is a data leak.", example: "acme.taskflow.dev, or a tenant_id claim in the auth token" },
      { syntax: "Logs + metrics + traces", desc: "Three different observability tools answering three different questions.", example: "Trace: why was THIS request slow across 5 services?" },
    ],
  },
];

const API_MASTER_ADVANCED = [
  {
    title: "Versioning and zero-downtime deployments at scale",
    body: "At real scale, rolling out a new API version can't mean a brief moment of downtime while the old version is swapped for the new one - both versions typically need to run simultaneously behind a gateway or load balancer for a transition period, with traffic gradually shifted from old to new rather than switched all at once. Feature flags add finer control still, letting a specific behavior be toggled on for a small percentage of traffic (or specific tenants) first, catching problems on a limited blast radius before a full rollout, and offering an instant rollback - flip the flag back off - without needing an actual code deployment to undo a change that's already causing problems. This combination of parallel versions and gradual, flag-controlled rollout is what makes a large-scale API able to evolve continuously without any single deployment being a high-stakes, all-or-nothing event.",
    altExplain: "At scale, old and new API versions run simultaneously behind a gateway, with traffic gradually shifted over rather than switched all at once. Feature flags let a change be tested on a small percentage of traffic first, with instant rollback if needed.",
    visual: null,
    keyTakeaway: "A feature flag's real value is instant rollback without a new deployment - flipping a flag back off is far faster and safer than deploying a reverting code change under pressure.",
    commonMistake: "Treating a big version rollout as a single all-or-nothing cutover event, rather than a gradual, monitored traffic shift that can be paused or reversed the moment something looks wrong.",
  },
  {
    title: "Rate limiting algorithms",
    body: "A token bucket holds a set number of tokens that refill at a steady rate; each request consumes one token, and requests are rejected once the bucket is empty - this naturally allows short bursts of traffic (using up saved tokens) while still enforcing a steady average rate over time. A leaky bucket instead processes requests at a strictly constant rate no matter how they arrive, smoothing out bursts entirely rather than permitting them - simpler to reason about, but less forgiving of a client that legitimately needs to send a quick burst. A sliding window log tracks the exact timestamp of every recent request and counts precisely how many fell within the trailing time window, offering the most accurate enforcement of the three, at the cost of needing to store more data (every individual timestamp) than the other two approaches, which only need to track a single running count each.",
    altExplain: "Token bucket allows bursts (spending saved-up tokens) while enforcing a steady average rate. Leaky bucket processes at a strictly constant rate, smoothing out bursts entirely. Sliding window log is the most precise, tracking every request's exact timestamp, at a higher storage cost.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An API wants to allow clients to occasionally send a quick burst of requests, as long as their average rate over time stays within limits. Which rate-limiting algorithm naturally supports this?",
      options: ["Leaky bucket, since it smooths everything to a constant rate", "Token bucket, since saved-up tokens allow a burst while still enforcing the average rate", "Neither approach can allow bursts", "This requires disabling rate limiting entirely"], correct: 1,
      explanation: "A token bucket is specifically built for this: tokens accumulate up to the bucket's capacity, so a client can burst through several requests at once by spending saved tokens, while the steady refill rate still enforces the average rate over time.",
    },
    keyTakeaway: "The real choice between these algorithms is about burst tolerance and storage cost - token bucket allows controlled bursts, leaky bucket smooths everything flat, sliding window log is most precise but stores the most data.",
    commonMistake: "Picking a rate-limiting algorithm without considering whether legitimate clients actually need to burst occasionally - a leaky bucket's strict smoothing can unnecessarily throttle a client sending a perfectly reasonable quick burst of requests.",
  },
  {
    title: "API security hardening",
    body: "Broken Object-Level Authorization (BOLA) - a request for /tasks/42 succeeding for a user who shouldn't actually have access to task 42 at all - is consistently one of the most common and damaging API-specific vulnerabilities in practice, and it happens because it's easy to correctly check that a user is authenticated while forgetting to separately check that they're authorized for this specific object. Excessive data exposure happens when an API returns far more fields than a specific client actually needs (an internal cost field alongside a public price, say), relying entirely on the client to filter it out rather than the server withholding it in the first place - a real risk if that response is ever inspected directly. Mass assignment is a related trap: blindly accepting every field in a request body and applying it directly to a database record, which can let an attacker set a field they were never supposed to be able to touch (like is_admin) just by including it in a request. The OWASP API Security Top 10 catalogs these and other API-specific risks in far more depth, and is worth a dedicated read for anyone building production APIs seriously.",
    altExplain: "BOLA means checking a user is logged in but forgetting to check they're allowed to access this specific object. Excessive data exposure means returning fields the client shouldn't see. Mass assignment means blindly applying every request field to a database record, letting an attacker set fields they shouldn't be able to touch.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An endpoint checks that a request includes a valid auth token, then fetches /invoices/{id} and returns it without checking whether that specific invoice actually belongs to the requesting user. What vulnerability does this describe?",
      options: ["Excessive data exposure", "Broken Object-Level Authorization (BOLA)", "Mass assignment", "This isn't actually a vulnerability"], correct: 1,
      explanation: "This is a textbook BOLA case - the endpoint correctly verifies the user is authenticated, but never separately checks that they're authorized to access this specific invoice, letting any logged-in user potentially access anyone else's invoices just by guessing or iterating IDs.",
    },
    keyTakeaway: "Authentication (who you are) and object-level authorization (whether you're allowed this specific object) are two separate checks - BOLA is what happens when only the first one actually gets implemented.",
    commonMistake: "Assuming that requiring a valid auth token on every endpoint automatically means access is properly controlled - authentication alone says nothing about whether that specific authenticated user should be allowed to access this specific object.",
    challenge: {
      prompt: "In one sentence, describe how you'd fix the BOLA scenario above so a user can only access their own invoices.",
      hint: "Add an explicit check comparing the invoice's owner to the requesting user's own ID, on top of the existing authentication check.",
      solution: "After confirming the request is authenticated, separately check that the fetched invoice's owner_id matches the requesting user's own ID before returning it - if it doesn't match, return 403 or 404 instead.",
    },
  },
  {
    title: "Designing public developer platforms",
    body: "An API meant as a genuine product for external developers to build on needs to solve for a fundamentally different audience than one used only internally by a single team that already knows the system intimately. Self-serve API key generation and interactive documentation let a new developer start experimenting within minutes, without ever needing to email anyone or wait for manual account setup. A sandbox environment, with realistic but clearly fake data, lets developers build and test an integration safely, without any risk of touching real production data along the way. Official client SDKs in popular languages lower the barrier to entry significantly compared to expecting every developer to hand-write raw HTTP requests themselves. And because external developers, unlike an internal team, can't simply be told about a breaking change in a team meeting, a genuinely dependable versioning and deprecation policy - covered earlier in this course - becomes even more essential here than it is for a purely internal API.",
    altExplain: "A public developer platform needs self-serve API keys and docs, a sandbox with fake data for safe testing, official SDKs to lower the barrier to entry, and a genuinely dependable versioning policy - external developers can't just be told about changes in a meeting.",
    visual: null,
    keyTakeaway: "Everything about a public developer platform - self-serve access, sandboxes, SDKs, versioning discipline - exists because external developers can't be reached the informal, low-friction way an internal team can be.",
    commonMistake: "Treating a public API the same way as an internal one - assuming developers will read a changelog, tolerate manual onboarding, or accept a breaking change with little notice, when external developers have far less patience and far less direct communication with the API team.",
  },
  {
    title: "Capstone: designing a complete API",
    body: "Designing a real API means bringing together most of what this course has covered into one coherent set of decisions, not applying any single idea in isolation. Resource design (REST conventions, sensible nesting) decides the URL shape; an authentication method (from a simple API key to full OAuth 2.0, depending on who's actually calling) decides who gets in; rate limiting and a chosen algorithm protect the service from overload; versioning and deprecation policy decide how the API will be allowed to evolve later without breaking everyone using it today; and observability (logs, metrics, traces) is what actually makes the resulting system debuggable once it's live and being used for real. None of these decisions are made in a vacuum - a public developer platform's authentication needs differ sharply from an internal microservice's, and a rarely-changing internal API can reasonably defer a lot of the deprecation-policy rigor a public one can't skip. The skill this entire course has been building toward isn't memorizing every individual concept - it's weighing these tradeoffs together for a specific, real situation.",
    altExplain: "Designing a real API means weighing resource design, auth, rate limiting, versioning, and observability together for a specific situation - not applying any one idea in isolation, and not making the same choices for a public platform as for an internal microservice.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A small internal API is called only by three other services owned by the same team, all deployed together. How much of this course's public-developer-platform guidance (self-serve keys, sandboxes, SDKs, strict deprecation windows) genuinely applies?",
      options: ["All of it, without exception, for every API", "Very little of it directly - an internal API with tightly coupled, coordinated deployments has fundamentally different needs than a public platform", "None of this course applies to internal APIs at all", "It depends only on the programming language used"], correct: 1,
      explanation: "This is the central skill this course builds toward: recognizing that these concepts are tools to weigh for a specific situation, not a fixed checklist to apply uniformly everywhere. A tightly coupled internal API, deployed together by one team, has fundamentally different needs than a public developer platform.",
    },
    keyTakeaway: "The real skill from this entire course is judgment - weighing which concepts actually matter for a specific API's real audience and stakes, not applying every technique uniformly to every API regardless of context.",
    commonMistake: "Applying every advanced technique from this course to every API by default, regardless of its actual audience and stakes - a small internal API and a public developer platform genuinely warrant different levels of rigor.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Parallel versions + feature flags", desc: "Zero-downtime rollout - shift traffic gradually, roll back instantly by flipping a flag.", example: "10% of traffic on v2, flag-gated" },
      { syntax: "Token bucket / leaky bucket / sliding window log", desc: "Rate-limiting algorithms with different burst tolerance and storage cost.", example: "Token bucket allows controlled bursts" },
      { syntax: "BOLA / excessive data exposure / mass assignment", desc: "Common API-specific vulnerabilities - see the OWASP API Security Top 10 for more.", example: "Always check object-level authorization, not just authentication" },
      { syntax: "Self-serve keys, sandbox, SDKs", desc: "What a public developer platform needs that an internal API often doesn't.", example: "A sandbox environment with realistic fake data" },
      { syntax: "Resource design + auth + rate limits + versioning + observability", desc: "The full set of tradeoffs a real API design has to weigh together.", example: "Weighed differently for a public platform vs an internal API" },
    ],
  },
];

const API_MASTER_QUIZ_BANK = {
  basic: [
    { q: "Which of these is generally a safe, non-breaking API change?", options: ["Removing an existing field", "Adding a new optional field to a response", "Changing a field's data type", "Making an optional parameter required"], correct: 1 },
    { q: "What does HATEOAS let a client do?", options: ["Skip authentication entirely", "Discover available next actions by following links in a response, rather than hardcoding URLs", "Automatically generate its own API keys", "Bypass rate limiting"], correct: 1 },
    { q: "What is an OpenAPI spec primarily used for?", options: ["Only as prose documentation", "A machine-readable contract enabling generated docs, SDKs, and validation against real behavior", "Encrypting API traffic", "Replacing HTTP entirely"], correct: 1 },
    { q: "What does contract testing catch that manual communication often misses?", options: ["Nothing extra", "A breaking change, automatically, before it reaches production and breaks a real consumer", "Network latency issues", "Rate limit violations"], correct: 1 },
    { q: "What do Deprecation and Sunset headers together communicate?", options: ["That an endpoint is brand new", "That an endpoint is being retired, and the actual date it will stop working", "A rate limit has been exceeded", "The API's current version number only"], correct: 1 },
  ],
  intermediate: [
    { q: "What's the core benefit of an event-driven (publish/subscribe) approach over request/response?", options: ["It's always faster", "It decouples producer and consumer - neither needs the other online at the same time", "It removes the need for authentication", "It guarantees instant processing"], correct: 1 },
    { q: "What's a dead-letter queue for?", options: ["Storing successfully delivered webhooks", "Holding events that repeatedly failed delivery, so they're visible and recoverable instead of lost", "Rate limiting incoming requests", "Caching API responses"], correct: 1 },
    { q: "What's the difference between an API gateway and a service mesh?", options: ["They're the same thing", "Gateway handles traffic entering the system (north-south); service mesh handles traffic between internal services (east-west)", "A service mesh is only for authentication", "A gateway only works with GraphQL"], correct: 1 },
    { q: "In multi-tenant API design, what's the central risk to guard against?", options: ["Slow response times", "One tenant accidentally accessing another tenant's data through an unscoped query", "Using too much JSON", "Having too many endpoints"], correct: 1 },
    { q: "Which observability tool is specifically built to show where time was spent across multiple services for one single request?", options: ["Logs", "Metrics", "Traces", "None of these can show this"], correct: 2 },
  ],
  advanced: [
    { q: "What's the main benefit of a feature flag during a rollout?", options: ["It makes the API faster", "Instant rollback by toggling it off, without needing a new deployment", "It replaces the need for testing", "It's required for every API change"], correct: 1 },
    { q: "Which rate-limiting algorithm naturally allows a controlled burst of requests?", options: ["Leaky bucket", "Token bucket", "Neither allows bursts", "Sliding window log only"], correct: 1 },
    { q: "What does BOLA (Broken Object-Level Authorization) describe?", options: ["A network performance issue", "Checking that a user is authenticated, but forgetting to check they're authorized for this specific object", "A caching bug", "A rate-limiting algorithm"], correct: 1 },
    { q: "Why does a public developer platform need a dependable versioning and deprecation policy more than a purely internal API might?", options: ["It doesn't - they're identical needs", "External developers can't simply be told about a breaking change in a team meeting the way an internal team can", "Public APIs are technically incapable of versioning", "This only matters for GraphQL APIs"], correct: 1 },
    { q: "What's the central skill this course builds toward, according to its capstone lesson?", options: ["Memorizing every technique and applying all of them to every API", "Weighing which concepts genuinely matter for a specific API's actual audience and stakes", "Always choosing gRPC over REST", "Avoiding versioning entirely"], correct: 1 },
  ],
};

// Wire this course into the shared registry (COURSE_CONTENT is declared in
// data.js, loaded before this file - we're adding to it, not replacing it).
COURSE_CONTENT.api = {
  entry: {
    basic: API_ENTRY_BASIC,
    intermediate: API_ENTRY_INTERMEDIATE,
    advanced: API_ENTRY_ADVANCED,
    quiz: API_QUIZ_BANK,
  },
  professional: {
    basic: API_PRO_BASIC,
    intermediate: API_PRO_INTERMEDIATE,
    advanced: API_PRO_ADVANCED,
    quiz: API_PRO_QUIZ_BANK,
  },
  master: {
    basic: API_MASTER_BASIC,
    intermediate: API_MASTER_INTERMEDIATE,
    advanced: API_MASTER_ADVANCED,
    quiz: API_MASTER_QUIZ_BANK,
  },
};
