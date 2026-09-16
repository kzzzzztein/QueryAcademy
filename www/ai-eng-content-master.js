// =========================================================================
// AI Engineering - Master Level
// =========================================================================
const AIENG_MASTER_BASIC = [
  {
    title: "Self-hosted vs API-based models",
    body: "Calling a provider's hosted API (the pattern this entire course has used so far) is simple to start with - no infrastructure to manage, pay per use, always running the provider's latest version. Self-hosting an open-weight model on your own infrastructure trades that simplicity for real control: no per-token cost once infrastructure is running (though the infrastructure itself genuinely costs money), full control over data never leaving your own systems, and no dependency on an external provider's uptime or pricing changes - at the real cost of needing to actually run, scale, and maintain that infrastructure and its own uptime yourself. This is a genuine tradeoff worth making deliberately based on real, specific requirements - data residency rules that require it, or usage volume genuinely high enough that self-hosting's fixed infrastructure cost beats ongoing per-token API pricing - not a default choice made on general principle alone.",
    altExplain: "API-based models are simple to start with, no infrastructure to manage. Self-hosting trades that for control - no per-token cost, data never leaves your systems, no external uptime dependency - at the real cost of running that infrastructure yourself. A deliberate tradeoff, not a default choice.",
    visual: null,
    keyTakeaway: "Self-hosting is a genuine tradeoff worth making for specific, real requirements - data residency, or usage volume where the economics genuinely favor it - not a default upgrade path every application should eventually take.",
    commonMistake: "Assuming self-hosting is automatically 'more serious' or a natural progression from using an API, without a specific, real requirement (data residency, usage volume, cost at scale) that actually justifies taking on the infrastructure burden.",
  },
  {
    title: "Model selection strategy for a product",
    body: "Choosing which model (or models) to build a product around is a decision with real, ongoing consequences - beyond the immediate capability and cost tradeoffs covered earlier in this course, a genuinely deliberate strategy also considers how a model's behavior might change over time (a provider updating a model version can shift subtle behaviors, even when broadly backward compatible), how easy it would genuinely be to switch providers later if needed, and whether relying on a single model creates a real single point of failure for the whole product. Building with an abstraction layer that isn't tightly coupled to one specific provider's exact API shape - a genuine architectural choice, at some real added complexity - can make switching models later meaningfully less painful, if that flexibility turns out to matter.",
    altExplain: "Model selection has real ongoing consequences - a provider updating a model can shift subtle behavior, switching providers later can be hard, and relying on one model is a real single point of failure. An abstraction layer not tightly coupled to one provider's API shape can make switching later less painful.",
    visual: null,
    keyTakeaway: "Model selection isn't a one-time decision - a provider's own model updates over time are a real, ongoing consideration, and some architectural flexibility (an abstraction layer) can meaningfully reduce the pain of a future switch, at some real upfront complexity cost.",
    commonMistake: "Treating model selection as a single one-time decision made once at the start of a project, without considering how the chosen model's behavior might shift over time, or how genuinely difficult switching would be later if it ever became necessary.",
  },
  {
    title: "AI product design: setting user expectations",
    body: "An AI feature that's occasionally wrong is a fundamentally different design problem than a traditional feature that's either fully correct or visibly broken - the product design itself needs to actively set honest expectations, rather than presenting AI-generated output with the same unqualified confidence as a database lookup that's either right or an obvious error. This might mean visibly citing sources for a claim (letting a user verify it themselves), offering an easy, low-friction way to correct a wrong output, or simply being upfront in the interface itself that a specific feature is AI-generated and may occasionally be wrong - design choices that genuinely shape how much a user actually trusts and correctly relies on a feature, not just how the underlying model itself happens to perform.",
    altExplain: "An occasionally-wrong AI feature is a different design problem than a traditionally correct-or-broken feature. Product design needs to actively set honest expectations - citing sources, an easy way to correct output, being upfront it's AI-generated - shaping how much a user actually trusts it correctly.",
    visual: null,
    keyTakeaway: "How much a user trusts and correctly relies on an AI feature is shaped as much by genuine product design choices (citations, correction paths, honest framing) as by the underlying model's actual raw performance.",
    commonMistake: "Presenting AI-generated output with the same unqualified visual confidence as a traditional, deterministic feature, without any design signal to a user that it might occasionally be wrong or need verification.",
  },
  {
    title: "Data privacy and compliance for AI applications",
    body: "Sending user data to an LLM API - as part of a prompt, or as content retrieved for a RAG system - genuinely counts as sharing that data with a third party, which real privacy regulations (GDPR and others) have specific requirements around, echoing this platform's own DBA course's coverage of the same underlying regulatory landscape. Some providers offer options specifically relevant here - contractual guarantees that submitted data won't be used to further train their models, or dedicated deployment options that keep data more tightly controlled - and understanding a provider's actual data handling policy in real detail, not just assuming it's fine, is a genuine compliance responsibility, not an implementation detail to skip past. This matters most acutely for genuinely sensitive data - health information, financial records, anything covered by specific regulatory obligations - where the compliance stakes of getting this wrong are real and significant.",
    altExplain: "Sending user data to an LLM API genuinely counts as sharing it with a third party, with real regulatory requirements attached. Understanding a provider's actual data handling policy in detail - not just assuming it's fine - is a genuine compliance responsibility, especially for sensitive data.",
    visual: null,
    keyTakeaway: "Sending data to an LLM API is genuinely a third-party data-sharing decision with real regulatory weight, not just a routine implementation detail - understanding a provider's actual data handling policy is a genuine compliance responsibility.",
    commonMistake: "Sending genuinely sensitive user data (health, financial, anything with specific regulatory obligations) to an LLM API without first understanding that specific provider's actual, detailed data handling and retention policy.",
  },
  {
    title: "Building internal AI platforms and tooling",
    body: "As an organization's use of AI features grows across multiple teams, letting each team independently solve the same underlying problems - authentication to the LLM provider, cost tracking, evaluation tooling, prompt versioning - leads to real, unnecessary duplicated effort and genuinely inconsistent practices between teams. An internal AI platform centralizes this shared infrastructure - a single, well-maintained integration layer, shared cost and usage dashboards, common evaluation tooling - letting individual product teams focus on their own actual product logic rather than each independently reinventing the same underlying plumbing. This mirrors how many organizations already build internal platforms for other shared infrastructure needs (CI/CD, deployment tooling); it just applies the same underlying idea specifically to AI-related infrastructure.",
    altExplain: "As AI feature use grows across teams, letting each team independently solve the same underlying problems (auth, cost tracking, evaluation) leads to real duplicated effort. An internal AI platform centralizes this shared infrastructure, letting teams focus on their own product logic.",
    visual: null,
    keyTakeaway: "An internal AI platform's real value is eliminating duplicated effort across teams solving the same underlying infrastructure problems independently - the same underlying idea many organizations already apply to CI/CD and deployment tooling, just for AI specifically.",
    commonMistake: "Letting each product team independently build its own AI integration, cost tracking, and evaluation tooling from scratch, missing the real efficiency and consistency gains a shared internal platform would provide across the whole organization.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Self-hosted vs API-based", desc: "A real, deliberate tradeoff - control and data residency vs infrastructure burden - not a default upgrade path.", example: "Justified by data residency needs or genuine usage-volume economics" },
      { syntax: "Model selection as an ongoing decision", desc: "A provider's model updates over time; an abstraction layer can ease a future switch, at some upfront complexity cost.", example: "Not a one-time decision made once and forgotten" },
      { syntax: "Setting honest user expectations", desc: "Citations, correction paths, honest AI-generated framing - design choices that shape actual trust, not just model performance.", example: "An occasionally-wrong feature needs different design than a correct-or-broken one" },
      { syntax: "Data privacy and AI APIs", desc: "Sending data to an LLM API is real third-party data sharing with regulatory weight - understand the provider's actual policy.", example: "Especially critical for health/financial/sensitive data" },
      { syntax: "Internal AI platforms", desc: "Centralizes shared infrastructure (auth, cost tracking, evaluation) across teams, avoiding duplicated effort.", example: "The same idea many orgs already apply to CI/CD" },
    ],
  },
];

