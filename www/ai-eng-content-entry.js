// =========================================================================
// AI Engineering - Entry Level
// =========================================================================
// Hands-on examples use a fictional, generic LLM API (https://api.inferly.dev)
// via the same simulated terminal the Cloud Computing and APIs courses use -
// real request/response shapes, realistic canned output, not a live model.
// This course is intentionally vendor-neutral: the underlying concepts
// (tokens, prompts, embeddings, RAG) work essentially the same way across
// every major LLM provider, so nothing here is tied to one company's API.
// =========================================================================
const AIENG_ENTRY_BASIC = [
  {
    title: "What is AI engineering?",
    body: "AI engineering is the practice of building real, working applications on top of existing AI models - calling an LLM's API, designing prompts, handling its output, connecting it to real data - as opposed to AI research or data science, which focus on building and training the models themselves. An AI engineer generally doesn't train a model from scratch; they take a model that already exists, accessed through an API, and figure out how to use it reliably inside a real product - a support chatbot, a document summarizer, a coding assistant. This is a genuinely different, more applied skill set than the math-and-statistics-heavy work of machine learning research, much closer in practice to regular software engineering, with a probabilistic, sometimes-unpredictable component layered on top.",
    altExplain: "AI engineering builds applications on top of existing AI models (calling an API, designing prompts, handling output) rather than researching or training the models themselves - much closer to regular software engineering than to ML research.",
    visual: null,
    keyTakeaway: "AI engineering is applied: using an existing model reliably inside a real product, not training or researching models from scratch - a different, more software-engineering-flavored skill set.",
    commonMistake: "Assuming AI engineering requires deep machine learning research expertise - most of the job is closer to regular API-driven software engineering, with prompt design and output handling as the AI-specific layer on top.",
  },
  {
    title: "What is a large language model, practically speaking?",
    body: "A large language model (LLM) is a model trained on enormous amounts of text that predicts, one piece at a time, what text is likely to come next given what's come before - and it turns out that this simple-sounding task, done at a large enough scale, produces something that can answer questions, write code, summarize documents, and hold a conversation. From an engineering standpoint, the useful mental model isn't 'the model understands and thinks' in a human sense - it's 'given this input text, the model generates plausible, contextually appropriate output text', which is a genuinely useful practical framing even without resolving the deeper philosophical question of what's actually happening inside the model. This framing directly explains a lot of what AI engineering actually involves: since the model's output depends entirely on its input, most of the engineering work is about carefully constructing that input.",
    altExplain: "An LLM predicts likely next text given what came before, and at scale this produces genuinely useful behavior - answering questions, writing code, summarizing. The practical framing 'given this input, it generates plausible output' is what actually explains most AI engineering work.",
    visual: null,
    keyTakeaway: "Since an LLM's output depends entirely on its input, most of AI engineering is really about carefully constructing that input - which is exactly why prompting, covered next, is such a central skill.",
    commonMistake: "Treating an LLM's confident-sounding output as automatically correct - it's generating plausible, contextually appropriate text, which is very often correct but is a genuinely different guarantee than 'verified true'.",
  },
  {
    title: "Prompts: instructions and context",
    body: "A prompt is the text sent to an LLM to get a response - and how it's written has a real, direct effect on the quality of what comes back. A vague prompt like 'write about dogs' leaves the model to guess at length, tone, and focus; a specific one like 'write a 100-word paragraph for new dog owners about the importance of leash training, in a friendly tone' gives it far more to work with, and produces far more consistently useful output. Providing relevant context - background information, examples of the format wanted, constraints to follow - directly narrows down what a good response looks like, the same way giving a person clearer instructions produces more consistently useful results from them too.",
    altExplain: "A prompt is the text sent to get a response, and specificity matters directly - a vague prompt leaves the model guessing at length, tone, and focus, while a specific one with real context produces far more consistently useful output.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Which prompt is more likely to produce a consistently useful response?",
      options: ["\"Tell me about marketing\"", "\"Write 3 bullet points on why email marketing works well for a small local bakery, in a casual tone\"", "\"Marketing?\"", "Both are equally likely to work well"],
      correct: 1,
      explanation: "The second prompt gives specific constraints - format (3 bullets), topic (email marketing), audience (a small local bakery), and tone (casual) - all of which narrow down what a good response actually looks like, producing far more consistent, usable output than a vague one-word or one-phrase prompt.",
    },
    keyTakeaway: "Specificity in a prompt - format, tone, constraints, relevant context - directly narrows down what a good response looks like, the same way clearer instructions produce more consistent results from a person too.",
    commonMistake: "Writing a vague prompt and blaming the model when the response comes back unfocused or generic - the fix is very often a more specific prompt, not a fundamentally different or more powerful model.",
  },
  {
    title: "Tokens: how models actually read text",
    body: "An LLM doesn't process text character by character or word by word - it breaks text into tokens, chunks that are often close to a word but sometimes a fraction of one, or a single punctuation mark. \"unbelievable\" might become a few different tokens rather than one, and this matters practically for two direct reasons: LLM APIs are typically priced per token processed, on both the input sent and the output generated, so token count has a real, direct cost; and every model has a maximum context window, a hard limit on how many tokens it can consider at once (input plus output combined) - exceed it and older content gets dropped or the request fails outright, not gracefully truncated with a helpful warning.",
    altExplain: "LLMs process text in tokens (roughly word-sized chunks), not characters or whole words. This matters directly for cost (usually priced per token) and for context window limits (a hard cap on tokens per request) - both very concrete, practical constraints.",
    visual: null,
    keyTakeaway: "Token count is a direct, concrete constraint - it drives both API cost and the hard context window limit, not just an internal implementation detail that can be safely ignored.",
    commonMistake: "Assuming a model's context window is measured in words or characters rather than tokens - a rough rule of thumb is about 4 characters per token in English, but it varies enough that this is only ever an estimate, not a precise instrument.",
  },
  {
    title: "Temperature and other generation settings",
    body: "Temperature controls how much randomness goes into an LLM's output - a low temperature (near 0) makes the model consistently pick the most likely next token, producing more focused, repeatable, predictable output; a higher temperature allows more variety and creativity, at the direct cost of more inconsistency and a higher chance of a genuinely odd or off-track response. A factual lookup task, or code generation where correctness matters far more than variety, generally wants a low temperature; creative writing, brainstorming, or generating several genuinely different variations of something generally benefits from a higher one. This is a real, deliberate setting to tune per use case, not a fixed default that suits every kind of task equally well.",
    altExplain: "Temperature controls randomness in output. Low temperature = consistent, focused, predictable (good for facts, code). Higher temperature = more variety and creativity, at the cost of consistency (good for brainstorming, creative writing).",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A team is building a tool that extracts structured data (names, dates, amounts) from invoices, where correctness and consistency matter far more than variety. What temperature setting best fits this task?",
      options: ["A high temperature, for maximum creativity", "A low temperature, close to 0, for consistent and predictable extraction", "Temperature doesn't affect this kind of task at all", "The highest temperature the API allows"], correct: 1,
      explanation: "Structured data extraction is exactly the kind of task where consistency and correctness matter far more than variety - a low temperature setting produces the more focused, predictable, repeatable output this task actually needs.",
    },
    keyTakeaway: "Temperature is a real, deliberate tradeoff to set per task - low for consistency-critical work, higher for creative or exploratory work - not a single universal default.",
    commonMistake: "Leaving temperature at whatever the API's default happens to be for every task, rather than deliberately tuning it based on whether a given task actually needs consistency or benefits from variety.",
  },
  {
    title: "System prompts vs user prompts",
    body: "Most LLM APIs distinguish between a system prompt - instructions that set the model's overall behavior, role, and constraints for an entire conversation - and user prompts, the specific messages exchanged within it. A system prompt like \"You are a helpful customer support assistant for a software company. Keep responses under 100 words and never discuss pricing\" establishes standing rules that apply throughout, while each individual user message is the specific question or request within that already-established context. This separation exists specifically so an application can reliably set behavior once, rather than having to repeat the same instructions and constraints inside every single user message sent.",
    altExplain: "A system prompt sets standing behavior, role, and constraints for an entire conversation, set once. User prompts are the specific individual messages within it - this separation avoids repeating the same instructions in every message.",
    visual: null,
    refBox: {
      syntax: "system: standing role/constraints (set once)   |   user: the specific message",
      desc: "System prompts establish overall behavior for a conversation; user prompts are the individual exchanges within it.",
      example: "system: \"You are a concise support assistant.\"  user: \"How do I reset my password?\"",
    },
    keyTakeaway: "A system prompt is set once and applies throughout a conversation - the right place for standing rules, not something to repeat inside every individual user message.",
    commonMistake: "Putting standing behavioral instructions (tone, role, constraints) inside every individual user message instead of the system prompt - wastes tokens repeating the same thing, and is easy to accidentally omit on some messages but not others.",
  },
  {
    title: "Structured output (asking for JSON)",
    body: "An LLM's default output is free-form text, which is exactly what's wanted for a chat response, but not for output that needs to be reliably parsed and used by other code afterward. Many LLM APIs support a structured output mode, where the request specifies an exact schema (field names and types) the response must follow, and the model is constrained to produce valid JSON matching that shape - rather than hoping a plain-text request like \"please respond in JSON\" is followed correctly every single time, which it usually is, but not with the reliability real production code needs. This matters directly for any application that needs to take an LLM's output and feed it straight into other code - extracting specific fields, populating a database, triggering an action - without a human reading and interpreting free text in between.",
    altExplain: "Structured output mode constrains a model's response to match an exact schema (specific fields and types) as valid JSON, rather than just hoping a plain-text request for JSON is followed reliably every time.",
    visual: null,
    cli: {
      hint: "curl -X POST -d '{\"prompt\":\"Extract name and age from: Ada is 32\",\"response_format\":\"json\"}' https://api.inferly.dev/generate",
      commands: {
        "curl -x post -d '{\"prompt\":\"extract name and age from: ada is 32\",\"response_format\":\"json\"}' https://api.inferly.dev/generate": "{ \"name\": \"Ada\", \"age\": 32 }",
      },
    },
    keyTakeaway: "Structured output mode is what makes an LLM's response reliably usable by other code directly - a plain-text request for JSON usually works, but 'usually' isn't the reliability guarantee real production systems need.",
    commonMistake: "Relying on a plain-text instruction like \"respond only in JSON\" for output that other code will parse automatically, instead of using an API's actual structured output mode when one is available - the plain-text approach is noticeably less reliable at scale.",
    challenge: {
      prompt: "Try extracting structured data from a sentence using the command above.",
      hint: "Type the exact command shown, including the response_format field.",
      solution: "curl -X POST -d '{\"prompt\":\"Extract name and age from: Ada is 32\",\"response_format\":\"json\"}' https://api.inferly.dev/generate",
    },
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "AI engineering vs ML research", desc: "Building applications on top of existing models, not training or researching models from scratch.", example: "Calling an API, designing prompts, handling output" },
      { syntax: "Prompt specificity", desc: "Format, tone, and context directly narrow down what a good response looks like.", example: "\"Write 3 bullets on X, casual tone\" beats \"Tell me about X\"" },
      { syntax: "Tokens", desc: "Word-ish chunks models actually process - drives both cost and context window limits.", example: "~4 characters per token in English, roughly" },
      { syntax: "Temperature", desc: "Low = consistent and predictable; high = more variety, less consistency.", example: "Low for facts/code, higher for brainstorming" },
      { syntax: "system vs user prompts", desc: "System sets standing behavior once; user messages are the individual exchanges.", example: "system: role/rules · user: the actual question" },
      { syntax: "Structured output (JSON mode)", desc: "Constrains a response to a specific schema, for output other code will parse directly.", example: "{ \"name\": \"Ada\", \"age\": 32 }" },
    ],
  },
];

