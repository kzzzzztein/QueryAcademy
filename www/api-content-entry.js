// =========================================================================
// APIs - Entry Level
// =========================================================================
// Every hands-on example in this course uses the same fictional service,
// the TaskFlow API (https://api.taskflow.dev), a simple task-management
// backend with one main resource: tasks. This mirrors how the SQL course
// reuses one employees/orders dataset throughout - one consistent domain,
// so the shape of the data never has to be relearned lesson to lesson.
// =========================================================================
const API_ENTRY_BASIC = [
  {
    title: "What is an API?",
    body: "An API (Application Programming Interface) is a defined way for one piece of software to ask another piece of software to do something or hand over some data, without either side needing to know how the other one is actually built inside. A weather app on your phone doesn't run its own network of weather sensors - it sends a request to a weather API, which hands back the current forecast as data the app can display. The API is the contract: it defines exactly what requests are allowed, what information they need, and what shape the response will come back in - everything on either side of that contract is free to change, as long as the contract itself stays the same. This course focuses specifically on web APIs, which use HTTP - the same protocol your browser uses to load web pages - to send those requests and responses over the internet.",
    altExplain: "An API is a defined way for one program to ask another program for something, without needing to know how it works internally - like a weather app asking a weather service for today's forecast.",
    visual: null,
    keyTakeaway: "An API is a contract - what requests are allowed and what shape the response takes - that lets two separate systems work together without either needing to know the other's internal details.",
    commonMistake: "Assuming an API and a user interface (UI) are the same idea - a UI is built for a human to look at and click; an API is built for another program to call directly.",
  },
  {
    title: "Requests and responses",
    body: "Every interaction with a web API follows the same basic shape: your side sends a request, and the API sends back a response. A request names a method (what kind of action you want), a URL (which resource you're asking about), and optionally some headers and a body with more detail. The response comes back with a status code (whether it worked, and roughly why if not), its own headers, and usually a body containing the actual data you asked for. curl is a command-line tool for sending these requests directly, without needing to write any actual application code - it's what this course uses throughout to practice real requests and see real responses.",
    altExplain: "You send a request (what you want, and from where); the API sends back a response (whether it worked, and the data you asked for). curl is a tool for sending these requests directly from the command line.",
    visual: null,
    cli: {
      hint: "curl https://api.taskflow.dev/tasks",
      commands: {
        "curl https://api.taskflow.dev/tasks": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"open\" },\n  { \"id\": 3, \"title\": \"Update dependencies\", \"status\": \"open\" }\n]",
      },
    },
    keyTakeaway: "Every API interaction is one request out, one response back - there's no persistent connection in between, just this simple round trip.",
    commonMistake: "Expecting an API to somehow remember previous requests on its own - by default, each request is independent unless something (like a token, covered later in this course) explicitly carries context between them.",
    challenge: {
      prompt: "Try running 'curl https://api.taskflow.dev/tasks' in the simulated terminal below to see the response for yourself.",
      hint: "Type the exact command shown above into the terminal.",
      solution: "curl https://api.taskflow.dev/tasks",
    },
  },
  {
    title: "HTTP methods: GET, POST, PUT, DELETE",
    body: "The HTTP method tells the API what kind of action a request represents. GET asks for data without changing anything - it's the method behind almost every 'read' operation, like fetching a list of tasks. POST creates something new, like adding a fresh task to the list. PUT replaces an existing resource entirely with the data you send. DELETE removes a resource. This small set of methods, reused consistently across every resource an API exposes, is what makes REST APIs predictable to work with once you know the pattern - the method tells you the intent before you've even looked at the URL.",
    altExplain: "GET reads data without changing anything. POST creates something new. PUT replaces something that already exists. DELETE removes it. The method itself tells you the intent.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "You want to permanently remove a task from the system. Which HTTP method fits?",
      options: ["GET", "POST", "DELETE", "None of these"],
      correct: 2,
      explanation: "DELETE is specifically the method for removing a resource. GET only reads data, and POST is for creating something new - neither is meant to remove anything.",
    },
    keyTakeaway: "GET should never change data - if a request modifies something, it should use POST, PUT, PATCH, or DELETE instead, never GET.",
    commonMistake: "Using GET for an action that changes data (like a 'delete' link that's actually a GET request) - this breaks the expectation that GET is always safe to retry or cache.",
  },
  {
    title: "URLs: paths and query parameters",
    body: "A request's URL has two main parts relevant to an API: the path, which identifies which resource you're asking about, and an optional query string, which adds filtering or other options. /tasks is the path for the whole tasks collection; /tasks/42 adds a specific ID to the path, narrowing it down to just one task. Everything after a ? in the URL is the query string, made up of key=value pairs joined with &, like ?status=done&limit=10 - these don't identify a different resource, they just adjust how the request against the existing resource should behave, like filtering the results down to only done tasks.",
    altExplain: "The path (like /tasks/42) identifies which resource you're asking about. The query string (after the ?) adds options like filtering, without changing which resource it is.",
    visual: null,
    cli: {
      hint: "curl \"https://api.taskflow.dev/tasks?status=done\"",
      commands: {
        "curl \"https://api.taskflow.dev/tasks?status=done\"": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" }\n]",
      },
    },
    refBox: {
      syntax: "/resource/id?key=value&key2=value2",
      desc: "The path identifies the resource (and optionally a specific item); the query string after ? adjusts the request without changing which resource it is.",
      example: "/tasks/42?fields=title,status",
    },
    keyTakeaway: "A path segment identifies WHAT you're asking about; a query parameter adjusts HOW that request behaves - mixing the two up is a common source of confusing API designs.",
    commonMistake: "Putting something that should be a query parameter into the path instead (like /tasks/status/done), which usually isn't a valid route at all unless the API was specifically built to expect it.",
    challenge: {
      prompt: "Try running the query-parameter example above in the terminal to see only the done task.",
      hint: "Type the exact curl command shown, including the quotes around the URL.",
      solution: "curl \"https://api.taskflow.dev/tasks?status=done\"",
    },
  },
  {
    title: "Status codes",
    body: "Every response comes back with a three-digit status code summarizing what happened, and the first digit tells you the general category before you even need to look up the specific number. 2xx means success - 200 OK is the general success code, 201 Created specifically confirms something new was made. 4xx means the request itself was the problem - 400 Bad Request for malformed input, 401 Unauthorized for missing or invalid credentials, 404 Not Found when the resource doesn't exist. 5xx means the problem was on the server's side, not yours - 500 Internal Server Error being the generic catch-all. Learning to recognize these categories at a glance, rather than memorizing every individual code, is what actually makes status codes useful day to day.",
    altExplain: "The first digit tells you the category: 2xx means it worked, 4xx means your request was the problem, 5xx means the server's side broke. Recognize the category before worrying about the exact number.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A request to fetch a task by an ID that doesn't exist in the system comes back with which status code?",
      options: ["200", "401", "404", "500"],
      correct: 2,
      explanation: "404 Not Found is specifically for a request that reached the server fine, but the resource being asked for genuinely doesn't exist. 401 would mean missing credentials, and 500 would mean a server-side failure, neither of which applies here.",
    },
    keyTakeaway: "2xx = it worked, 4xx = your request was the problem, 5xx = the server's problem - that category alone answers most 'what happened' questions before you look up the exact number.",
    commonMistake: "Treating every non-200 status code as an unexpected failure to panic over - a 404 for a resource that genuinely doesn't exist, or a 401 before logging in, is often the API working exactly as intended.",
  },
  {
    title: "Headers",
    body: "Headers carry metadata about a request or response - information about the message, separate from the actual content (the body) being sent. A request's Content-Type header tells the API what format the body is in (almost always application/json for modern APIs), while its Accept header tells the API what format you'd like the response back in. An Authorization header, covered in depth later in this course, carries credentials proving who's making the request. Headers are written as key: value pairs, sent alongside the request but separate from its body - curl adds them with a -H flag, once per header.",
    altExplain: "Headers are metadata about a request, separate from its actual content - like Content-Type (what format the body is in) or Authorization (who's making the request).",
    visual: null,
    cli: {
      hint: "curl -H \"Accept: application/json\" https://api.taskflow.dev/tasks",
      commands: {
        "curl -h \"accept: application/json\" https://api.taskflow.dev/tasks": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"open\" },\n  { \"id\": 3, \"title\": \"Update dependencies\", \"status\": \"open\" }\n]",
      },
    },
    refBox: {
      syntax: "curl -H \"Header-Name: value\" url",
      desc: "Adds a header to a curl request - use -H once per header, each as a \"Name: value\" pair.",
      example: "curl -H \"Content-Type: application/json\" https://api.taskflow.dev/tasks",
    },
    keyTakeaway: "Headers describe the request or response itself (format, credentials, caching); the body carries the actual data - the two are always kept separate.",
    commonMistake: "Putting data that belongs in the request body into a header instead (or vice versa) - headers are meant for metadata about the message, not the message's actual content.",
    challenge: {
      prompt: "Try running the Accept header example above in the terminal.",
      hint: "Type the exact curl command shown, with the -H flag and the header in quotes.",
      solution: "curl -H \"Accept: application/json\" https://api.taskflow.dev/tasks",
    },
  },
  {
    title: "JSON: the format APIs speak",
    body: "JSON (JavaScript Object Notation) is the format almost every modern API uses for request and response bodies, because it's lightweight, human-readable, and not tied to any one programming language despite the name. An object is a set of key-value pairs wrapped in curly braces, like { \"id\": 1, \"title\": \"Write proposal\", \"done\": false } - keys are always strings in double quotes, and values can be a string, a number, a boolean (true/false), null, another object, or an array. An array is an ordered list wrapped in square brackets, like [ 1, 2, 3 ] or a list of task objects like you've already seen in this course's example responses. Every mainstream programming language can parse JSON into its own native data structures and back again, which is exactly why it became the default choice for APIs to communicate in.",
    altExplain: "JSON is a lightweight, text-based format almost every API uses. Objects are key-value pairs in { }, arrays are ordered lists in [ ], and values can be strings, numbers, booleans, null, or nested objects/arrays.",
    visual: null,
    refBox: {
      syntax: "{ \"key\": \"string value\", \"key2\": 42, \"key3\": true, \"key4\": [1, 2, 3] }",
      desc: "A JSON object - keys are always double-quoted strings; values can be a string, number, boolean, null, array, or nested object.",
      example: "{ \"id\": 1, \"title\": \"Write proposal\", \"done\": false }",
    },
    keyTakeaway: "JSON keys must always be double-quoted strings - single quotes and unquoted keys are both invalid JSON, even though they're valid in some programming languages' own object syntax.",
    commonMistake: "Leaving a trailing comma after the last item in a JSON object or array - unlike some programming languages, standard JSON treats this as a syntax error, not something it silently ignores.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Request: method + URL + headers + optional body", desc: "What you send to an API.", example: "GET https://api.taskflow.dev/tasks" },
      { syntax: "GET / POST / PUT / DELETE", desc: "The core HTTP methods - read, create, replace, remove.", example: "DELETE /tasks/42" },
      { syntax: "/resource/id?key=value", desc: "Path identifies the resource; query string (after ?) adjusts the request.", example: "/tasks?status=done" },
      { syntax: "2xx / 4xx / 5xx", desc: "Status code categories - success, your request's problem, the server's problem.", example: "404 Not Found" },
      { syntax: "-H \"Name: value\"", desc: "Adds a header to a curl request - metadata separate from the body.", example: "curl -H \"Accept: application/json\" url" },
      { syntax: "{ \"key\": value }", desc: "JSON - the format almost every API uses for request and response bodies.", example: "{ \"title\": \"New task\", \"done\": false }" },
    ],
  },
];