const AIENG_MASTER_INTERMEDIATE = [
  {
    title: "Fine-tuning in practice: data prep and the training loop",
    body: "Actually fine-tuning a model - reached for once prompting has genuinely been pushed as far as it can go, per this course's entry-level coverage - starts with assembling a genuinely high-quality training dataset: real examples of the specific input/output pattern wanted, consistently and correctly formatted, since a fine-tuned model will reliably learn and repeat whatever patterns actually exist in its training examples, including any inconsistencies or mistakes present in that data. The training process itself adjusts the model's underlying weights to better fit these examples, typically evaluated on a held-out validation set the model never actually trains on directly, to check whether it's genuinely learning the intended pattern rather than simply memorizing its specific training examples without any real ability to generalize beyond them.",
    altExplain: "Fine-tuning starts with a genuinely high-quality, consistently-formatted training dataset - a model will reliably learn and repeat any inconsistencies present in that data too. Training adjusts model weights, checked against a held-out validation set to verify real generalization, not just memorization.",
    visual: null,
    keyTakeaway: "A fine-tuned model reliably learns and repeats whatever patterns actually exist in its training data, inconsistencies included - training data quality is the single most important factor in how well fine-tuning actually works.",
    commonMistake: "Fine-tuning on a training dataset with real inconsistencies or quality issues, and being surprised when the resulting model reliably reproduces those same inconsistencies in its own output.",
  },
  {
    title: "Evaluating and comparing models rigorously",
    body: "Choosing between models - different providers, different sizes, a fine-tuned version against the original base model - deserves the same rigorous, consistent evaluation methodology covered at the entry level of this course, run identically across every candidate being compared: the same test set, the same scoring criteria, applied consistently to each model under otherwise-identical conditions. Genuinely comparing models also means considering more than raw accuracy alone - cost per request, response latency, and consistency across repeated runs of the exact same input (since output can vary run to run even at a fixed temperature) all matter for a real, practical decision, not just whichever model scores marginally higher on quality alone in isolation from every other real consideration.",
    altExplain: "Comparing models deserves the same rigorous evaluation as any other AI evaluation - the same test set and criteria applied identically to each candidate. Real comparison also weighs cost, latency, and run-to-run consistency, not just raw accuracy in isolation.",
    visual: null,
    keyTakeaway: "A real model comparison weighs cost, latency, and consistency alongside raw accuracy - the model that scores marginally highest on quality alone isn't automatically the right practical choice once every other real consideration is weighed in.",
    commonMistake: "Comparing models purely on a single raw accuracy or quality score, without also weighing cost, latency, and run-to-run consistency - all genuinely relevant to which model is actually the right practical choice for a specific product.",
  },
  {
    title: "Cost modeling and forecasting for AI features at scale",
    body: "A feature's cost during initial development, tested against a handful of requests, gives very little real signal about its actual cost once it's serving genuine production traffic at scale - forecasting real cost means modeling expected request volume against per-request cost (itself driven by prompt length, response length, and which specific model is used, all covered earlier in this course), and being honest that this volume, and therefore total cost, will very likely grow as a feature's actual usage grows over time. This connects directly to the cost/latency routing pattern covered at the professional level of this course - a model choice that's perfectly affordable at low, early-stage volume can become a genuinely serious ongoing cost once that same feature is actually serving real traffic at real scale, which is exactly why this needs deliberate forecasting rather than only checking cost once, early, and assuming it'll simply hold steady.",
    altExplain: "Cost tested against a handful of dev requests gives little signal about real production cost at scale. Forecasting means modeling expected volume against per-request cost, and being honest that both will grow - a model affordable early can become a serious ongoing cost at real scale.",
    visual: null,
    keyTakeaway: "A model's cost checked once, early, against low development-time volume is a poor predictor of its actual cost once a feature is genuinely serving production traffic at real scale - this needs deliberate, ongoing forecasting, not a one-time early check.",
    commonMistake: "Checking an AI feature's cost only once, early in development against low test volume, and assuming that figure will simply hold steady once the feature is actually serving real, growing production traffic.",
  },
  {
    title: "Building a feedback loop from production",
    body: "The evaluation and testing covered throughout this course catches problems against a known, pre-built test set - but a genuinely production-scale AI feature also needs a way to learn from real usage that a test set, built in advance, could never have fully anticipated. Capturing real user feedback (explicit thumbs up/down, or implicit signals like a user immediately rephrasing and re-asking the same question, which often suggests the first answer wasn't actually satisfying) and periodically incorporating what's learned back into the evaluation test set itself - adding a real, previously-unseen failure case that actually happened in production - is what keeps an evaluation process genuinely representative of real-world usage over time, rather than gradually growing stale against a fixed, unchanging test set from months or years earlier.",
    altExplain: "Evaluation catches problems against a known, pre-built test set - but a feature also needs to learn from real usage a test set couldn't have anticipated. Capturing real feedback and periodically adding real production failure cases back into the test set keeps evaluation genuinely representative over time.",
    visual: null,
    keyTakeaway: "An evaluation test set needs to genuinely evolve based on real production feedback over time - a fixed test set built once, early on, gradually grows stale and less representative of how a feature is actually being used in the real world.",
    commonMistake: "Building an evaluation test set once, early in development, and never revisiting or expanding it based on real production feedback - the test set gradually becomes a less and less accurate reflection of actual real-world usage over time.",
  },
  {
    title: "AI feature rollout strategy",
    body: "Rolling out a new AI feature (or a meaningful change to an existing one) to every single user all at once is genuinely risky, since production usage patterns often reveal real problems that development testing, however thorough, simply never surfaced. A canary rollout - releasing to a small percentage of real traffic first, closely monitoring both quality and cost metrics, then gradually expanding only once that initial slice looks genuinely healthy - directly limits the real damage a serious, previously-unseen problem could cause, and provides an easy, fast rollback path if something does go wrong, echoing the same zero-downtime deployment principles this platform's own DBA course covers for database schema changes, applied specifically to AI feature rollouts instead.",
    altExplain: "Rolling out a new AI feature to everyone at once is risky - production often reveals problems testing never surfaced. A canary rollout releases to a small percentage first, monitors closely, then expands gradually - limiting damage and providing an easy rollback, the same principle as zero-downtime deployments.",
    visual: null,
    keyTakeaway: "A canary rollout's real value is limiting the damage a previously-unseen production problem could cause, and providing an easy, fast rollback - the same underlying deployment-safety principle covered elsewhere on this platform, applied specifically to AI features.",
    commonMistake: "Rolling out a significant AI feature change to 100% of users immediately, without a gradual, monitored rollout that would catch a serious production-only problem while it's still affecting only a small, limited slice of real traffic.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Fine-tuning data quality", desc: "A model reliably learns and repeats whatever patterns exist in training data, inconsistencies included.", example: "Data quality is the single most important factor" },
      { syntax: "Rigorous model comparison", desc: "Same test set and criteria for every candidate - weigh cost, latency, and consistency, not just raw accuracy.", example: "The highest-scoring model isn't automatically the right practical choice" },
      { syntax: "Cost forecasting at scale", desc: "Model expected volume against per-request cost - both grow as real usage grows, needing ongoing forecasting.", example: "A model affordable early can become costly at real scale" },
      { syntax: "Production feedback loop", desc: "Capture real usage feedback and add real failure cases back into the evaluation test set over time.", example: "Keeps evaluation representative, not stale" },
      { syntax: "Canary rollout", desc: "Release to a small percentage first, monitor, expand gradually - limits damage, enables fast rollback.", example: "Same principle as zero-downtime schema deployments" },
    ],
  },
];