// =========================================================================
// AI Engineering - Entry Level - Intermediate track
// =========================================================================
const AIENG_ENTRY_INTERMEDIATE = [
  {
    title: "Calling an LLM API",
    body: "Under the hood, using an LLM is just another API call, following the same request/response pattern this platform's own APIs course covers in depth - a POST request with a JSON body containing the prompt (or a list of messages, for a conversation) and settings like temperature, and a JSON response containing the generated text. curl -X POST -d '{\"messages\":[{\"role\":\"user\",\"content\":\"Say hello in French\"}]}' https://api.inferly.dev/chat sends a single user message and gets back the model's response in the response body, the same shape as calling any other web API. Everything covered in this platform's own APIs course - status codes, headers, authentication - applies here too; an LLM API is a genuine web API, not a fundamentally different kind of thing.",
    altExplain: "Using an LLM is just another API call - a POST with a JSON body (the prompt or messages, plus settings), and a JSON response with the generated text. Same request/response pattern as any other web API.",
    visual: null,
    cli: {
      hint: "curl -X POST -d '{\"messages\":[{\"role\":\"user\",\"content\":\"Say hello in French\"}]}' https://api.inferly.dev/chat",
      commands: {
        "curl -x post -d '{\"messages\":[{\"role\":\"user\",\"content\":\"say hello in french\"}]}' https://api.inferly.dev/chat": "{ \"response\": \"Bonjour !\", \"tokens_used\": 14 }",
      },
    },
    keyTakeaway: "An LLM API is a genuine web API, following the same request/response, status code, and authentication patterns as any other API - not a fundamentally different kind of thing to learn from scratch.",
    commonMistake: "Assuming LLM APIs need an entirely separate set of API skills - status codes, error handling, and authentication all work the same way here as for any other web API this platform's own APIs course already covers.",
    challenge: {
      prompt: "Try sending a chat message using the command above.",
      hint: "Type the exact command shown, including the messages array in the body.",
      solution: "curl -X POST -d '{\"messages\":[{\"role\":\"user\",\"content\":\"Say hello in French\"}]}' https://api.inferly.dev/chat",
    },
  },
  {
    title: "Streaming responses",
    body: "A long response can take several seconds to generate in full, and waiting for the entire thing before showing anything at all makes an application feel slow and unresponsive - streaming solves this by sending the response back in small pieces as they're generated, rather than all at once at the very end. This is exactly what produces the now-familiar experience of watching a chat response appear word by word, rather than popping in all at once after a delay - the underlying generation isn't actually any faster, but the perceived responsiveness is dramatically better, since something starts appearing almost immediately instead of leaving the user staring at nothing.",
    altExplain: "Streaming sends a response back in small pieces as they're generated, instead of waiting for the whole thing - this is what produces the word-by-word chat experience. Generation isn't actually faster, but it feels far more responsive.",
    visual: null,
    keyTakeaway: "Streaming is a perceived-responsiveness improvement, not an actual generation speed improvement - the total time to finish is roughly the same either way.",
    commonMistake: "Assuming streaming makes a model generate its response faster overall - it doesn't; it just delivers the same response incrementally instead of all at once, which feels faster without actually being faster.",
  },
  {
    title: "Function calling / tools",
    body: "An LLM on its own can only generate text - it can't check today's actual weather, look up a real order status, or send an email. Function calling (also called tool use) bridges this gap: the application describes available functions (name, purpose, expected parameters) to the model, and when a user's request needs one, the model responds not with plain text but with a structured request to call a specific function with specific arguments - the application's own code then actually runs that function and sends the result back to the model to continue. The model itself never executes anything directly; it only decides when a tool is needed and what arguments to call it with, while the actual execution stays firmly in the application's own code, under the application's own control.",
    altExplain: "Function calling lets an LLM request that specific application-defined functions be run, with specific arguments - the model decides when a tool is needed, but the application's own code is what actually executes it.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An LLM decides a user's question needs today's real weather, which it doesn't have access to on its own. What actually happens next in a function-calling setup?",
      options: ["The model makes up a plausible-sounding weather report", "The model requests a specific function call (like get_weather) with arguments, and the application's own code actually runs it and returns the real result", "The request simply fails", "The model connects directly to a weather service itself"], correct: 1,
      explanation: "This is exactly what function calling is for: the model can't check real-time data itself, so it requests that the application run a specific function (with specific arguments) on its behalf - the application's own code does the actual execution, then returns the real result back to the model.",
    },
    keyTakeaway: "The model only ever decides when a tool is needed and what arguments to call it with - the application's own code is what actually executes anything, staying firmly under the application's control.",
    commonMistake: "Assuming an LLM can directly access external systems, real-time data, or take real-world actions on its own - it can only request that the application's own code do so on its behalf, via function calling.",
  },
  {
    title: "Context windows and truncation",
    body: "Every model has a maximum context window - a hard cap on how many tokens it can consider in a single request, covered earlier in this course - and a long conversation or a large document can genuinely exceed it. When that happens, something has to give: older messages might get dropped from a conversation's history, a document might need to be split into smaller chunks processed separately, or the request might simply fail outright with an error, depending on how the application is built to handle it. This is exactly the problem retrieval-augmented generation, covered in this course's deep-dive module, exists to solve for large document collections specifically - rather than trying to fit everything into one request's context window at once.",
    altExplain: "Every model has a hard token limit per request. A long conversation or large document can exceed it, meaning older content gets dropped, a document gets split into chunks, or the request fails - depending on how the application handles it.",
    visual: null,
    keyTakeaway: "Exceeding a context window doesn't fail gracefully by default - what actually happens (dropped history, a hard error, chunked processing) depends entirely on how the application is specifically built to handle that case.",
    commonMistake: "Building an application that assumes a conversation or document will always comfortably fit within the model's context window, without a deliberate plan for what happens once it doesn't.",
  },
  {
    title: "Embeddings: turning text into numbers",
    body: "An embedding is a list of numbers (a vector) that represents a piece of text's meaning, produced by a separate kind of model built specifically for this - and the genuinely useful property is that text with similar meaning ends up with similar embedding vectors, even when the actual wording is completely different. \"a small dog\" and \"a tiny puppy\" would land close together in this vector space, despite sharing almost no words in common, while \"a small dog\" and \"tax law\" would land far apart. This numeric representation of meaning is exactly what makes searching by meaning (rather than exact keyword matching) possible at all - a genuinely different, more flexible kind of search than looking for literal matching words.",
    altExplain: "An embedding is a list of numbers representing a piece of text's meaning, where similar meanings land close together in that numeric space - even with completely different wording. This is what makes searching by meaning, not just exact words, possible.",
    visual: null,
    cli: {
      hint: "curl -X POST -d '{\"text\":\"a small dog\"}' https://api.inferly.dev/embed",
      commands: {
        "curl -x post -d '{\"text\":\"a small dog\"}' https://api.inferly.dev/embed": "{ \"embedding_preview\": [0.021, -0.184, 0.093, 0.041, -0.077], \"dimensions\": 1536, \"note\": \"showing first 5 of 1536 values\" }",
      },
    },
    keyTakeaway: "Embeddings capture meaning, not exact wording - two sentences with completely different words but similar meaning end up with similar embedding vectors, which is the whole point.",
    commonMistake: "Confusing embedding-based search (matching by meaning) with traditional keyword search (matching literal words) - they solve genuinely different problems, and a system sometimes benefits from combining both rather than picking just one.",
    challenge: {
      prompt: "Try generating an embedding for a short phrase using the command above.",
      hint: "Type the exact command shown.",
      solution: "curl -X POST -d '{\"text\":\"a small dog\"}' https://api.inferly.dev/embed",
    },
  },
  {
    title: "Vector search basics",
    body: "Once text has been converted into embeddings, finding the most relevant pieces of text for a given query becomes a matter of finding whichever stored embeddings are numerically closest to the query's own embedding - a vector database is built specifically to do this kind of similarity search efficiently, even across millions of stored vectors. \"Closest\" here is typically measured with cosine similarity, a way of comparing the angle between two vectors rather than their raw distance - two vectors pointing in almost the same direction are considered highly similar in meaning, regardless of their exact magnitude. This search-by-meaning capability, built on embeddings, is the foundational piece that retrieval-augmented generation - this course's deep-dive module - is built directly on top of.",
    altExplain: "A vector database finds stored embeddings that are numerically closest to a query's own embedding - typically measured with cosine similarity (comparing direction, not raw distance). This search-by-meaning is exactly what RAG, covered next, is built on top of.",
    visual: null,
    keyTakeaway: "Vector search finds the closest matches by meaning, not by exact text - the foundational capability that retrieval-augmented generation, this course's deep-dive module, is built directly on top of.",
    commonMistake: "Assuming vector search alone constitutes a complete AI application - it's specifically the retrieval half of a larger pattern (RAG, covered next), typically paired with an LLM that actually uses what was retrieved to generate a real answer.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "POST /chat with messages[]", desc: "An LLM API is a genuine web API - same request/response pattern as any other.", example: "curl -X POST -d '{\"messages\":[...]}' .../chat" },
      { syntax: "Streaming", desc: "Delivers a response incrementally as it's generated - improves perceived speed, not actual generation time.", example: "The word-by-word chat experience" },
      { syntax: "Function calling / tools", desc: "The model requests a function call; the application's own code actually executes it.", example: "Model requests get_weather(city), app runs it" },
      { syntax: "Context window limits", desc: "A hard token cap per request - what happens when exceeded depends on how the app handles it.", example: "Dropped history, chunking, or a hard error" },
      { syntax: "Embeddings", desc: "Numeric vectors representing meaning - similar meaning lands close together, regardless of wording.", example: "\"small dog\" ≈ \"tiny puppy\" in vector space" },
      { syntax: "Vector search (cosine similarity)", desc: "Finds stored embeddings closest in meaning to a query - the foundation RAG is built on.", example: "Search by meaning, not exact keywords" },
    ],
  },
];