// =========================================================================
// APIs - Entry Level - Intermediate track
// =========================================================================
const API_ENTRY_INTERMEDIATE = [
  {
    title: "Fetching a single resource with GET",
    body: "Adding an ID to a collection's path narrows a GET request down from every item to exactly one: GET /tasks returns the whole list, while GET /tasks/42 returns just the task with ID 42. If that ID doesn't exist, the API responds with a 404 rather than an empty or malformed success response - this is one of the most common request shapes you'll use against any REST API, since almost every resource in almost every API supports exactly this pattern. Getting comfortable with 'collection path for many, collection path plus an ID for one' covers a large share of the GET requests you'll ever need to write.",
    altExplain: "GET /tasks gets the whole list. GET /tasks/42 gets just task 42. If that ID doesn't exist, you get a 404 instead of an empty result.",
    visual: null,
    cli: {
      hint: "curl https://api.taskflow.dev/tasks/2",
      commands: {
        "curl https://api.taskflow.dev/tasks/2": "{ \"id\": 2, \"title\": \"Review pull request\", \"status\": \"open\", \"created_at\": \"2026-07-01T09:15:00Z\" }",
      },
    },
    keyTakeaway: "A single resource's response is usually one object; a collection's response is usually an array of objects - the shape itself tells you which one you're looking at.",
    commonMistake: "Assuming a missing resource returns an empty success response - a well-designed API returns a 404 instead, which is a meaningfully different signal than 'found nothing.'",
    challenge: {
      prompt: "Try fetching task 2 by running the command above in the terminal.",
      hint: "Type the exact command shown, with /2 at the end of the path.",
      solution: "curl https://api.taskflow.dev/tasks/2",
    },
  },
  {
    title: "Creating data with POST",
    body: "POST creates a new resource, and unlike GET, it sends a request body containing the data for the thing being created - curl attaches one with -d, and needs a Content-Type: application/json header so the API knows how to parse it. curl -X POST -H \"Content-Type: application/json\" -d '{\"title\":\"New task\"}' https://api.taskflow.dev/tasks sends a new task's title in the body; a successful response usually comes back as 201 Created, along with the newly created object - including a server-assigned ID that didn't exist before the request was made. The -X POST flag explicitly sets the method, since curl defaults to GET whenever no body or method is specified.",
    altExplain: "POST creates something new, and sends the new data in a request body (-d in curl). A successful POST usually returns 201 Created along with the new object, including its new ID.",
    visual: null,
    cli: {
      hint: "curl -X POST -H \"Content-Type: application/json\" -d '{\"title\":\"New task\"}' https://api.taskflow.dev/tasks",
      commands: {
        "curl -x post -h \"content-type: application/json\" -d '{\"title\":\"new task\"}' https://api.taskflow.dev/tasks": "{ \"id\": 4, \"title\": \"New task\", \"status\": \"open\", \"created_at\": \"2026-08-25T10:02:00Z\" }",
      },
    },
    refBox: {
      syntax: "curl -X POST -H \"Content-Type: application/json\" -d '{...}' url",
      desc: "Sends a POST request with a JSON body - -X sets the method, -H sets the content type, -d attaches the body.",
      example: "curl -X POST -d '{\"title\":\"Task\"}' https://api.taskflow.dev/tasks",
    },
    keyTakeaway: "A successful POST typically returns 201 Created, not 200 OK - the distinct code specifically confirms something new now exists.",
    commonMistake: "Forgetting the Content-Type: application/json header on a POST request - without it, some APIs won't correctly parse the body you sent, even though the JSON itself is perfectly valid.",
    challenge: {
      prompt: "Try creating a new task by running the POST command above in the terminal.",
      hint: "Type the exact command shown, including the -X POST flag, the header, and the -d body.",
      solution: "curl -X POST -H \"Content-Type: application/json\" -d '{\"title\":\"New task\"}' https://api.taskflow.dev/tasks",
    },
  },
  {
    title: "PUT vs PATCH: replacing vs updating",
    body: "PUT and PATCH both modify an existing resource, but they differ in how much of it you're expected to send. PUT replaces the entire resource - the body you send becomes the new complete version, so leaving out a field means that field is gone or reset, not left alone. PATCH updates only the specific fields you include, leaving everything else on the resource untouched - sending { \"status\": \"done\" } with PATCH changes just the status, while the same body sent with PUT could wipe out the task's title entirely, since PUT treats the body as the full replacement. This distinction trips up a lot of people early on, and picking the wrong one is a common way to accidentally lose data.",
    altExplain: "PUT replaces the whole resource with what you send - anything left out is gone. PATCH only changes the fields you include, leaving the rest alone.",
    visual: null,
    cli: {
      hint: "curl -X PATCH -H \"Content-Type: application/json\" -d '{\"status\":\"done\"}' https://api.taskflow.dev/tasks/2",
      commands: {
        "curl -x patch -h \"content-type: application/json\" -d '{\"status\":\"done\"}' https://api.taskflow.dev/tasks/2": "{ \"id\": 2, \"title\": \"Review pull request\", \"status\": \"done\", \"created_at\": \"2026-07-01T09:15:00Z\" }",
      },
    },
    keyTakeaway: "PUT sends the full resource as a replacement; PATCH sends only what's changing - using PUT with a partial body risks silently wiping out every field you left out.",
    commonMistake: "Using PUT with only the changed field, expecting the rest of the resource to stay the same the way PATCH would - PUT treats whatever you send as the complete new version.",
    challenge: {
      prompt: "Try marking task 2 as done using the PATCH command above, which only touches the status field.",
      hint: "Type the exact PATCH command shown, including the -X PATCH flag.",
      solution: "curl -X PATCH -H \"Content-Type: application/json\" -d '{\"status\":\"done\"}' https://api.taskflow.dev/tasks/2",
    },
  },
  {
    title: "Deleting data",
    body: "DELETE removes a resource, identified by its path just like a single-item GET: DELETE /tasks/42 removes task 42 specifically. A successful delete typically responds with either 200 OK and a small confirmation body, or 204 No Content, which confirms success without needing to send any body back at all, since there's nothing left to describe. Running the same DELETE request a second time against an ID that's already been removed returns a 404, not a repeated success - the resource genuinely isn't there anymore, and the API has no way (or reason) to pretend otherwise.",
    altExplain: "DELETE removes a resource by its ID in the path. A successful delete often returns 204 No Content, since there's nothing left to describe. Deleting the same ID twice returns a 404 the second time.",
    visual: null,
    cli: {
      hint: "curl -X DELETE https://api.taskflow.dev/tasks/3",
      commands: {
        "curl -x delete https://api.taskflow.dev/tasks/3": "204 No Content",
      },
    },
    keyTakeaway: "204 No Content is a genuine success response, not an error - it simply means the action worked and there's nothing meaningful left to send back.",
    commonMistake: "Treating a repeated DELETE on an already-removed resource as a bug because it now returns 404 instead of another success - that's the expected, correct behavior once the resource is actually gone.",
    challenge: {
      prompt: "Try deleting task 3 by running the command above in the terminal.",
      hint: "Type the exact command shown, with the -X DELETE flag.",
      solution: "curl -X DELETE https://api.taskflow.dev/tasks/3",
    },
  },
  {
    title: "Filtering, sorting, and paginating with query parameters",
    body: "Query parameters aren't just for simple filters like ?status=done - they're the standard way APIs let you shape a collection response without needing a different endpoint for every possible combination. Sorting is usually a sort parameter, often supporting a leading - for descending order, like ?sort=-created_at for newest first. Pagination limits how many results come back at once, typically with limit and offset (or a page number), like ?limit=10&offset=20 for the third page of 10 results each - essential once a collection grows too large to reasonably return in a single response. These parameters are typically combinable in a single request, like ?status=open&sort=-created_at&limit=5, each one narrowing or shaping the response independently of the others.",
    altExplain: "Query parameters can filter (?status=done), sort (?sort=-created_at for newest first), and paginate (?limit=10&offset=20) - and they combine together in a single request.",
    visual: null,
    cli: {
      hint: "curl \"https://api.taskflow.dev/tasks?status=open&sort=-created_at&limit=2\"",
      commands: {
        "curl \"https://api.taskflow.dev/tasks?status=open&sort=-created_at&limit=2\"": "[\n  { \"id\": 3, \"title\": \"Update dependencies\", \"status\": \"open\" },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"open\" }\n]",
      },
    },
    refBox: {
      syntax: "?filter=value&sort=-field&limit=n&offset=n",
      desc: "Query parameters combine to filter, sort, and paginate a collection response - each one shapes the result independently of the others.",
      example: "?status=open&sort=-created_at&limit=5",
    },
    keyTakeaway: "A - prefix on a sort field is a common (though not universal) convention for descending order - always check an individual API's docs rather than assuming.",
    commonMistake: "Requesting an entire large collection with no limit at all, when the API supports pagination - this is slow, wasteful, and some APIs will simply cap or reject the request outright.",
    challenge: {
      prompt: "Try running the combined filter/sort/limit example above in the terminal.",
      hint: "Type the exact command shown, including the quotes around the URL.",
      solution: "curl \"https://api.taskflow.dev/tasks?status=open&sort=-created_at&limit=2\"",
    },
  },
  {
    title: "Error responses and handling",
    body: "A well-designed API's error response is more than just a status code - the body usually explains what actually went wrong, in a consistent, predictable shape. A common pattern is a JSON object with an error or message field, and sometimes a machine-readable code alongside the human-readable description: { \"error\": \"validation_failed\", \"message\": \"title is required\" }. Reading this body, not just the status code, is what actually tells you how to fix a request - a 400 alone tells you something about your request was wrong, but the body tells you specifically what. Real client code should always check the status code first, then parse the error body for anything in the 4xx or 5xx range, rather than assuming every response is a success.",
    altExplain: "The status code tells you something went wrong; the error response body usually explains specifically what. Always check the status first, then read the body for anything 4xx or 5xx.",
    visual: null,
    cli: {
      hint: "curl -X POST -H \"Content-Type: application/json\" -d '{}' https://api.taskflow.dev/tasks",
      commands: {
        "curl -x post -h \"content-type: application/json\" -d '{}' https://api.taskflow.dev/tasks": "400 Bad Request\n{ \"error\": \"validation_failed\", \"message\": \"title is required\" }",
      },
    },
    keyTakeaway: "The status code tells you the category of problem; the error response body is where the actual, specific explanation usually lives.",
    commonMistake: "Only checking whether a request 'succeeded' in a broad try/catch sense, without actually reading the status code or error body - this makes it impossible to handle different failure types differently.",
    challenge: {
      prompt: "Try sending an empty task body (missing the required title) by running the command above.",
      hint: "Type the exact command shown, with an empty JSON object {} as the body.",
      solution: "curl -X POST -H \"Content-Type: application/json\" -d '{}' https://api.taskflow.dev/tasks",
    },
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "GET /tasks/42", desc: "Fetches a single resource by ID - returns 404 if it doesn't exist.", example: "curl https://api.taskflow.dev/tasks/2" },
      { syntax: "curl -X POST -H \"Content-Type: application/json\" -d '{...}' url", desc: "Creates a resource - usually returns 201 Created with the new object.", example: "curl -X POST -d '{\"title\":\"Task\"}' .../tasks" },
      { syntax: "PUT replaces the whole resource; PATCH updates only given fields", desc: "The key difference between the two update methods.", example: "PATCH -d '{\"status\":\"done\"}'" },
      { syntax: "curl -X DELETE url", desc: "Removes a resource - often returns 204 No Content on success.", example: "curl -X DELETE .../tasks/3" },
      { syntax: "?filter=value&sort=-field&limit=n&offset=n", desc: "Combines filtering, sorting, and pagination in one request.", example: "?status=open&sort=-created_at&limit=5" },
      { syntax: "{ \"error\": \"...\", \"message\": \"...\" }", desc: "A typical error response body - read it, not just the status code, to know how to fix a request.", example: "{ \"error\": \"validation_failed\" }" },
    ],
  },
];