const AIENG_MASTER_ADVANCED = [
  {
    title: "Building an AI platform team",
    body: "As internal AI tooling (covered at a basic level earlier in this course) grows in scope, it often warrants its own dedicated team - responsible for the shared integration layer, cost and usage monitoring, evaluation infrastructure, and internal best-practice guidance every other team building AI features actually relies on. This mirrors how many organizations already structure dedicated platform teams for other foundational, widely-shared infrastructure (a database platform team, a CI/CD platform team); an AI platform team applies that exact same organizational pattern specifically to AI infrastructure, existing specifically to let every other product team move faster and more consistently by not each independently reinventing the same underlying plumbing and practices from scratch.",
    altExplain: "As internal AI tooling grows, it often warrants its own dedicated platform team - responsible for shared integration, monitoring, evaluation infrastructure, and best practices, mirroring how organizations already structure platform teams for other shared infrastructure like databases or CI/CD.",
    visual: null,
    keyTakeaway: "An AI platform team exists specifically so every other product team can move faster and more consistently, not reinventing the same shared infrastructure independently - the same organizational pattern many companies already apply to other foundational infrastructure.",
    commonMistake: "Scaling AI feature development across many teams without ever consolidating the shared infrastructure into a dedicated team, leaving every team to keep independently reinventing and maintaining the same underlying plumbing.",
  },
  {
    title: "Governance and responsible AI practices",
    body: "As AI features become more central to a product, an organization needs genuine, deliberate governance around them - not just individual engineers each making judgment calls independently on issues like fairness (does a feature perform consistently well across different groups of users, or does it work noticeably better for some than others), transparency (are users genuinely told when they're interacting with an AI-generated feature), and accountability (who's actually responsible when an AI feature causes real, genuine harm). This typically means actual documented policies, a genuine review process for new AI features before they ship, and clear ownership - a real governance structure, not simply trusting that every individual engineer will independently make consistently good judgment calls on these genuinely hard, consequential questions.",
    altExplain: "Real AI governance means documented policies, a genuine review process, and clear ownership around fairness, transparency, and accountability - not just trusting individual engineers to each independently make good judgment calls on genuinely hard questions.",
    visual: null,
    keyTakeaway: "Governance means actual documented policy, review process, and clear ownership - a real structure, not simply trusting that every individual engineer will consistently make good independent judgment calls on genuinely hard, consequential questions.",
    commonMistake: "Treating responsible AI practices as something each individual engineer handles independently through their own good judgment, rather than establishing actual organizational policy, a real review process, and clear accountability.",
  },
  {
    title: "Handling model deprecation and migration",
    body: "AI providers periodically deprecate older model versions, giving a defined but real, finite migration window - an application still calling a deprecated model past that window will genuinely stop working entirely, not degrade gracefully. Handling this well means the same abstraction layer covered at a basic level earlier in this course (not tightly coupling application code to one specific model's exact identifier), combined with the same rigorous evaluation methodology used to select a model in the first place, now applied specifically to verify a proposed replacement model actually performs comparably before switching production traffic over - since a 'compatible' newer model can still behave subtly, meaningfully differently on a product's own genuinely specific use cases in ways a generic announcement or changelog would never actually capture.",
    altExplain: "Providers periodically deprecate older models with a real, finite migration window - an app calling a deprecated model past that window simply stops working. An abstraction layer plus the same rigorous evaluation used for original model selection, applied to verify a replacement performs comparably, is what handles this well.",
    visual: null,
    keyTakeaway: "A 'compatible' replacement model can still behave subtly differently on a product's own specific use cases - the same rigorous evaluation used for original model selection needs to be reapplied to verify a migration target actually performs comparably, not just assumed to from a changelog.",
    commonMistake: "Migrating to a provider's recommended replacement model based purely on their own announcement or changelog, without re-running the same rigorous evaluation against the product's own specific use cases to confirm it actually performs comparably in practice.",
  },
  {
    title: "Advanced multi-modal applications",
    body: "Everything covered throughout this course has focused on text, but modern models increasingly handle multiple modalities together - accepting images, audio, or video as input alongside or instead of text, and in some cases generating them as output too. A multi-modal application might accept a photo of a receipt and extract structured expense data from it directly, or process a customer's voice recording without a separate speech-to-text step in between. The underlying engineering principles from this entire course - prompting, evaluation, cost/latency tradeoffs, guardrails - largely carry over directly to multi-modal use cases too, though token/cost accounting genuinely gets more involved (an image or a video typically consumes meaningfully more tokens than an equivalent amount of plain text) and evaluation needs its own modality-appropriate methods (comparing generated images, for instance, is a genuinely different evaluation problem than comparing generated text).",
    altExplain: "Modern models increasingly handle images, audio, and video alongside text. This course's core principles (prompting, evaluation, cost/latency tradeoffs, guardrails) largely carry over, though token accounting gets more involved and evaluation needs modality-appropriate methods (comparing images differs genuinely from comparing text).",
    visual: null,
    keyTakeaway: "This course's core engineering principles largely transfer directly to multi-modal applications - the real new complexity is in token/cost accounting and needing genuinely modality-appropriate evaluation methods, not an entirely different underlying discipline.",
    commonMistake: "Assuming multi-modal applications require an entirely separate engineering discipline from everything covered in this course, rather than recognizing that the core principles (prompting, evaluation, cost tradeoffs) largely carry over directly, with some genuinely new considerations layered on top.",
  },
  {
    title: "Capstone: designing a complete AI product architecture",
    body: "Designing a real AI product architecture means weighing this entire course's tools together for one specific product's actual needs, not applying a single default AI stack regardless of context. A customer support tool handling sensitive account data reasonably needs: a carefully-chosen model with a real, documented data handling policy, RAG grounded in the company's own actual support documentation (with a strict grounding instruction, given the real cost of a confidently wrong support answer), a human-in-the-loop checkpoint before any consequential account action is actually taken, rigorous evaluation with a continuously-growing test set fed by real production feedback, cost forecasting for its actual expected support volume, and a genuine, deliberate governance review before it ever ships - not a generic 'add an AI chatbot' checklist applied uniformly regardless of what this specific product actually needs and what's genuinely at stake if it gets something wrong.",
    altExplain: "A real AI product architecture weighs this whole course's tools together for one specific product's actual needs - model choice, RAG grounding, human-in-the-loop checkpoints, evaluation, cost forecasting, and governance - not a generic 'add AI' checklist applied the same way regardless of context and stakes.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A low-stakes internal tool suggests meeting time slots based on team availability, with no sensitive data and no consequential actions taken automatically. Which approach best fits this specific context?",
      options: ["Full governance review, human-in-the-loop for every suggestion, and self-hosted models for maximum control", "A straightforward API call to an appropriately-sized model, with basic evaluation and no elaborate governance or human-in-the-loop machinery", "No AI engineering practices apply at this scale", "The same architecture as a customer support tool handling sensitive account data, for consistency"], correct: 1,
      explanation: "This is exactly the judgment this whole course builds toward: a low-stakes, non-sensitive internal tool with no consequential automated actions genuinely doesn't need elaborate governance, human-in-the-loop checkpoints, or self-hosted infrastructure - a straightforward, appropriately-sized approach is the right fit, not a checklist applied uniformly regardless of actual stakes.",
    },
    keyTakeaway: "The real skill from this entire course is judgment - weighing which tools and safeguards genuinely fit a specific product's actual stakes and requirements, not applying every advanced practice uniformly to every AI feature regardless of context.",
    commonMistake: "Applying the same elaborate stack of governance, human-in-the-loop checkpoints, and infrastructure to every AI feature by default, regardless of how genuinely different the actual stakes and requirements are between a low-stakes internal tool and a customer-facing feature handling sensitive data.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "AI platform team", desc: "A dedicated team for shared AI infrastructure, mirroring how orgs already structure database or CI/CD platform teams.", example: "Lets other teams move faster without reinventing plumbing" },
      { syntax: "Governance", desc: "Real documented policy, review process, and clear ownership around fairness, transparency, and accountability.", example: "Not just individual engineer judgment calls" },
      { syntax: "Model deprecation and migration", desc: "An abstraction layer plus re-running rigorous evaluation on the replacement model before switching production traffic.", example: "A 'compatible' model can still behave subtly differently" },
      { syntax: "Multi-modal applications", desc: "Core principles largely carry over - new complexity is in token accounting and modality-appropriate evaluation.", example: "Comparing generated images differs from comparing text" },
      { syntax: "Full architecture design", desc: "Weighs this whole course's tools against one specific product's actual stakes and requirements.", example: "A low-stakes tool needs far less machinery than a sensitive customer-facing feature" },
    ],
  },
];