// =========================================================================
// Deep-dive module: Retrieval-Augmented Generation (RAG) (AI Engineering) -
// referenced by the isModuleStub entry at the top of AIENG_ENTRY_ADVANCED below.
// =========================================================================
MODULES["ai-rag"] = {
  id: "ai-rag",
  title: "Retrieval-Augmented Generation (RAG)",
  icon: "cpu",
  accent: "#4f46e5",
  tagline: "How to get an LLM to answer questions about your own data, correctly, without retraining anything.",
  whatYouLearn: [
    "Explain why RAG exists and what problem it actually solves",
    "Walk through the full RAG pipeline end to end",
    "Chunk documents sensibly for retrieval",
    "Explain the role of embeddings and a vector store in RAG",
    "Explain reranking and why an initial retrieval pass often isn't enough",
    "Spot the common failure modes that make a RAG system give wrong answers",
  ],
  lessons: [
    {
      title: "Why RAG exists",
      body: "An LLM's knowledge comes entirely from what it was trained on, which has two hard limits: a knowledge cutoff (it knows nothing about anything that happened after its training data was collected), and no access at all to private, internal data - a company's own documents, a specific customer's order history, internal policies - since none of that was ever part of its training data in the first place. Retraining a model to include new or private information is slow, expensive, and has to be repeated every time the underlying data changes, which makes it a poor fit for information that updates regularly. Retrieval-Augmented Generation (RAG) solves both problems at once with a much lighter-weight approach: instead of retraining, relevant information is retrieved from an external source at the moment of the question and included directly in the prompt, letting the model answer using current, private, or specific information it was never actually trained on.",
      altExplain: "An LLM only knows what it was trained on - nothing after its knowledge cutoff, and nothing private. Retraining to fix this is slow and expensive. RAG instead retrieves relevant info at question-time and includes it directly in the prompt.",
      visual: null,
      keyTakeaway: "RAG's core idea is retrieving relevant information at question-time and handing it to the model directly in the prompt, rather than the far slower and more expensive path of retraining the model itself.",
      commonMistake: "Assuming the only way to make an LLM 'know about' specific or current information is to retrain or fine-tune it - RAG solves the same problem far more cheaply and can be updated instantly, just by changing what's retrievable.",
    },
    {
      title: "The RAG pipeline at a glance",
      body: "A RAG system has two distinct phases. Indexing happens ahead of time, once (and again whenever the underlying documents change): documents get broken into smaller chunks, each chunk gets converted into an embedding, and those embeddings get stored in a vector database, ready to be searched later. Querying happens live, every time a user actually asks a question: the question itself gets embedded the same way, the vector store is searched for the most relevant chunks, those retrieved chunks get inserted into a prompt alongside the original question, and that combined, augmented prompt is what actually gets sent to the LLM to generate the final answer. Every lesson in the rest of this module goes deeper into one specific stage of this same two-phase pipeline.",
      altExplain: "Indexing (done ahead of time): chunk documents, embed each chunk, store in a vector database. Querying (done live, per question): embed the question, search for relevant chunks, insert them into the prompt, send that augmented prompt to the LLM.",
      visual: null,
      refBox: {
        syntax: "Indexing: chunk -> embed -> store   |   Querying: embed question -> retrieve -> augment prompt -> generate",
        desc: "The two-phase RAG pipeline - indexing happens ahead of time; querying happens live, per question.",
        example: "Indexing runs once per document; querying runs on every question",
      },
      keyTakeaway: "Indexing is a one-time (or occasional) setup cost; querying is what happens live on every single question - conflating the two, or trying to do indexing work on every query, is a common source of unnecessary slowness.",
      commonMistake: "Re-chunking and re-embedding an entire document collection on every single query instead of doing that work once during indexing and reusing the stored result - a genuinely expensive, unnecessary repeat of work that doesn't need to happen live.",
    },
    {
      title: "Chunking documents",
      body: "A whole document is usually too large and too broad to embed as one single unit - a 50-page manual embedded as a single chunk would match almost any question about the manual only vaguely, since its embedding represents an average of everything in it at once, none of it precisely. Chunking splits documents into smaller pieces first, each embedded and stored separately, so retrieval can find the one specific paragraph that actually answers a question rather than an entire vaguely-relevant document. Chunk size is a real, genuine tradeoff: chunks that are too small lose surrounding context (a sentence pulled with nothing around it can be ambiguous or misleading on its own), while chunks that are too large dilute relevance back toward the original whole-document problem - a few hundred words per chunk, often with a little overlap between consecutive chunks to avoid losing context right at a chunk boundary, is a common practical starting point.",
      altExplain: "Documents get split into smaller chunks (not embedded as one giant unit) so retrieval can find the specific relevant paragraph, not a vaguely-relevant whole document. Chunk size is a real tradeoff - too small loses context, too large dilutes relevance.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A RAG system embeds each entire 50-page manual as a single chunk. What problem does this most directly cause?",
        options: ["No problem - larger chunks always retrieve better", "Retrieval becomes imprecise, since one giant chunk's embedding represents an average of everything in it, matching questions only vaguely", "This makes indexing impossible", "This only affects very short documents"], correct: 1,
        explanation: "An embedding for an entire 50-page document ends up representing a broad average of everything inside it, which means it can only ever match a question vaguely - retrieval works far better with smaller chunks focused on one specific part of a document at a time.",
      },
      keyTakeaway: "Chunk size is a genuine tradeoff, not a setting with one universally correct answer - too small loses surrounding context, too large dilutes relevance back toward the whole-document problem RAG is meant to avoid.",
      commonMistake: "Splitting documents at a fixed character count with no regard for actual content boundaries (mid-sentence, mid-table), which can produce chunks that are confusing or incomplete on their own, even at a reasonable size.",
    },
    {
      title: "Embeddings and vector stores in RAG",
      body: "Embeddings and vector search, covered earlier in this course, are the specific mechanism RAG's retrieval step is built on - each document chunk gets embedded once during indexing, a user's question gets embedded the same way at query time, and the vector store finds whichever stored chunk embeddings are closest in meaning to the question's own embedding. This is exactly why RAG can find a relevant answer even when a question uses completely different wording than the source document - a question asking \"how do I get my money back\" can still retrieve a document chunk titled \"Refund Policy\" that never uses the word 'money' at all, because they're close together in meaning, not because they share matching keywords.",
      altExplain: "RAG's retrieval step is built directly on embeddings and vector search - each document chunk gets embedded once, and a question gets matched to the closest chunks by meaning, not by exact keyword overlap.",
      visual: null,
      keyTakeaway: "RAG can retrieve a relevant chunk even when a question's wording shares almost nothing with the source document's own wording - because retrieval matches by meaning, not by literal keyword overlap.",
      commonMistake: "Assuming RAG retrieval works like a keyword search under the hood, and being confused when relevant content gets retrieved despite sharing very few or no actual words with the question that found it.",
    },
    {
      title: "Retrieval: finding the right chunks",
      body: "The retrieval step returns some fixed number of the closest-matching chunks - often called top-k retrieval, where k is however many chunks get pulled (5 or 10, commonly). This number is a real, deliberate tradeoff, not an arbitrary setting: too few risks missing a genuinely relevant chunk that happened to rank just outside the cutoff; too many adds irrelevant content into the prompt, which both wastes tokens (a real cost, covered earlier in this course) and can genuinely confuse the model by burying the actually-relevant information among less relevant material. Getting this number right for a specific use case generally takes real experimentation against actual questions, not just picking a commonly-cited default and assuming it's automatically the right fit.",
      altExplain: "Retrieval pulls a fixed number of closest-matching chunks (top-k). Too few risks missing something relevant; too many wastes tokens and can bury the relevant content among less relevant material. The right number takes real experimentation.",
      visual: null,
      keyTakeaway: "Top-k is a genuine tradeoff between missing relevant content and diluting the prompt with irrelevant content - not a fixed default number that automatically fits every use case.",
      commonMistake: "Assuming a higher top-k (retrieving more chunks) is always safer, without accounting for the real cost of burying genuinely relevant content among a larger volume of less relevant material in the same prompt.",
    },
    {
      title: "Building the augmented prompt",
      body: "Once relevant chunks are retrieved, they need to actually be assembled into a prompt the LLM can use - typically the retrieved chunks go into the system prompt or an early part of the conversation, clearly separated from the user's actual question, often with explicit instructions like \"answer using only the information below; if the answer isn't in it, say you don't know.\" That last instruction matters more than it might first seem: without it, a model will often fall back on its own general training knowledge when the retrieved chunks don't actually contain the answer, producing a response that sounds confident but was never actually grounded in the retrieved data at all - defeating much of the point of using RAG in the first place.",
      altExplain: "Retrieved chunks get inserted into the prompt, clearly separated from the question, usually with an explicit instruction to answer only using that information (and say so if it's not there) - without that, the model can fall back on ungrounded general knowledge.",
      visual: null,
      keyTakeaway: "An explicit instruction to answer only from the retrieved content - and to say so when it isn't there - is what keeps a RAG system's answers genuinely grounded, rather than quietly falling back on the model's own general knowledge.",
      commonMistake: "Inserting retrieved chunks into a prompt without any instruction constraining the model to actually use them, letting it silently fall back on its own general training knowledge whenever the retrieved content doesn't fully answer the question.",
    },
    {
      title: "Reranking",
      body: "Initial retrieval (top-k vector search) is fast but comparatively rough - a separate, typically slower and more precise model, called a reranker, can then take that initial set of candidates and score them more carefully against the actual question, reordering them by genuine relevance. This two-stage approach - fast, rough retrieval first to narrow down a large collection to a manageable handful of candidates, then a slower, more careful reranking pass on just that smaller set - gets the benefits of both: the speed needed to search a large collection at all, and the precision needed to actually surface the truly best matches at the very top, rather than settling for 'roughly good enough' from the fast pass alone.",
      altExplain: "Reranking is a second, more careful pass: fast vector search first narrows a large collection down to a handful of candidates, then a slower, more precise reranker model reorders just that smaller set by genuine relevance.",
      visual: null,
      keyTakeaway: "Reranking is deliberately a two-stage approach - fast-but-rough retrieval to narrow down a large collection, then slow-but-precise reranking on just the smaller resulting set - getting both speed and precision rather than sacrificing one for the other.",
      commonMistake: "Assuming a reranking step is unnecessary once vector search retrieval already returns 'reasonable-looking' results - reranking specifically improves the ordering and precision of an already-reasonable set, not fixing a broken one.",
    },
    {
      title: "Common RAG failure modes",
      body: "A RAG system can fail in a few genuinely distinct, recognizable ways. Retrieval failure means the relevant chunk was never even found in the first place - the top-k search simply didn't surface it, often due to chunking or embedding quality issues covered earlier in this module. Generation failure means the right chunk was retrieved successfully, but the model still produced a wrong or ungrounded answer anyway - not using the provided context correctly, or overriding it with its own general knowledge. Stale data means the underlying documents changed, but the vector store was never re-indexed to reflect that change, so retrieval keeps confidently returning outdated information. Diagnosing which of these three is actually happening in a specific failing case - not just noticing 'the RAG system gave a wrong answer' - is what actually determines the right fix, since each has a genuinely different solution.",
      altExplain: "Retrieval failure: the relevant chunk was never found. Generation failure: the right chunk was retrieved but the model still answered wrong. Stale data: the source changed but wasn't re-indexed. Each needs a different fix - diagnosing which one is happening matters.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A RAG system gives a wrong answer. Checking the logs shows the correct, relevant document chunk actually WAS successfully retrieved and included in the prompt - but the final answer still ignored it. Which failure mode does this describe?",
        options: ["Retrieval failure", "Generation failure", "Stale data", "This isn't actually a failure"], correct: 1,
        explanation: "Since the correct chunk was successfully retrieved and included in the prompt, retrieval itself worked correctly - the problem is downstream, in how the model used (or failed to use) that provided context when generating its answer. That's a generation failure, not a retrieval or staleness problem, and it calls for a different fix (like a stronger grounding instruction).",
      },
      keyTakeaway: "Retrieval failure, generation failure, and stale data are three genuinely different problems with three genuinely different fixes - diagnosing which one actually happened matters more than just noticing the final answer was wrong.",
      commonMistake: "Responding to any wrong RAG answer by tweaking retrieval settings (like top-k) by default, without first checking whether the actual problem was retrieval at all, or a generation or staleness issue that a retrieval tweak wouldn't fix.",
    },
    {
      title: "Evaluating a RAG system",
      body: "A RAG system's quality genuinely needs to be measured on two separate axes, not just one overall 'does it seem to work' impression. Retrieval quality asks whether the actually-relevant chunks get found at all - measurable directly by checking, for a set of known test questions with known correct source documents, whether the right chunk shows up in the retrieved results. Generation quality asks whether the final answer is actually correct and properly grounded in what was retrieved, separate from whether retrieval itself worked. Building a small, deliberate test set of realistic questions with known correct answers, and checking both of these separately rather than only eyeballing a handful of example outputs, is what turns 'this seems to work okay' into an actual, defensible measurement of quality.",
      altExplain: "RAG quality needs measuring on two separate axes: did retrieval find the right chunks at all, and separately, was the final answer actually correct and grounded in what was retrieved. A real test set with known answers turns 'seems okay' into an actual measurement.",
      visual: null,
      keyTakeaway: "Retrieval quality and generation quality are separate measurements - a system can have excellent retrieval and poor generation, or vice versa, and conflating the two into one vague impression hides which part actually needs fixing.",
      commonMistake: "Evaluating a RAG system by informally trying a handful of questions and eyeballing whether the answers seem reasonable, rather than building a real test set with known correct answers to measure retrieval and generation quality separately and consistently.",
    },
    {
      title: "Practice: designing a RAG pipeline for a scenario",
      body: "Designing a real RAG system means working through this module's stages together for one specific, concrete use case, not applying a single generic template to every situation. A company wanting to answer employee questions from a large, frequently-updated internal policy wiki needs a pipeline with fairly small chunks (policies are often precise and narrow), an indexing process that re-runs regularly to stay current with frequent edits, a moderate top-k with reranking (since policy questions can be subtly ambiguous, and precision genuinely matters), and a strict grounding instruction (since giving confidently wrong policy information is a genuinely worse outcome than saying \"I don't know, please check with HR\"). Every stage covered in this module - chunking, retrieval, reranking, prompt construction, evaluation - is a dial to set deliberately based on the specific data and stakes of a specific use case, not a fixed pipeline that looks identical regardless of what it's actually being built for.",
      altExplain: "Designing a real RAG system means setting every stage's dials - chunk size, indexing frequency, top-k, reranking, grounding strictness - deliberately for one specific use case's actual data and stakes, not applying one generic template everywhere.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A RAG system answers employee questions from an internal HR policy wiki, where giving a confidently wrong policy answer would be a genuinely bad outcome. Which design choice best fits this specific requirement?",
        options: ["A loose grounding instruction, letting the model fill in gaps with its own general knowledge", "A strict grounding instruction, having the model explicitly say it doesn't know rather than guess when the retrieved content doesn't cover the question", "Skipping reranking entirely to save on complexity", "Using the largest possible chunks to guarantee more context"], correct: 1,
        explanation: "When a confidently wrong answer is a genuinely worse outcome than an honest 'I don't know', a strict grounding instruction - explicitly telling the model to admit uncertainty rather than fill gaps with its own general knowledge - is exactly the right dial to set for this specific use case's actual stakes.",
      },
      keyTakeaway: "Designing a RAG pipeline is weighing this module's stages against one specific use case's actual data and stakes - not selecting a single default configuration and applying it everywhere regardless of what's actually at risk.",
      commonMistake: "Building every RAG system with the same default chunking, retrieval, and grounding settings regardless of the specific use case - a low-stakes FAQ bot and a policy-answering system genuinely warrant different tradeoffs.",
    },
  ],
};