// =========================================================================
// Deep-dive module: Authentication & Authorization (APIs) - referenced by
// the isModuleStub entry at the top of API_ENTRY_ADVANCED below.
// =========================================================================
MODULES["api-auth"] = {
  id: "api-auth",
  title: "Authentication & Authorization",
  icon: "lock",
  accent: "#6d3fc4",
  tagline: "Every common way an API verifies who's calling it, from a simple API key to a full OAuth 2.0 flow.",
  whatYouLearn: [
    "Explain why APIs need authentication and authorization at all",
    "Send an API key and use HTTP Basic Auth",
    "Understand Bearer tokens and the OAuth 2.0 authorization code flow",
    "Read a JWT's structure and know what refresh tokens are for",
    "Explain what request signing (HMAC) protects against",
    "Spot the auth mistakes that quietly create security holes",
  ],
  lessons: [
    {
      title: "Why APIs need authentication and authorization",
      body: "Authentication answers 'who is making this request' - proving an identity, usually with some kind of credential. Authorization answers a separate question that comes after: 'is this identity actually allowed to do this specific thing.' A logged-in user is authenticated the moment their credential checks out, but they might still be denied a specific action - deleting another user's data, say - because they're not authorized for it, even though the system knows exactly who they are. Without either one, any request to a private API endpoint would need to be treated as coming from a stranger with no permissions at all, which is obviously unworkable for anything beyond a fully public, read-only API.",
      altExplain: "Authentication proves who you are. Authorization decides what you're allowed to do, once your identity is known. They're two separate questions, checked in that order.",
      visual: null,
      keyTakeaway: "Authentication and authorization are two separate checks, in this order: first prove who you are, then check whether that identity is allowed to do this specific thing.",
      commonMistake: "Treating a successful login as automatic permission for everything - being authenticated just proves an identity; authorization still has to separately decide what that identity can actually do.",
    },
    {
      title: "API keys",
      body: "An API key is a single, usually long, randomly-generated string that identifies which application or account is making a request - the simplest form of authentication a web API can use. It's typically sent as a header (a common convention is X-API-Key, though the exact header name varies by API) or occasionally as a query parameter, and the API looks it up to know whose request this is and what they're allowed to access. API keys are simple to implement and simple to use, but they have a real weakness: anyone who obtains the key can use it exactly as freely as its rightful owner, with no separate password or second factor involved - which is why keeping them out of public source code and client-side JavaScript matters so much.",
      altExplain: "An API key is a single secret string identifying who's calling the API, usually sent as a header. Simple to use, but whoever has the key can use it exactly like the real owner - so it must stay secret.",
      visual: null,
      cli: {
        hint: "curl -H \"X-API-Key: tf_live_9f8a2b1c\" https://api.taskflow.dev/tasks",
        commands: {
          "curl -h \"x-api-key: tf_live_9f8a2b1c\" https://api.taskflow.dev/tasks": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"done\" }\n]",
        },
      },
      refBox: {
        syntax: "curl -H \"X-API-Key: <key>\" url",
        desc: "Sends an API key as a header - the exact header name varies by API, X-API-Key is a common convention.",
        example: "curl -H \"X-API-Key: tf_live_9f8a2b1c\" https://api.taskflow.dev/tasks",
      },
      keyTakeaway: "An API key proves WHICH application or account is calling, but on its own offers no per-user login - anyone holding the key has its full access.",
      commonMistake: "Committing an API key directly into source code or a public repository - once exposed, it should be treated as compromised and rotated (replaced) immediately, not just quietly hoped nobody notices.",
    },
    {
      title: "HTTP Basic Auth",
      body: "Basic Auth sends a username and password with every single request, packed into the Authorization header as Basic followed by those credentials joined with a colon and encoded in Base64 - Authorization: Basic dXNlcjpwYXNz decodes to user:pass. Base64 encoding is not encryption - it's trivially reversible by anyone who intercepts it - which is exactly why Basic Auth must always be used over HTTPS, never plain HTTP, so the connection itself is what actually protects the credentials in transit. Because it resends the raw password on every request and has no built-in concept of expiration or scope, Basic Auth has mostly been replaced by token-based approaches for anything beyond simple, low-stakes, or internal APIs.",
      altExplain: "Basic Auth sends a username:password pair, Base64-encoded, in every request's Authorization header. Base64 isn't encryption - it only works safely over HTTPS.",
      visual: null,
      cli: {
        hint: "curl -u admin:secret123 https://api.taskflow.dev/tasks",
        commands: {
          "curl -u admin:secret123 https://api.taskflow.dev/tasks": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"done\" }\n]",
        },
      },
      keyTakeaway: "Base64 is an encoding, not encryption - it's fully reversible by anyone, which is why Basic Auth is only ever safe to use over HTTPS.",
      commonMistake: "Assuming Base64-encoded credentials are somehow protected because they don't look like plain text - decoding Base64 back to the original username and password takes no special tools at all.",
    },
    {
      title: "Bearer tokens",
      body: "A Bearer token is an opaque string sent in the Authorization header as Authorization: Bearer <token>, and the name describes exactly how it works: whoever 'bears' (holds) the token is trusted, without the API re-checking a username and password on every request. The token itself is usually issued once, after a separate login step, and then reused for every subsequent request until it expires - avoiding the need to resend a raw password over and over the way Basic Auth does. This is the most common authentication pattern across modern APIs, and it's the foundation both OAuth 2.0 and JWTs, covered next in this module, build directly on top of.",
      altExplain: "A Bearer token is issued once after login, then sent in every later request's Authorization header - whoever holds it is trusted, without resending a password each time.",
      visual: null,
      cli: {
        hint: "curl -H \"Authorization: Bearer eyJhbGciOi...\" https://api.taskflow.dev/tasks",
        commands: {
          "curl -h \"authorization: bearer eyjhbgcioi...\" https://api.taskflow.dev/tasks": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"done\" }\n]",
        },
      },
      refBox: {
        syntax: "Authorization: Bearer <token>",
        desc: "The standard header format for token-based auth - the token was issued at login and is reused until it expires.",
        example: "curl -H \"Authorization: Bearer eyJhbGciOi...\" url",
      },
      keyTakeaway: "A Bearer token is 'bearer' in the literal sense - whoever holds it is trusted, so it needs the same careful handling as a password, not casual logging or exposure.",
      commonMistake: "Logging the full Authorization header (including the token) in application logs for debugging - anyone with access to those logs can then use the token exactly as the original holder could.",
    },
    {
      title: "OAuth 2.0: the authorization code flow",
      body: "OAuth 2.0 solves a specific problem: letting a third-party app access a piece of your data on another service, without ever handing that third-party app your actual password for that service. The most common flow works like this: the app redirects you to the real service's own login page (so your password only ever touches the real service, never the third-party app); after you log in and approve the specific access requested, that service redirects back to the app with a short-lived authorization code; the app then exchanges that code, behind the scenes, for an actual access token it can use on your behalf. 'Sign in with Google' buttons are OAuth 2.0 in practice - the third-party app never sees your Google password at any point in that flow.",
      altExplain: "OAuth 2.0 lets an app access your data on another service without ever seeing your password there. You log in on the real service's own page, approve access, and the app gets a token afterward - never your credentials directly.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A 'Sign in with Google' button lets a third-party app access your Google Calendar. At what point does that third-party app see your actual Google password?",
        options: ["When you type it into the app's own login form", "Never - you log in on Google's own page, and the app only ever receives a token afterward", "Only during the very first login", "The app receives it encrypted, then decrypts it later"],
        correct: 1,
        explanation: "That's the entire point of OAuth 2.0: your password is typed only into the real service's own login page (Google's, in this case). The third-party app never sees it at all - it only ever receives a token after you've approved access.",
      },
      keyTakeaway: "The whole point of OAuth 2.0 is that a third-party app never sees your actual password for the service it's accessing - only a token, issued after you approve access on that service's own login page.",
      commonMistake: "Building (or trusting) a login flow where a third-party app asks you to type your password for a completely different service directly into its own form - that's exactly the pattern OAuth 2.0 exists to avoid.",
    },
    {
      title: "OAuth 2.0: scopes and permissions",
      body: "A scope defines exactly what a token is allowed to do, keeping access narrow and specific rather than all-or-nothing. Requesting calendar.readonly grants permission to view calendar events but not modify or delete them; a separate calendar.events.write scope would be needed for that broader access, and a genuinely well-built integration only ever requests the narrowest set of scopes it actually needs to function. When you approve a third-party app's access request, the specific scopes it's asking for are exactly what you're being shown and agreeing to - reading that list carefully is the real moment of consent, not just clicking 'Allow' out of habit.",
      altExplain: "A scope limits exactly what a token can do - like 'view calendar' without 'edit calendar.' A well-built app only requests the narrowest scopes it actually needs.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A photo-printing app only needs to read your photo library, but its OAuth request asks for full read-and-delete access. What's the concern?",
        options: ["There's no concern, more access is always safer", "It's requesting broader scopes than it actually needs for its stated purpose", "Scopes don't actually limit anything in practice", "This is required by OAuth 2.0 for all apps"],
        correct: 1,
        explanation: "Requesting delete access for a service that only needs to read photos violates the principle of requesting the narrowest scope actually needed - it's a red flag worth noticing before approving, not a required or harmless default.",
      },
      keyTakeaway: "Scopes are the specific permissions being granted, not a formality - checking whether a requested scope actually matches an app's stated purpose is a genuine, meaningful security check.",
      commonMistake: "Approving an OAuth access request without reading which scopes are actually being requested, treating the approval screen as a single generic 'allow this app' button rather than a specific, itemized grant.",
    },
    {
      title: "JWT: structure and claims",
      body: "A JWT (JSON Web Token, pronounced 'jot') is a specific, widely-used format for a Bearer token, built from three Base64-encoded parts joined by dots: a header (describing the signing algorithm used), a payload (the actual claims - data about the token, like the user's ID and an expiration time), and a signature (proving the token hasn't been tampered with since it was issued). Critically, the header and payload are only encoded, not encrypted - anyone can decode and read a JWT's claims without needing the secret key at all; only the signature actually requires that secret, and only to verify the token is genuine, not to read its contents. This is why sensitive data (like a password, or anything meant to stay private) should never be placed directly in a JWT's payload.",
      altExplain: "A JWT has three parts: header.payload.signature. The header and payload are just encoded, not encrypted - anyone can read them. Only the signature proves the token is genuine and untampered.",
      visual: null,
      refBox: {
        syntax: "header.payload.signature",
        desc: "A JWT's three Base64-encoded parts, joined by dots. The header and payload are readable by anyone; only the signature requires the secret key.",
        example: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.4f8a...",
      },
      keyTakeaway: "A JWT's payload is encoded, not encrypted - anyone who has the token can decode and read its claims, even without the secret key needed to verify the signature.",
      commonMistake: "Placing a password, secret, or other genuinely sensitive value directly inside a JWT's payload, assuming it's protected the way a signature protects against tampering - encoding is not confidentiality.",
    },
    {
      title: "Refresh tokens",
      body: "Access tokens are intentionally short-lived - often expiring in just minutes or hours - to limit how much damage a stolen one could do before it stops working on its own. A refresh token solves the obvious inconvenience that would otherwise create: it's a separate, longer-lived credential that can be exchanged for a brand-new access token, without forcing the person to log in again from scratch every single time the short-lived one expires. Refresh tokens are held onto more carefully than access tokens specifically because they're longer-lived and more valuable if stolen - and they can typically be individually revoked by the issuing service, immediately invalidating that one refresh token (and everything it could still generate) without touching anyone else's session.",
      altExplain: "Access tokens expire quickly on purpose, to limit damage if stolen. A refresh token, held onto more carefully, can be exchanged for a new access token - no need to log in again from scratch each time.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "An access token is deliberately set to expire after just 15 minutes. What's the actual security benefit of such a short lifetime?",
        options: ["It has no real benefit, just an inconvenience", "It limits how long a stolen access token would remain usable", "It makes the API respond faster", "It's required by the JSON format"],
        correct: 1,
        explanation: "A short-lived access token limits the window of damage if it's ever stolen - it simply stops working on its own after 15 minutes, regardless of whether anyone notices the theft. The refresh token, held more carefully, is what avoids needing a fresh login every 15 minutes.",
      },
      keyTakeaway: "A short access-token lifetime isn't an oversight to work around - it's a deliberate security tradeoff, with the refresh token specifically designed to absorb the resulting inconvenience.",
      commonMistake: "Storing a refresh token with the same casual handling as a short-lived access token - since it's longer-lived and more valuable if stolen, it deserves meaningfully more careful storage.",
    },
    {
      title: "Request signing with HMAC",
      body: "Some APIs, especially for high-stakes operations like payments, require every request to be cryptographically signed using HMAC (Hash-based Message Authentication Code) rather than just carrying a token in a header. The client combines the request's details (and a timestamp, to prevent an intercepted request from being resent later) with a shared secret key, runs them through a hash function, and sends the resulting signature alongside the request; the server repeats the exact same calculation independently and only accepts the request if the signatures match exactly. This protects against a genuinely different threat than a Bearer token does: even if someone intercepts a signed request in transit, they can't modify any part of it and still produce a valid matching signature, since they don't have the secret key needed to recompute one.",
      altExplain: "HMAC request signing combines the request's details, a timestamp, and a shared secret into a signature the server can independently verify - protecting against a request being tampered with or replayed later, not just stolen.",
      visual: null,
      keyTakeaway: "HMAC signing protects request integrity (nothing was altered in transit) and prevents replay (an old request can't be resent later) - a threat a Bearer token alone doesn't address.",
      commonMistake: "Assuming a Bearer token and HMAC request signing solve the same problem and picking whichever is simpler - a stolen Bearer token can be reused freely by whoever has it, while a signed request can't be modified or replayed even if intercepted.",
    },
    {
      title: "Common authentication mistakes",
      body: "Most auth-related security incidents trace back to a small handful of repeat mistakes. Sending credentials - an API key, a Bearer token, Basic Auth - over plain HTTP instead of HTTPS exposes them to anyone who can observe the network traffic in between, no different from writing them on a postcard. Storing tokens in a way a malicious script on the same page could read (rather than using secure, http-only storage where the API supports it) undermines a token's protection entirely, regardless of how strong the token itself is. Requesting broader OAuth scopes than an integration genuinely needs increases the damage a compromised token could do, even if that broader access is never actually misused day to day. And logging full tokens or credentials in application logs - often done for debugging convenience, then forgotten - quietly turns routine log access into a security exposure.",
      altExplain: "The recurring mistakes: sending credentials over plain HTTP instead of HTTPS, storing tokens somewhere a malicious script could read them, requesting broader scopes than needed, and accidentally logging full tokens for debugging.",
      visual: null,
      keyTakeaway: "Every credential in this module - API keys, Basic Auth, Bearer tokens, JWTs - is only as safe as HTTPS and careful storage make it; the auth mechanism itself doesn't protect against either of those on its own.",
      commonMistake: "Treating a strong authentication mechanism as sufficient on its own, without also getting the surrounding basics right - HTTPS everywhere, careful storage, minimal scopes, and never logging raw credentials.",
    },
    {
      title: "Practice: choosing the right auth method",
      body: "Real projects usually need to weigh several of this module's methods against each other rather than defaulting to whichever one is most familiar. A simple internal script calling your own API is a reasonable fit for a plain API key - low stakes, no third parties involved, and simplicity is worth more than the extra structure OAuth would add. A production web app authenticating its own users is a good fit for Bearer tokens (often JWTs), issued after a normal login. An integration that needs to act on behalf of a user's account on a completely separate service - like an app reading someone's Google Calendar - specifically needs OAuth 2.0, since that's exactly the problem it was designed to solve. A payments API moving real money is exactly the high-stakes case where HMAC request signing earns its extra complexity, protecting against tampering and replay in a way a bearer token alone can't.",
      altExplain: "Simple internal script -> API key. Your own app's users -> Bearer tokens/JWT. Acting on a user's account on another service -> OAuth 2.0. High-stakes operations like payments -> add HMAC signing.",
      visual: null,
      widget: "insight-check",
      insightCheck: {
        question: "A budgeting app needs to read a user's transactions directly from their bank's API, without ever seeing the user's actual bank password. Which auth approach fits this specific need?",
        options: ["A shared API key for all users", "HTTP Basic Auth with the user's bank password", "OAuth 2.0, so the bank handles login and the app only receives a token", "No authentication is needed for this"],
        correct: 2,
        explanation: "This is precisely the scenario OAuth 2.0 was built for: a third-party app needing access to a user's data on a completely separate service, without that service's password ever touching the third-party app at any point.",
      },
      keyTakeaway: "Choosing an auth method is a genuine design decision, not a default - it depends on who's calling, what's at stake, and whether a separate service's credentials are involved at all.",
      commonMistake: "Reaching for OAuth 2.0 by default even for a simple internal tool with no third-party service involved, adding real complexity for a problem (protecting a password you never needed to share in the first place) that a plain API key already solves.",
    },
  ],
};