const AIENG_MASTER_QUIZ_BANK = {
  basic: [
    { q: "When does self-hosting a model genuinely make sense over using a provider's API?", options: ["Always, it's more serious and professional", "For specific real requirements like data residency rules or usage volume where the economics genuinely favor it", "Never, APIs are always better", "Only for very small applications"], correct: 1 },
    { q: "Why is model selection an ongoing decision, not a one-time choice?", options: ["It isn't, you choose once and never revisit it", "A provider's model can change behavior over time with updates, and switching providers later is a real, ongoing consideration", "Models never actually change after release", "This only matters for open-source models"], correct: 1 },
    { q: "What role does product design play in an AI feature that's occasionally wrong?", options: ["None, design doesn't affect trust", "It actively shapes how much users actually trust and correctly rely on the feature - citations, correction paths, honest framing", "Design only matters for traditional, deterministic features", "The model's accuracy alone determines user trust"], correct: 1 },
    { q: "Why does sending user data to an LLM API have real compliance implications?", options: ["It doesn't, APIs are exempt from privacy regulations", "It genuinely counts as sharing data with a third party, with real regulatory requirements attached", "This only applies to government systems", "Compliance only matters for self-hosted models"], correct: 1 },
    { q: "What's the main value of an internal AI platform?", options: ["It replaces the need for any product teams", "Centralizing shared infrastructure (auth, cost tracking, evaluation) to avoid duplicated effort across teams", "It only matters for very small organizations", "It removes the need for evaluation entirely"], correct: 1 },
  ],
  intermediate: [
    { q: "Why does fine-tuning data quality matter so much?", options: ["It doesn't significantly affect the result", "A fine-tuned model reliably learns and repeats whatever patterns exist in its training data, inconsistencies included", "Fine-tuning ignores training data quality entirely", "This only matters for very large training sets"], correct: 1 },
    { q: "What should a rigorous model comparison weigh beyond raw accuracy?", options: ["Nothing else matters besides accuracy", "Cost, latency, and consistency across repeated runs", "Only the provider's marketing claims", "The model's release date alone"], correct: 1 },
    { q: "Why does AI feature cost need ongoing forecasting rather than a one-time check?", options: ["Cost never actually changes once measured", "Both request volume and per-request cost tend to grow as real usage grows over time", "Forecasting isn't useful for AI features", "Cost only matters during initial development"], correct: 1 },
    { q: "What keeps an evaluation test set genuinely representative over time?", options: ["Building it once, early, and never changing it", "Periodically incorporating real production feedback and failure cases back into it", "Using the same test set forever without review", "Test sets don't need to evolve"], correct: 1 },
    { q: "What's the main benefit of a canary rollout for an AI feature?", options: ["It makes the feature more accurate automatically", "It limits potential damage from an unseen production problem and provides an easy rollback path", "It's required by every LLM API", "It only applies to non-AI features"], correct: 1 },
  ],
  advanced: [
    { q: "Why might an organization build a dedicated AI platform team?", options: ["To slow down other teams intentionally", "To centralize shared AI infrastructure so other teams don't each independently reinvent the same plumbing", "Platform teams are never useful for AI specifically", "Only very small organizations need this"], correct: 1 },
    { q: "What does real AI governance require, beyond individual engineer judgment?", options: ["Nothing more is needed", "Documented policy, a genuine review process, and clear ownership", "Governance only applies to non-technical decisions", "Trusting each engineer's independent judgment is always sufficient"], correct: 1 },
    { q: "Why re-run rigorous evaluation when migrating to a provider's recommended replacement model?", options: ["It's unnecessary if the provider says it's compatible", "A 'compatible' model can still behave subtly differently on a product's own specific use cases", "Evaluation only matters for the original model choice", "Migration never requires any verification"], correct: 1 },
    { q: "How much of this course's core principles carry over to multi-modal applications?", options: ["None, multi-modal requires an entirely separate discipline", "Largely, though token accounting and evaluation need modality-appropriate adjustments", "Only prompting concepts carry over", "Multi-modal applications don't need evaluation"], correct: 1 },
    { q: "What's the central skill this course's final capstone emphasizes?", options: ["Applying every advanced AI engineering practice to every feature by default", "Judgment - weighing which tools and safeguards genuinely fit a specific product's actual stakes", "Always choosing the most complex architecture available", "Avoiding AI features entirely unless absolutely necessary"], correct: 1 },
  ],
};

// Wire this course into the shared registry (COURSE_CONTENT is declared in
// data.js, loaded before this file - we're adding to it, not replacing it).
COURSE_CONTENT["ai-eng"] = {
  entry: {
    basic: AIENG_ENTRY_BASIC,
    intermediate: AIENG_ENTRY_INTERMEDIATE,
    advanced: AIENG_ENTRY_ADVANCED,
    quiz: AIENG_QUIZ_BANK,
  },
  professional: {
    basic: AIENG_PRO_BASIC,
    intermediate: AIENG_PRO_INTERMEDIATE,
    advanced: AIENG_PRO_ADVANCED,
    quiz: AIENG_PRO_QUIZ_BANK,
  },
  master: {
    basic: AIENG_MASTER_BASIC,
    intermediate: AIENG_MASTER_INTERMEDIATE,
    advanced: AIENG_MASTER_ADVANCED,
    quiz: AIENG_MASTER_QUIZ_BANK,
  },
};