// =========================================================================
// AI Engineering - Entry Level - Advanced track
// =========================================================================
const AIENG_ENTRY_ADVANCED = [
  { isModuleStub: true, moduleId: "ai-rag" },
  {
    title: "Evaluating LLM outputs",
    body: "Unlike traditional software, where a test either passes or fails deterministically, an LLM's output is naturally variable, which makes evaluation a genuinely different problem. A common practical approach is building a test set of realistic inputs paired with either a known correct answer or a clear rubric for what a good answer looks like, then checking actual outputs against that set - sometimes with simple automated checks (does the output contain the expected fact, is it valid JSON matching the expected schema), and sometimes using another LLM call specifically to judge the quality of a first model's output against defined criteria, an approach often called LLM-as-judge. Whichever method is used, the underlying goal is the same: turning 'this seems to work' into a repeatable, trackable measurement that can actually show whether a change to a prompt or pipeline made things better or worse.",
    altExplain: "LLM output is naturally variable, unlike deterministic software tests. Evaluation means building a test set with known-good answers or a rubric, then checking outputs against it - sometimes with automated checks, sometimes using another LLM call to judge quality (LLM-as-judge).",
    visual: null,
    keyTakeaway: "The goal of evaluation is turning a vague 'this seems to work' into a repeatable, trackable measurement - specifically so a change to a prompt or pipeline can be shown to actually help or hurt, not just assumed to.",
    commonMistake: "Judging whether a prompt change 'worked' by trying it a few times and eyeballing the results, rather than running it against a consistent test set that can actually show whether it made things measurably better or worse.",
  },
  {
    title: "Guardrails and safety basics",
    body: "A production AI application needs deliberate safeguards around both what goes in and what comes out, not just trust that a capable model will always behave exactly as intended. Input-side guardrails filter or catch attempts to manipulate a model into ignoring its own instructions (broadly called prompt injection) - text within a user's own input, or even within a retrieved document in a RAG system, deliberately crafted to override the system prompt's original instructions. Output-side guardrails check a model's response before it ever reaches an end user - filtering harmful content, catching a structured-output response that doesn't actually match its expected schema, or blocking a response that reveals something it shouldn't (like the system prompt's own exact wording, or another user's data). Neither of these is a single one-time setting; both need active, ongoing attention as an application, its users, and the ways it gets used all continue to genuinely evolve.",
    altExplain: "Input guardrails catch attempts to manipulate a model into ignoring its instructions (prompt injection). Output guardrails check a response before it reaches a user - harmful content, a broken schema, or something revealed that shouldn't be. Both need ongoing attention, not a one-time setup.",
    visual: null,
    keyTakeaway: "Guardrails belong on both ends - filtering what goes in and checking what comes out - and both need active, ongoing attention as an application and how it gets used genuinely continue to evolve.",
    commonMistake: "Assuming a well-written system prompt alone is sufficient protection against misuse - a system prompt is instructions, not enforcement, and a genuinely determined attempt to override it can still work without additional guardrails actively checking both input and output.",
  },
  {
    title: "Cost and latency tradeoffs",
    body: "Real AI applications have to weigh cost, speed, and quality against each other deliberately, since improving one often genuinely costs something on the others. A larger, more capable model generally produces better output but costs more per token and responds more slowly; a smaller, faster model costs less and responds quicker but may need more careful prompting, or simply won't perform as well on genuinely difficult tasks. A common practical pattern is routing: using a smaller, cheaper, faster model for simple requests, and reserving a larger, more expensive model specifically for requests that are genuinely more complex or that the smaller model has already struggled with - rather than reflexively sending every single request to the most capable (and most expensive) model available by default.",
    altExplain: "Cost, speed, and quality trade off against each other - a bigger model is generally better but slower and more expensive; a smaller one is faster and cheaper but may struggle on harder tasks. Routing sends simple requests to a cheap model and complex ones to a bigger one.",
    visual: null,
    keyTakeaway: "Routing - matching request complexity to an appropriately-sized model, rather than defaulting every request to the most capable available model - is a common, practical way to manage the cost/speed/quality tradeoff deliberately.",
    commonMistake: "Defaulting every single request to the largest, most capable model available regardless of how simple the actual task is, paying for capability that a smaller, faster, cheaper model would have handled just as well.",
  },
  {
    title: "Fine-tuning vs prompting: when each makes sense",
    body: "Prompting - including RAG for retrieving relevant information - can get a general-purpose model to handle a huge range of specific tasks without ever changing the model itself, and it's fast to iterate on, since a prompt can be tweaked and tested again in seconds. Fine-tuning actually retrains a model further on task-specific examples, adjusting its underlying behavior directly - genuinely useful when a task needs a very particular, consistent style or format that prompting alone struggles to reliably produce, or when a task is narrow and repetitive enough that a smaller fine-tuned model can match a much larger general-purpose model's performance on that specific task at meaningfully lower ongoing cost. The practical rule of thumb: reach for prompting (and RAG, if the problem involves specific data) first, since it's dramatically faster and cheaper to try, and treat fine-tuning as a deliberate next step only once prompting has genuinely been pushed as far as it reasonably can go.",
    altExplain: "Prompting (including RAG) is fast to iterate and handles most tasks without changing the model. Fine-tuning retrains the model on task-specific examples - worth it for very particular style/format needs, or narrow repetitive tasks. Try prompting first; fine-tune only once that's genuinely been pushed as far as it can go.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A team wants their AI application to consistently follow a specific, unusual response format that careful prompting has struggled to reliably produce across many different inputs. What's a reasonable next step to consider?",
      options: ["Give up on the format entirely", "Consider fine-tuning on examples of the desired format, since prompting alone has already been genuinely pushed and is still struggling", "Immediately fine-tune before trying to prompt at all", "Switch to a completely different, unrelated approach"], correct: 1,
      explanation: "This is exactly the scenario where fine-tuning earns its cost: prompting has already been genuinely attempted and is still struggling with a specific, consistent format requirement. Fine-tuning on examples of the desired format directly addresses that gap, rather than continuing to push an approach (prompting) that's already shown its limits here.",
    },
    keyTakeaway: "Prompting first, fine-tuning only once prompting has genuinely been pushed as far as it reasonably can go - not because fine-tuning is inherently worse, but because it's a much larger investment to reach for before a cheaper option has been fully tried.",
    commonMistake: "Reaching for fine-tuning as a first step for a new task, before genuinely trying to solve it with careful prompting (and RAG, if it involves specific data) first - fine-tuning is a much larger investment that's rarely the right starting point.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Test set + LLM-as-judge", desc: "Turns 'this seems to work' into a repeatable, trackable measurement of output quality.", example: "Known inputs + expected answers/rubric, checked consistently" },
      { syntax: "Input + output guardrails", desc: "Filter what goes in (prompt injection) and check what comes out (harmful content, broken schema) - ongoing, not one-time.", example: "Neither is a single set-and-forget setting" },
      { syntax: "Routing (small model / big model)", desc: "Match request complexity to an appropriately-sized model instead of defaulting to the most capable one.", example: "Simple requests to a cheap model, hard ones to a bigger one" },
      { syntax: "Prompting/RAG first, fine-tuning later", desc: "Fine-tuning is a bigger investment, worth it once prompting has genuinely been pushed as far as it can go.", example: "Fine-tune for a specific, consistent format prompting can't reliably hit" },
    ],
  },
];