// =========================================================================
// APIs - Entry Level - Advanced track
// =========================================================================
const API_ENTRY_ADVANCED = [
  { isModuleStub: true, moduleId: "api-auth" },
  {
    title: "Pagination strategies: offset vs cursor",
    body: "Offset-based pagination (?limit=10&offset=20) is simple to implement and simple to reason about - it just skips a fixed number of results before returning the next page - but it has a real weakness: if a row is inserted or removed while someone is paging through results, later pages can skip or repeat items, since 'offset 20' points to a different actual row than it did a moment before. Cursor-based pagination avoids this by using a pointer to a specific item (usually its ID or a timestamp) rather than a raw count - ?after=task_42 always means 'everything after this specific task', regardless of what's been inserted or removed elsewhere in the meantime. Cursor pagination is more complex to implement, but it's the more reliable choice for any collection that changes while being paged through.",
    altExplain: "Offset pagination (?offset=20) skips a fixed count, but rows can shift under you while paging. Cursor pagination (?after=task_42) points to a specific item instead, staying reliable even as data changes.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A live activity feed is constantly getting new items while a user scrolls through older pages. Which pagination style is more reliable here?",
      options: ["Offset-based (?offset=20)", "Cursor-based (?after=item_id)", "Neither handles this well", "This only matters for very large datasets"],
      correct: 1,
      explanation: "A constantly-changing feed is exactly where offset pagination breaks down - new items shift what 'offset 20' actually points to. Cursor-based pagination anchors to a specific item instead, staying correct even as new data arrives.",
    },
    keyTakeaway: "Offset pagination counts positions, which can shift under changing data; cursor pagination anchors to a specific item, which stays correct no matter what else changes.",
    commonMistake: "Defaulting to offset pagination for a large, frequently-changing collection purely because it's simpler to implement, then being surprised when users report skipped or duplicated items while scrolling.",
  },
  {
    title: "Webhooks: APIs that call you",
    body: "Every pattern covered so far in this course is a request you initiate. A webhook flips that direction: instead of repeatedly polling an API to check whether something happened, you register a URL of your own in advance, and the API sends a request to that URL the moment a specific event actually occurs - a payment succeeding, a new file being uploaded, an order shipping. This is far more efficient than polling on a timer, since nothing is sent (or has to be checked) until there's genuinely something new to report. Because a webhook endpoint effectively accepts requests from the outside world, it should verify the payload is genuinely from the expected sender - often through an HMAC signature, covered earlier in this course's authentication module - rather than trusting every incoming request at face value.",
    altExplain: "A webhook is the API calling you: you register a URL in advance, and it sends a request there the moment something specific happens, instead of you repeatedly checking (polling) for updates.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An e-commerce platform wants to notify your app the instant an order ships, without your app needing to repeatedly check for updates. What's the right pattern?",
      options: ["Poll the orders endpoint every few seconds", "Register a webhook URL that the platform calls when an order ships", "There's no way to do this without polling", "Use a longer API key"],
      correct: 1,
      explanation: "This is exactly what a webhook is for: registering a URL in advance so the platform can notify your app the moment a specific event happens, rather than your app having to repeatedly ask whether anything changed.",
    },
    keyTakeaway: "A webhook inverts the usual request direction - the API becomes the one making a request, to a URL you registered in advance, the moment a specific event occurs.",
    commonMistake: "Accepting every incoming webhook request as genuine without verifying its signature - an endpoint that's publicly reachable can otherwise be spoofed by anyone who discovers its URL.",
  },
  {
    title: "API versioning",
    body: "An API that's genuinely used by other people eventually needs to change in ways that would break existing clients - and versioning is how that change happens without immediately breaking everyone still using the old behavior. A common approach puts the version directly in the URL path, like /v1/tasks versus /v2/tasks, making the choice explicit and visible in every single request. Another puts it in a header instead, like Accept: application/vnd.taskflow.v2+json, keeping the URL itself version-agnostic. Whichever approach an API uses, the underlying goal is the same: existing integrations keep working exactly as they did on the version they were built against, while new capability becomes available under a new version, on its own schedule, without forcing every existing client to update at the same moment.",
    altExplain: "Versioning (like /v1/ vs /v2/ in the URL) lets an API make breaking changes without immediately breaking everyone still using the old version - old and new versions can coexist for a while.",
    visual: null,
    cli: {
      hint: "curl https://api.taskflow.dev/v2/tasks",
      commands: {
        "curl https://api.taskflow.dev/v2/tasks": "[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\", \"tags\": [\"work\"] },\n  { \"id\": 2, \"title\": \"Review pull request\", \"status\": \"done\", \"tags\": [\"code\"] }\n]",
      },
    },
    keyTakeaway: "The goal of versioning isn't to add a v2 for its own sake - it's to let breaking changes ship without forcing every existing integration to update at the exact same moment.",
    commonMistake: "Making a breaking change to an API's existing (unversioned, or same-version) behavior directly, silently breaking every client that was built against the old behavior with no warning or transition period.",
    challenge: {
      prompt: "Try fetching the v2 tasks endpoint by running the command above, and notice the extra 'tags' field v1 didn't have.",
      hint: "Type the exact command shown, with /v2/ in the path.",
      solution: "curl https://api.taskflow.dev/v2/tasks",
    },
  },
  {
    title: "Rate limiting and throttling",
    body: "Rate limiting caps how many requests a client can make in a given time window, protecting an API's infrastructure from being overwhelmed - whether by a genuine traffic spike, an inefficient integration hammering it unnecessarily, or a deliberate abuse attempt. A common response includes headers reporting the current status, like X-RateLimit-Remaining (how many requests are left in this window) and X-RateLimit-Reset (when the count resets) - checking these proactively lets a well-behaved client slow itself down before actually hitting the limit. Once the limit is exceeded, the API typically responds with 429 Too Many Requests, often alongside a Retry-After header suggesting how long to wait before trying again - a client that respects this header, rather than immediately retrying, is what makes the whole system actually work as intended for everyone sharing that API.",
    altExplain: "Rate limiting caps how many requests you can make in a time window, protecting the API from overload. Going over returns 429 Too Many Requests, often with a Retry-After header telling you how long to wait.",
    visual: null,
    cli: {
      hint: "curl -i https://api.taskflow.dev/tasks",
      commands: {
        "curl -i https://api.taskflow.dev/tasks": "HTTP/1.1 200 OK\nX-RateLimit-Limit: 100\nX-RateLimit-Remaining: 97\nX-RateLimit-Reset: 1735689600\n\n[\n  { \"id\": 1, \"title\": \"Write project proposal\", \"status\": \"done\" }\n]",
      },
    },
    refBox: {
      syntax: "429 Too Many Requests + Retry-After header",
      desc: "The standard response once a rate limit is exceeded - the header suggests how long to wait before retrying.",
      example: "HTTP/1.1 429 Too Many Requests\nRetry-After: 30",
    },
    keyTakeaway: "Rate-limit headers (X-RateLimit-Remaining, X-RateLimit-Reset) let a well-behaved client slow itself down proactively, rather than discovering the limit only by hitting a 429.",
    commonMistake: "Responding to a 429 by immediately retrying the exact same request in a tight loop - without respecting the Retry-After header, this can make the underlying problem worse, not better.",
    challenge: {
      prompt: "Try running the -i (include headers) request above to see the rate-limit headers alongside the response.",
      hint: "Type the exact command shown, with the -i flag before the URL.",
      solution: "curl -i https://api.taskflow.dev/tasks",
    },
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "?offset=20 vs ?after=item_id", desc: "Offset pagination counts positions (can shift under changing data); cursor pagination anchors to a specific item.", example: "?after=task_42&limit=10" },
      { syntax: "Webhook: you register a URL, the API calls it", desc: "Inverts the usual request direction - notified the moment an event happens, instead of polling.", example: "POST https://yourapp.com/webhooks/taskflow" },
      { syntax: "/v1/tasks vs /v2/tasks", desc: "API versioning - lets breaking changes ship without immediately breaking existing clients.", example: "https://api.taskflow.dev/v2/tasks" },
      { syntax: "429 Too Many Requests + Retry-After", desc: "The standard rate-limit response - respect the Retry-After header rather than retrying immediately.", example: "X-RateLimit-Remaining: 3" },
    ],
  },
];

const API_QUIZ_BANK = {
  basic: [
    { q: "What does an API actually define?", options: ["The internal code of an application", "A contract - what requests are allowed and what shape responses take", "Only how a UI looks", "A single fixed programming language"], correct: 1 },
    { q: "Which HTTP method is used to permanently remove a resource?", options: ["GET", "POST", "DELETE", "HEAD"], correct: 2 },
    { q: "In /tasks/42?fields=title, what does the ?fields=title part represent?", options: ["Part of the path", "A query parameter", "A header", "A status code"], correct: 1 },
    { q: "A 404 status code means...", options: ["The server crashed", "Success, with no data", "The requested resource wasn't found", "You're not authenticated"], correct: 2 },
    { q: "What format does almost every modern API use for request and response bodies?", options: ["XML", "JSON", "CSV", "Plain text only"], correct: 1 },
  ],
  intermediate: [
    { q: "What's the key difference between PUT and PATCH?", options: ["They're identical", "PUT replaces the whole resource; PATCH updates only given fields", "PATCH is only for reading data", "PUT can only create, never update"], correct: 1 },
    { q: "A successful POST that creates a new resource typically returns which status code?", options: ["200", "201", "204", "404"], correct: 1 },
    { q: "Which query parameter pattern is a common convention for descending sort order?", options: ["sort=+field", "sort=-field", "sort=desc(field)", "order=field!"], correct: 1 },
    { q: "A successful DELETE with nothing left to describe often returns which status code?", options: ["200 with a large body", "204 No Content", "404", "201"], correct: 1 },
    { q: "Where does the actual, specific explanation of an error usually live?", options: ["Only in the status code", "In the error response body", "APIs never explain errors", "In the request headers you sent"], correct: 1 },
  ],
  advanced: [
    { q: "What problem does OAuth 2.0 specifically solve?", options: ["Making requests faster", "Letting a third-party app access your data on another service without ever seeing your password there", "Formatting JSON responses", "Compressing request bodies"], correct: 1 },
    { q: "In a JWT, which part actually requires the secret key to verify?", options: ["The header", "The payload", "The signature", "None of the parts"], correct: 2 },
    { q: "Why are access tokens deliberately given a short lifetime?", options: ["To save server storage", "To limit how long a stolen token remains usable", "It's required by the JSON format", "To make requests process faster"], correct: 1 },
    { q: "What does cursor-based pagination avoid that offset-based pagination is prone to?", options: ["Any performance cost at all", "Skipped or repeated items when the underlying data changes while paging", "The need for a limit parameter", "The need for authentication"], correct: 1 },
    { q: "A 429 status code specifically means...", options: ["The server crashed", "You're not authenticated", "You've exceeded the API's rate limit", "The resource was deleted"], correct: 2 },
  ],
};

// Professional and Master levels live in api-content-pro.js and
// api-content-master.js - the master file wires this course into
// COURSE_CONTENT once all three level files have loaded.