const AIENG_QUIZ_BANK = {
  basic: [
    { q: "How does AI engineering differ from AI/ML research?", options: ["There's no real difference", "AI engineering builds applications on top of existing models; research focuses on building and training the models themselves", "AI engineering only involves training new models", "AI engineering doesn't use APIs at all"], correct: 1 },
    { q: "What effect does prompt specificity have on output quality?", options: ["None at all", "More specific prompts (format, tone, context) directly narrow down what a good response looks like", "Vague prompts always produce better, more creative results", "Specificity only matters for code generation"], correct: 1 },
    { q: "What are tokens?", options: ["Individual characters only", "The word-ish chunks an LLM actually processes text as - driving both cost and context window limits", "A type of API key", "A measure of model accuracy"], correct: 1 },
    { q: "What does a low temperature setting produce?", options: ["More random, creative output", "More consistent, focused, predictable output", "Faster API responses", "Longer responses"], correct: 1 },
    { q: "What's the difference between a system prompt and a user prompt?", options: ["They're the same thing", "A system prompt sets standing behavior for a whole conversation; user prompts are the individual messages within it", "System prompts are only for error messages", "User prompts are set once per application"], correct: 1 },
  ],
  intermediate: [
    { q: "What does streaming actually improve?", options: ["The total time to generate a full response", "Perceived responsiveness, by delivering the response incrementally instead of all at once", "The model's accuracy", "The cost per token"], correct: 1 },
    { q: "In function calling, who actually executes the requested function?", options: ["The LLM itself, directly", "The application's own code, based on the model's request", "A third-party service automatically", "Function calling doesn't involve execution"], correct: 1 },
    { q: "What is an embedding?", options: ["A type of API authentication", "A list of numbers representing a piece of text's meaning, where similar meanings land close together", "A compressed version of a prompt", "A model's training dataset"], correct: 1 },
    { q: "What does vector search typically use to measure 'closeness' between embeddings?", options: ["Alphabetical order", "Cosine similarity, comparing the angle between vectors", "File size", "Exact keyword matches"], correct: 1 },
    { q: "What happens when a context window is exceeded?", options: ["Nothing, it's automatically handled by all APIs the same way", "It depends on the application - dropped history, chunking, or a hard error, depending on how it's built", "The model automatically retrains itself", "Responses become free"], correct: 1 },
  ],
  advanced: [
    { q: "What problem does RAG directly solve?", options: ["Making models generate text faster", "Answering questions using current or private information the model was never trained on, without retraining it", "Reducing the cost of every API call", "Making prompts shorter"], correct: 1 },
    { q: "Why does chunk size matter in RAG?", options: ["It doesn't - any chunk size works equally well", "Too small loses context; too large dilutes relevance - it's a genuine tradeoff", "Larger chunks are always better", "Chunk size only affects storage cost"], correct: 1 },
    { q: "What's the difference between retrieval failure and generation failure in RAG?", options: ["They're the same problem", "Retrieval failure means the right chunk was never found; generation failure means it was found but the model still answered wrong", "Retrieval failure only happens with small documents", "Generation failure means the API is down"], correct: 1 },
    { q: "What does reranking add on top of initial vector search retrieval?", options: ["Nothing, it's redundant", "A slower, more precise second pass that reorders an initial candidate set by genuine relevance", "It replaces vector search entirely", "It only works for very small document collections"], correct: 1 },
    { q: "When does fine-tuning generally make more sense than prompting?", options: ["Always, as a first step for any new task", "Once prompting has genuinely been pushed as far as it can go, especially for a very particular, consistent format", "Never - prompting always works better", "Only for extremely large models"], correct: 1 },
  ],
};

// Wire this course into the shared registry (COURSE_CONTENT is declared in
// data.js, loaded before this file - we're adding to it, not replacing it).
// Professional and Master levels use emptyLevel() for now - the UI shows
// them as "coming soon" until lessons are added, same pattern the API
// course used while it was still being built out.
COURSE_CONTENT["ai-eng"] = {
  entry: {
    basic: AIENG_ENTRY_BASIC,
    intermediate: AIENG_ENTRY_INTERMEDIATE,
    advanced: AIENG_ENTRY_ADVANCED,
    quiz: AIENG_QUIZ_BANK,
  },
  professional: emptyLevel(),
  master: emptyLevel(),
};
