// ---------- Seed data loaded into the in-browser SQLite database (sql.js) ----------
const SEED_SQL = `
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT,
  department TEXT,
  salary INTEGER,
  hire_date TEXT
);
INSERT INTO employees VALUES
  (1, 'Ana Reyes', 'Sales', 32000, '2022-03-14'),
  (2, 'Marco Cruz', 'Engineering', 45000, '2021-07-01'),
  (3, 'Liza Santos', 'Sales', 29000, '2023-01-20'),
  (4, 'Jed Ramos', 'Engineering', 51000, '2020-11-09'),
  (5, 'Pia Torres', 'Marketing', 34000, '2022-09-05'),
  (6, 'Noel Dizon', 'Marketing', 30000, '2023-06-11');

CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  employee_id INTEGER,
  amount INTEGER,
  status TEXT
);
INSERT INTO orders VALUES
  (101, 1, 1250, 'paid'),
  (102, 3, 800, 'pending'),
  (103, 2, 4200, 'paid'),
  (104, 4, 2100, 'paid'),
  (105, 1, 600, 'cancelled');

CREATE TABLE departments (
  name TEXT PRIMARY KEY,
  budget INTEGER,
  manager TEXT
);
INSERT INTO departments VALUES
  ('Sales', 150000, 'Ana Reyes'),
  ('Engineering', 400000, 'Jed Ramos'),
  ('Marketing', 180000, 'Pia Torres');
`;

const COURSES = [
  { id: "sql", title: "SQL", tagline: "Query real data with confidence", status: "active", accent: "#0b8a82", icon: "database" },
  { id: "data-analytics", title: "Data Analytics", tagline: "Turn numbers into decisions", status: "active", accent: "#a5135c", icon: "sparkles" },
  { id: "csharp", title: "C# Programming", tagline: "Build real applications", status: "active", accent: "#b5650a", icon: "terminal" },
  { id: "python", title: "Python", tagline: "Automate, analyze, and build", status: "active", accent: "#157f3c", icon: "book" },
  { id: "excel", title: "Excel", tagline: "Formulas, models, and dashboards", status: "active", accent: "#5b6b85", icon: "book" },
  { id: "powerbi", title: "Power BI", tagline: "Model, visualize, and share insights", status: "active", accent: "#e6a817", icon: "sparkles" },
  { id: "cloud", title: "Cloud Computing", tagline: "Deploy, scale, and secure the modern way", status: "active", accent: "#2563a8", icon: "cloud" },
  { id: "javascript", title: "JavaScript", tagline: "Bring the web to life", status: "active", accent: "#8a6d00", icon: "terminal" },
  { id: "api", title: "APIs", tagline: "Connect, request, and integrate real services", status: "active", accent: "#6d3fc4", icon: "plug" },
  { id: "dba", title: "Database Administration", tagline: "Keep real databases running, backed up, and fast", status: "active", accent: "#b23a2e", icon: "server" },
  { id: "ai-eng", title: "AI Engineering", tagline: "Build real applications on top of LLMs", status: "active", accent: "#4f46e5", icon: "cpu" },
];

// Every course is organized into three levels - Entry, Professional, Master -
// and each level contains the same three tracks: Basic, Intermediate, Advanced.
// Right now only the Entry level has content; Professional and Master are
// structured and ready, just waiting on lessons (they'll show "coming soon").
const LEVELS = [
  { id: "entry", label: "Entry Level" },
  { id: "professional", label: "Professional Level" },
  { id: "master", label: "Master Level" },
];

// Deep-dive sub-courses for topics that are wide enough to deserve their own space
// (e.g. "Loops" inside Python). Keyed by module id, populated by the per-course content
// files (e.g. MODULES["python-loops"] = {...} in python-content-entry.js). A lesson in a
// normal track can point at one of these with { isModuleStub: true, moduleId: "..." }
// instead of being a full lesson object itself.
const MODULES = {};

// =========================================================================
// SQL - Entry Level
// =========================================================================
const SQL_ENTRY_BASIC = [
  {
    title: "What is a database & table?",
    body: "A database is an organized collection of information that a computer can store, search, and update quickly and reliably. Rather than keeping everything in one giant, undifferentiated pile, a database organizes information into tables. Think of a table like a strict, well-behaved spreadsheet: every row represents one specific record - one employee, one order - and every column holds exactly one type of value across every single row, like a name, a date, or an amount. This structure is what makes it possible to ask precise questions of the data later, like 'who works in Sales' or 'which orders are still pending.' Throughout this course, you'll work with two connected tables: employees, which lists the people who work at a company, and orders, which tracks transactions those people are connected to. Understanding this row-and-column shape is the foundation everything else in SQL is built on top of.",
    altExplain: "Picture an Excel sheet. Each row is one person or one thing. Each column is one piece of info about them, like their name or their salary. That's basically a table.",
    visual: "diagram",
    keyTakeaway: "A table is rows (records) x columns (fields) - everything in SQL is built on top of this shape.",
    commonMistake: "Beginners sometimes think a 'database' means one big table. In reality it's a collection of many related tables - that's the whole reason JOIN exists later in this course.",
  },
  {
    title: "Rows and columns",
    body: "Once you understand that a table is built from rows and columns, the next step is understanding what each one represents and why the distinction matters so much. In our employees table, each row is a complete record for one employee, while each column captures a single attribute shared by every employee - their id, name, department, salary, and hire_date. Because every row follows exactly the same structure, a database can process thousands or millions of rows using the same simple rules, without needing any special-case handling for any individual row. SQL takes advantage of this consistency by letting you ask for exactly the rows and columns you care about, instead of manually scanning through data the way you might in a large spreadsheet. This is the core promise of SQL: describe precisely what you want, and let the database handle the work of finding and returning it.",
    altExplain: "Rows go across (one employee per row). Columns go down (one type of detail per column, like 'salary'). SQL lets you pick which rows and columns to look at.",
    visual: null,
    query: "SELECT * FROM employees;",
    keyTakeaway: "SELECT * FROM employees; means 'show me every column, every row' - it's the simplest possible query.",
    commonMistake: "Using SELECT * in real applications is fine for exploring, but wastes bandwidth in production apps - you usually only need a few columns, not all of them.",
    challenge: {
      prompt: "Run a query that shows every column from the orders table.",
      hint: "Same pattern as the employees example, just change the table name.",
      solution: "SELECT * FROM orders;",
    },
  },
  {
    title: "SELECT & FROM",
    body: "Every SQL query you write will begin with these same two building blocks. SELECT tells the database which columns you want to see in your results, and FROM tells it which table to pull those columns from. Writing SELECT name, salary FROM employees, for example, returns just two columns - name and salary - for every single row in the employees table, while ignoring the other columns entirely. You can list as many columns as you need, separated by commas, and the order you list them in is the order they'll appear in your results, which is a small but genuinely useful bit of control. Learning to read and write this SELECT ... FROM ... shape fluently is one of the most valuable habits you can build early on, since virtually every query in this entire course - no matter how advanced it eventually gets - starts from this exact same pattern.",
    altExplain: "SELECT = 'give me these columns'. FROM = 'out of this table'. Those two words are the backbone of almost every query you'll write.",
    visual: null,
    query: "SELECT name, salary FROM employees;",
    keyTakeaway: "Column order in your SELECT list controls the column order in your results - SQL doesn't reorder them for you.",
    commonMistake: "Forgetting the comma between column names is one of the most common first-week errors - SELECT name salary FROM employees will throw a syntax error.",
    challenge: {
      prompt: "Select just the name and department columns from employees.",
      hint: "You need exactly two column names, separated by a comma, before FROM.",
      solution: "SELECT name, department FROM employees;",
    },
  },
  {
    title: "Filtering with WHERE",
    body: "So far, every query you've written returns every single row in a table, which quickly becomes impractical the moment a table has more than a small handful of rows. WHERE solves this by letting you specify a condition that each row must satisfy in order to be included in your results. Writing SELECT * FROM employees WHERE department = 'Sales' tells the database: look at every row, but only keep the ones where the department column equals 'Sales', and quietly discard everything else. Text values like 'Sales' need to be wrapped in single quotes so the database knows you mean literal text, rather than a column name or a keyword. WHERE clauses are evaluated independently for every row, which is part of why they're so powerful - you can build arbitrarily specific conditions without ever needing to think about how the database actually goes about finding the matching rows underneath.",
    altExplain: "WHERE is a filter, like searching for a name in a spreadsheet. It hides every row that doesn't match what you asked for.",
    visual: "chart",
    query: "SELECT * FROM employees WHERE department = 'Engineering';",
    refBox: {
      syntax: "SELECT ... FROM table WHERE condition;",
      desc: "Filters rows - only rows where the condition is true are included. Text values need single quotes.",
      example: "SELECT * FROM employees WHERE department = 'Sales';",
    },
    keyTakeaway: "WHERE runs before your results are returned - think of it as 'only consider rows where this is true.'",
    commonMistake: "Using double quotes instead of single quotes around text values works in some databases but not others - single quotes are the safe, standard choice.",
    challenge: {
      prompt: "Find every employee in the Marketing department.",
      hint: "Same structure as the Engineering example, just change the department name in the WHERE clause.",
      solution: "SELECT * FROM employees WHERE department = 'Marketing';",
    },
  },
  {
    title: "Comparison operators",
    body: "WHERE isn't limited to checking whether something is exactly equal - it also supports the same comparison operators you likely remember from math class. Greater than (>) and less than (<) let you filter numbers by range, greater-than-or-equal (>=) and less-than-or-equal (<=) include the boundary value itself, and not-equal (!=) excludes rows matching a particular value. Writing SELECT * FROM employees WHERE salary > 30000 returns every employee earning more than 30,000, while switching to >= 30000 would also include anyone earning exactly that amount. These operators can later be combined with AND and OR to build more sophisticated conditions, but even used alone, they immediately make WHERE dramatically more flexible than simple equality checks ever could be on their own.",
    altExplain: "Same symbols from math class: greater than, less than, not equal. You're applying them to a column instead of a single number.",
    visual: null,
    query: "SELECT name, salary FROM employees WHERE salary > 30000;",
    keyTakeaway: "= checks for an exact match; > , < , >= , <= compare order; != means 'not equal to.'",
    commonMistake: "Writing =< or => instead of <= or >= - the comparison symbol always comes before the equals sign in SQL.",
    challenge: {
      prompt: "Find every employee earning 30,000 or less.",
      hint: "You need the 'less than or equal to' operator, not just 'less than.'",
      solution: "SELECT name, salary FROM employees WHERE salary <= 30000;",
    },
  },
  {
    title: "Sorting with ORDER BY",
    body: "By default, SQL makes no promises about what order your results come back in - the database returns rows in whatever order happens to be most convenient for it internally, which is rarely the order a human being would actually want to read them in. ORDER BY lets you take control of that, letting you specify a column to sort by and, optionally, a direction. Adding DESC after a column sorts from highest to lowest (or Z to A for text), while ASC - or simply leaving the keyword out entirely, since it's the default - sorts from lowest to highest. You can even sort by a column that isn't included in your SELECT list at all, since ORDER BY operates on the full row before the final result gets trimmed down to just the columns you asked for. This clause typically goes near the very end of a query, since logically, sorting only makes sense after you've already decided which rows to include in the first place.",
    altExplain: "It's the 'sort' button, written as code. ORDER BY salary DESC is the same as sorting highest to lowest in a spreadsheet.",
    visual: null,
    query: "SELECT name, salary FROM employees ORDER BY salary DESC;",
    refBox: {
      syntax: "SELECT ... ORDER BY column [ASC|DESC];",
      desc: "Sorts results - ASC (default) is lowest to highest, DESC is highest to lowest. Goes near the end of a query.",
      example: "SELECT name FROM employees ORDER BY name ASC;",
    },
    keyTakeaway: "ORDER BY always goes near the end of a query, after WHERE - SQL filters first, then sorts what's left.",
    commonMistake: "Forgetting DESC and assuming results come back sorted - by default, row order isn't guaranteed at all unless you explicitly ORDER BY something.",
    challenge: {
      prompt: "List all employees sorted alphabetically by name (A to Z).",
      hint: "ASC sorts lowest-to-highest, which for text means alphabetical order - but it's also the default, so you can leave it out entirely.",
      solution: "SELECT name FROM employees ORDER BY name ASC;",
    },
  },
  {
    title: "LIMIT - getting just a few rows",
    body: "Sometimes you don't need every matching row - you just need a handful, like the top three highest earners, or a quick preview of what a table even contains. LIMIT caps the number of rows a query returns, stopping as soon as it reaches whatever number you specify. On its own, LIMIT is somewhat arbitrary, since without a defined order the database could hand back any three rows and technically still be correct according to your query. That's why LIMIT is almost always paired with ORDER BY: sort first, so the ranking is meaningful, then limit to however many rows from the top (or bottom) of that ranking you actually need. This combination - ORDER BY paired with LIMIT - is one of the most common patterns you'll reach for to answer 'top N' or 'bottom N' style questions against real data.",
    altExplain: "LIMIT says 'stop after this many rows.' Great for previewing data or building a top-N list without scrolling through everything.",
    visual: null,
    query: "SELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;",
    keyTakeaway: "LIMIT applies after sorting - always pair it with ORDER BY if you want a meaningful 'top N', otherwise you get an arbitrary set of rows.",
    commonMistake: "Using LIMIT without ORDER BY and expecting the 'top' results - without sorting first, LIMIT just grabs whatever rows the database happens to return first.",
    challenge: {
      prompt: "Find the two lowest-paid employees.",
      hint: "Sort ascending (lowest first) this time, then limit to 2.",
      solution: "SELECT name, salary FROM employees ORDER BY salary ASC LIMIT 2;",
    },
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "SELECT column1, column2 FROM table;", desc: "Returns specific columns from a table - use * to select all columns.", example: "SELECT name, salary FROM employees;" },
      { syntax: "SELECT ... WHERE condition;", desc: "Filters rows - only rows where the condition is true are included.", example: "WHERE department = 'Sales'" },
      { syntax: "= != > < >= <=", desc: "Comparison operators used inside a WHERE clause.", example: "WHERE salary > 50000" },
      { syntax: "SELECT ... ORDER BY column [ASC|DESC];", desc: "Sorts results - ASC (default) is lowest to highest, DESC is highest to lowest.", example: "ORDER BY salary DESC" },
      { syntax: "SELECT ... LIMIT n;", desc: "Caps the number of rows returned - almost always paired with ORDER BY.", example: "ORDER BY salary DESC LIMIT 3" },
    ],
  },
];

// =========================================================================
// Deep-dive module: Joins (SQL) - referenced by the isModuleStub entry at
// the top of SQL_ENTRY_INTERMEDIATE below, instead of two flat lessons.
// =========================================================================
MODULES["sql-joins"] = {
  id: "sql-joins",
  title: "Joins",
  icon: "link",
  accent: "#0b8a82",
  tagline: "Every way SQL has to reconnect tables that were split apart, from a basic match to comparing rows to themselves.",
  whatYouLearn: [
    "Combine matching rows from two tables with INNER JOIN",
    "Keep every row from one side with LEFT and RIGHT JOIN",
    "Find rows with no match at all using an anti-join",
    "Chain joins across three or more related tables",
    "Compare rows within the same table using a self-join",
    "Spot the join mistakes that quietly duplicate or drop rows",
  ],
  lessons: [
    {
      title: "Why JOIN exists",
      body: "Splitting related information across multiple tables - employees in one, orders in another - avoids repeating an employee's name and department on every single order they've ever placed. That's efficient to store, but it leaves you with two disconnected lists: run SELECT * FROM orders on its own and all you get back is an employee_id number, with no name or department attached anywhere in sight. JOIN is the tool that reconnects tables like these, matching rows from one to rows in another based on a shared column, so a query can answer questions that neither table could answer by itself - like 'which department placed this order' or 'has this employee ever ordered anything at all.' Every variation of JOIN covered in this module is really just a different rule for what happens when a match can or can't be found.",
      altExplain: "Splitting data into separate tables saves space, but it means you need a way to reconnect them when a question spans both. That reconnecting tool is JOIN.",
      visual: "diagram",
      keyTakeaway: "A JOIN's whole job is to reconnect tables that were split apart for storage - every version of it just handles unmatched rows differently.",
      commonMistake: "Trying to answer a two-table question by querying one table at a time and combining the results by hand, instead of just letting JOIN do the matching.",
    },
    {
      title: "INNER JOIN: matching rows only",
      body: "A plain JOIN - technically called an INNER JOIN, though the INNER keyword is optional and usually left out - combines two tables by matching rows on a condition you specify in an ON clause, and keeps only the rows where a match exists on both sides. SELECT employees.name, orders.amount FROM orders JOIN employees ON orders.employee_id = employees.id looks at every order, finds the employee whose id matches that order's employee_id, and glues the two rows together into one wider row. If an employee has placed three orders, that employee's details appear three times, once per matching order - a JOIN produces one output row per matching pair, not one row per employee. Any employee with zero orders is simply left out entirely, which is the defining trait of an INNER JOIN and exactly what the next lesson's LEFT JOIN is built to change.",
      altExplain: "JOIN (INNER JOIN) only keeps rows where both tables have a match. An employee with no orders just won't appear at all.",
      visual: null,
      query: "SELECT employees.name, orders.amount, orders.status FROM orders JOIN employees ON orders.employee_id = employees.id;",
      refBox: {
        syntax: "SELECT ... FROM tableA JOIN tableB ON tableA.col = tableB.col;",
        desc: "Combines matching rows from two tables based on a shared column, specified in the ON clause. Rows with no match on either side are dropped.",
        example: "SELECT * FROM orders JOIN employees ON orders.employee_id = employees.id;",
      },
      keyTakeaway: "JOIN needs an ON clause telling it which columns connect the two tables - without it, you'd get every possible combination of rows instead.",
      commonMistake: "Forgetting that a matched employee appears once per matching order, not once total - three orders means that employee's row repeats three times.",
      challenge: {
        prompt: "Join orders to employees and show the employee's department alongside the order's status.",
        hint: "Same JOIN as the example, just change which two columns you SELECT.",
        solution: "SELECT employees.department, orders.status FROM orders JOIN employees ON orders.employee_id = employees.id;",
      },
    },
    {
      title: "Table aliases",
      body: "Prefixing every column with its full table name keeps a query unambiguous, but it gets tedious fast, and it's about to get essential once a query joins three tables or joins a table to itself. A table alias gives a table a short temporary nickname for the rest of the query, written right after the table name with an optional (and usually skipped) AS: FROM employees e JOIN orders o ON e.id = o.employee_id lets the rest of the query refer to e.name and o.amount instead of spelling out employees.name and orders.amount in full. Aliases don't change what a query returns - they're purely a shorthand for you as the person writing and reading it - but that shorthand becomes genuinely necessary once you reach self-joins later in this module, where a table has to be referred to by two different names at once just to tell the two copies apart.",
      altExplain: "An alias is just a short nickname for a table, so you can write e.name instead of employees.name for the rest of the query.",
      visual: null,
      query: "SELECT e.name, o.amount, o.status FROM employees e JOIN orders o ON e.id = o.employee_id;",
      refBox: {
        syntax: "FROM table AS alias  (AS is optional)",
        desc: "Gives a table a short nickname for the rest of the query - purely for readability, doesn't change the result.",
        example: "FROM employees e JOIN orders o ON e.id = o.employee_id",
      },
      keyTakeaway: "Aliases are just for readability now, but they become required once the same table needs two different names in one query, as in a self-join.",
      commonMistake: "Aliasing a table but then still writing its full name elsewhere in the query - once aliased, every reference to that table should use the short name.",
      challenge: {
        prompt: "Rewrite the previous join using aliases e for employees and o for orders, selecting e.name and o.status.",
        hint: "Same ON condition, just swap employees/orders for e/o everywhere, including in the SELECT list.",
        solution: "SELECT e.name, o.status FROM employees e JOIN orders o ON e.id = o.employee_id;",
      },
    },
    {
      title: "LEFT JOIN: keep everything from one side",
      body: "An INNER JOIN silently drops any row with no match, which is a problem the moment you actually need to see what's missing - like which employees have never placed a single order. LEFT JOIN solves this by keeping every row from the first (left) table no matter what, filling in NULL for any columns from the second table whenever no match exists. SELECT employees.name, orders.amount FROM employees LEFT JOIN orders ON employees.id = orders.employee_id still returns one row per matching order for employees who have them, but now also includes employees with zero orders, showing NULL in the amount column instead of leaving them out entirely. The table named right after FROM is the 'left' one - flipping which table you start from changes what LEFT JOIN keeps, since it's always anchored to whichever table comes first.",
      altExplain: "LEFT JOIN keeps every row from the first table, even without a match - it just fills in blanks (NULL) instead of dropping the row.",
      visual: null,
      query: "SELECT employees.name, orders.amount FROM employees LEFT JOIN orders ON employees.id = orders.employee_id;",
      keyTakeaway: "The table right after FROM is the 'left' table in a LEFT JOIN - every one of its rows survives, matched or not.",
      commonMistake: "Using INNER JOIN when you actually wanted to see unmatched rows too - this silently drops rows and can make it look like data is missing.",
      challenge: {
        prompt: "Use LEFT JOIN to list every employee's department and their order status, including employees with no orders at all.",
        hint: "Same shape as the example query, just select employees.department and orders.status instead.",
        solution: "SELECT employees.department, orders.status FROM employees LEFT JOIN orders ON employees.id = orders.employee_id;",
      },
    },
    {
      title: "RIGHT JOIN and FULL OUTER JOIN",
      body: "RIGHT JOIN is LEFT JOIN's mirror image: it keeps every row from the second (right) table instead, filling in NULL for the left table's columns wherever no match exists. In practice, a RIGHT JOIN can always be rewritten as an equivalent LEFT JOIN just by swapping which table is named first - FROM orders RIGHT JOIN employees ON ... returns exactly the same rows as FROM employees LEFT JOIN orders ON ..., which is why many people default to always writing LEFT JOIN and never reach for RIGHT JOIN at all. FULL OUTER JOIN goes further still, keeping every row from both tables at once - matched rows combine normally, and anything unmatched on either side still appears, with NULL filling in whichever side has no match. It answers 'show me everything from both tables, matched where possible' in a single query, without needing to run two separate outer joins and combine them yourself.",
      altExplain: "RIGHT JOIN is LEFT JOIN flipped - it keeps every row from the second table instead of the first. FULL OUTER JOIN keeps every row from both sides at once.",
      visual: null,
      query: "SELECT employees.name, orders.amount FROM orders RIGHT JOIN employees ON employees.id = orders.employee_id;",
      refBox: {
        syntax: "... RIGHT JOIN ... ON ...;   /   ... FULL OUTER JOIN ... ON ...;",
        desc: "RIGHT JOIN keeps every row from the second table; FULL OUTER JOIN keeps every row from both, filling NULL wherever no match exists.",
        example: "SELECT * FROM employees FULL OUTER JOIN orders ON employees.id = orders.employee_id;",
      },
      keyTakeaway: "A RIGHT JOIN can always be rewritten as a LEFT JOIN by swapping the table order - most people stick to LEFT JOIN for consistency rather than switching between the two.",
      commonMistake: "Assuming every database supports FULL OUTER JOIN the same way - some older or smaller engines only support INNER and LEFT/RIGHT, so it's worth checking first.",
      challenge: {
        prompt: "Rewrite the LEFT JOIN from the previous lesson as a RIGHT JOIN with the table order flipped, so it returns the exact same rows.",
        hint: "Put orders first, then RIGHT JOIN employees, keeping the same ON condition.",
        solution: "SELECT employees.name, orders.amount FROM orders RIGHT JOIN employees ON employees.id = orders.employee_id;",
      },
    },
    {
      title: "Finding the unmatched: anti-joins",
      body: "A genuinely common real-world question is the mirror image of a normal join: not 'show me the matches', but 'show me what has no match at all' - which employees have never placed an order, which products have never sold. This pattern is called an anti-join, and the most common way to write one is LEFT JOIN plus a WHERE clause checking that the right-hand table's column is NULL: employees with no orders show up from the LEFT JOIN with orders.id as NULL, so filtering WHERE orders.id IS NULL keeps exactly those employees and discards everyone who actually matched. NOT EXISTS, covered elsewhere in this course, answers the same question and is often faster on large tables, but the LEFT JOIN plus IS NULL version is worth knowing first since it builds directly on what LEFT JOIN already does rather than introducing new syntax.",
      altExplain: "To find rows with no match at all, LEFT JOIN first (so unmatched rows show up as NULL), then filter down to just the NULL ones.",
      visual: null,
      query: "SELECT employees.name FROM employees LEFT JOIN orders ON employees.id = orders.employee_id WHERE orders.id IS NULL;",
      refBox: {
        syntax: "... LEFT JOIN ... ON ... WHERE rightTable.col IS NULL;",
        desc: "An anti-join - finds rows from the left table with no matching row at all on the right.",
        example: "FROM employees LEFT JOIN orders ON ... WHERE orders.id IS NULL",
      },
      keyTakeaway: "orders.id IS NULL after a LEFT JOIN specifically means 'no order matched this employee' - that's the whole anti-join pattern in one line.",
      commonMistake: "Filtering WHERE orders.id IS NULL after an INNER JOIN instead of a LEFT JOIN - an INNER JOIN already dropped every unmatched row, so the filter finds nothing.",
      challenge: {
        prompt: "Find every employee who has never placed an order, using LEFT JOIN and IS NULL.",
        hint: "Same pattern as the example - swap in a different column to check for NULL if you'd like, but orders.id works fine.",
        solution: "SELECT employees.name FROM employees LEFT JOIN orders ON employees.id = orders.employee_id WHERE orders.id IS NULL;",
      },
    },
    {
      title: "Multi-table joins",
      body: "Real schemas frequently involve more than two related tables, and SQL handles this by simply chaining additional JOIN clauses onto the same query. Alongside employees and orders, this dataset also has departments, holding each department's budget and manager - joining employees to orders and then to departments in a single query lets you see an order, the employee who placed it, and that employee's department budget all in one unified result. Each additional JOIN needs its own ON clause specifying how that table connects to what's already been joined so far, and the order you chain them in generally doesn't affect the final result, only how the query reads. Aliasing every table, as covered earlier in this module, becomes genuinely valuable here - with three or more tables in play, unaliased full table names make a query noticeably harder to scan.",
      altExplain: "You can JOIN as many tables as you need, one after another - each one just needs its own ON clause explaining how it connects to what came before.",
      visual: null,
      query: "SELECT employees.name, orders.amount, departments.budget\nFROM orders\nJOIN employees ON orders.employee_id = employees.id\nJOIN departments ON employees.department = departments.name;",
      keyTakeaway: "Each JOIN in a chain needs its own ON clause - there's no limit to how many tables you can connect this way.",
      commonMistake: "Mixing up which table a column belongs to once three or more tables are joined - prefixing every column with its table name (or alias) avoids ambiguous column errors.",
      challenge: {
        prompt: "Show each order's amount, the employee's name, and their department's manager.",
        hint: "Chain three tables: orders to employees on employee_id/id, then employees to departments on department/name.",
        solution: "SELECT orders.amount, employees.name, departments.manager FROM orders JOIN employees ON orders.employee_id = employees.id JOIN departments ON employees.department = departments.name;",
      },
    },
    {
      title: "Self-joins: joining a table to itself",
      body: "A self-join joins a table to itself, treating it as though it were two separate tables by giving each reference a different alias - which is exactly why table aliases, covered earlier in this module, are a hard requirement here rather than just a convenience. This is useful whenever rows in a table need to be compared to other rows in that same table - for example, finding pairs of employees who work in the same department. FROM employees a JOIN employees b ON a.department = b.department AND a.id < b.id compares every employee to every other employee in the same department, with the a.id < b.id condition preventing an employee from being paired with themselves and avoiding duplicate reversed pairs (Ana-Liza and Liza-Ana). Self-joins can feel conceptually strange at first, since you're joining a table to itself, but the aliasing is what makes it possible for the database to treat the two references as genuinely distinct.",
      altExplain: "A self-join compares rows in a table to other rows in that same table, by giving the table two different aliases in the same query.",
      visual: null,
      query: "SELECT a.name as employee_1, b.name as employee_2, a.department\nFROM employees a\nJOIN employees b ON a.department = b.department AND a.id < b.id;",
      refBox: {
        syntax: "FROM table a JOIN table b ON a.col = b.col AND a.id < b.id",
        desc: "A self-join - a table joined to itself using two aliases to compare its own rows.",
        example: "FROM employees a JOIN employees b ON a.dept = b.dept",
      },
      keyTakeaway: "Self-joins require aliasing the same table twice (like a and b) so the database can tell the two references apart.",
      commonMistake: "Forgetting a condition like a.id < b.id, which results in every pair appearing twice (once each direction) plus every employee paired with themselves.",
      challenge: {
        prompt: "Find pairs of employees in the same department, showing just their two names (not the department).",
        hint: "Same self-join structure as the example, just drop a.department from the SELECT list.",
        solution: "SELECT a.name as employee_1, b.name as employee_2 FROM employees a JOIN employees b ON a.department = b.department AND a.id < b.id;",
      },
    },
    {
      title: "CROSS JOIN: every combination",
      body: "Every join covered so far matches rows based on some condition in an ON clause - CROSS JOIN is the odd one out, since it has no matching condition at all. It pairs every row in the first table with every row in the second, producing what's called a Cartesian product: 6 employees crossed with 3 departments produces 18 rows, one for every possible combination, regardless of whether that combination means anything. This is rarely what you want by accident, but it's genuinely useful on purpose - generating every possible pairing of two small lists, like every product crossed with every size, is exactly the kind of table a CROSS JOIN builds in one line. Worth recognizing: writing FROM tableA, tableB with a comma and no ON clause at all is silently the same thing as an explicit CROSS JOIN, which is precisely why a missing ON clause is such a common and expensive mistake.",
      altExplain: "CROSS JOIN pairs every row in one table with every row in another - no matching condition, just every possible combination.",
      visual: null,
      query: "SELECT departments.name, employees.name FROM departments CROSS JOIN employees LIMIT 6;",
      keyTakeaway: "A CROSS JOIN's row count is always rows(A) x rows(B) - useful when you want every combination on purpose, dangerous when it happens by accident.",
      commonMistake: "Writing FROM tableA, tableB with no ON clause, not realizing that's a CROSS JOIN in disguise and will multiply your row count unexpectedly.",
      challenge: {
        prompt: "Use CROSS JOIN to pair every department with every employee, showing the department name and employee name.",
        hint: "No ON clause needed - just CROSS JOIN the two tables and select one column from each.",
        solution: "SELECT departments.name, employees.name FROM departments CROSS JOIN employees;",
      },
    },
    {
      title: "Common join mistakes and performance pitfalls",
      body: "Most join bugs come down to a small handful of repeat offenders. A missing or wrong ON clause is the most common: leave it off entirely and you've written an accidental CROSS JOIN, multiplying your row count instead of matching it; join on the wrong pair of columns and you'll get rows back, just not the ones you meant, which is far more dangerous than an obvious error since nothing looks broken. Choosing INNER JOIN when you actually needed LEFT JOIN silently drops rows with no match, which can make it look like data is missing when it was simply never included in the results in the first place. On the performance side, joining on a column with no index forces the database to scan and compare every row combination directly, which gets noticeably slower as tables grow - the indexes lesson elsewhere in this course covers how to fix that. Reading a query's FROM and JOIN clauses slowly, one at a time, and asking 'what should this actually match on' catches the majority of these mistakes before they ever reach real data.",
      altExplain: "Most join bugs are one of: no ON clause (accidental CROSS JOIN), the wrong ON clause (matches, just not the right ones), or INNER JOIN where you needed LEFT JOIN.",
      visual: "code",
      query: "SELECT * FROM employees, orders LIMIT 5;",
      keyTakeaway: "A missing ON clause doesn't error out - it silently becomes a CROSS JOIN, which is why unexpectedly huge result sets are the first thing to check for.",
      commonMistake: "Trusting a join because it returned rows - a wrong ON condition still produces output, it's just quietly matching the wrong things.",
      challenge: {
        prompt: "The query above returns way more rows than expected because it has no ON clause at all. Rewrite it as a proper JOIN matching orders to their employee.",
        hint: "Replace the comma with JOIN, and add ON employees.id = orders.employee_id.",
        solution: "SELECT * FROM employees JOIN orders ON employees.id = orders.employee_id;",
      },
    },
    {
      title: "Practice: combining join patterns",
      body: "Real questions rarely stay inside one join pattern - they usually combine several of the ideas from this module in the same query: joining more than two tables, filtering with WHERE, and sometimes needing DISTINCT to avoid counting the same employee more than once when they match multiple rows on the other side. The example below chains employees to orders to departments, exactly like the multi-table joins lesson, but adds a WHERE clause to keep only paid orders - a small taste of how these patterns stack together once you're working with a real question instead of a single isolated concept. There's no single 'correct' style for combining joins like this, only whether the ON clauses correctly describe how your tables actually relate to each other - get that right, and everything downstream follows naturally.",
      altExplain: "Real questions usually combine a multi-table join with a WHERE filter, and sometimes DISTINCT - this lesson is just practice putting those pieces together.",
      visual: null,
      query: "SELECT employees.name, orders.status, departments.manager\nFROM employees\nJOIN orders ON employees.id = orders.employee_id\nJOIN departments ON employees.department = departments.name\nWHERE orders.status = 'paid';",
      keyTakeaway: "Combining joins is just stacking the individual patterns from this module - the skill is describing each ON clause correctly, not memorizing bigger queries.",
      commonMistake: "Forgetting DISTINCT when an employee could match multiple rows on the other side of a join, resulting in that employee's name appearing more than once.",
      challenge: {
        prompt: "List each employee's name, department, and department manager, but only for employees who have placed at least one paid order - each employee should appear only once.",
        hint: "Same three-table join as the example, but SELECT DISTINCT to avoid duplicate rows if an employee has more than one paid order.",
        solution: "SELECT DISTINCT employees.name, employees.department, departments.manager FROM employees JOIN orders ON employees.id = orders.employee_id JOIN departments ON employees.department = departments.name WHERE orders.status = 'paid';",
      },
    },
  ],
};

const SQL_ENTRY_INTERMEDIATE = [
  { isModuleStub: true, moduleId: "sql-joins" },
  {
    title: "GROUP BY - summarizing data",
    body: "Up to now, every query you've written returns one row of output per row of input - filtering and sorting change which rows appear and in what order, but they never change how many distinct 'things' you're actually looking at. GROUP BY changes that by bundling multiple rows together based on a shared value, collapsing them into a single summarized row per group. Writing SELECT department, COUNT(*) FROM employees GROUP BY department produces one row per unique department, each showing how many employees belong to it, rather than one row per individual employee. This is a genuinely useful shift in perspective: instead of examining individual records one at a time, you're now asking questions about entire categories of records at once, which is usually much closer to the kind of question a business actually wants answered in the first place.",
    altExplain: "GROUP BY is like a pivot table. Instead of every single row, you get one summarized row per group.",
    visual: null,
    query: "SELECT department, COUNT(*) as headcount FROM employees GROUP BY department;",
    refBox: {
      syntax: "SELECT col, AGG(col2) FROM table GROUP BY col;",
      desc: "Bundles rows sharing a value into one summary row per group - every SELECT column must be grouped or aggregated.",
      example: "SELECT department, COUNT(*) FROM employees GROUP BY department;",
    },
    keyTakeaway: "Every column in your SELECT list must either be in the GROUP BY clause or wrapped in an aggregate function.",
    commonMistake: "Selecting a non-aggregated column that isn't in GROUP BY - the database won't know which value to show for a group with many rows.",
    challenge: {
      prompt: "Count how many orders exist for each status (paid, pending, cancelled).",
      hint: "Group by the orders.status column this time, not department.",
      solution: "SELECT status, COUNT(*) as total FROM orders GROUP BY status;",
    },
  },
  {
    title: "Aggregate functions",
    body: "GROUP BY is powerful specifically because it lets you attach aggregate functions to each group - functions that take many individual values and collapse them down into a single summary number. COUNT tells you how many rows exist in a group, SUM adds up a numeric column across the entire group, AVG computes the average, and MIN and MAX find the smallest or largest value present. These can be used together with GROUP BY, as in AVG(salary) per department, or used entirely on their own without any grouping at all, in which case they simply summarize the whole table into a single row of output. It's worth knowing early on that these functions quietly ignore NULL values rather than treating them as zero, which can meaningfully change your results if the underlying data has gaps - something to watch for once you start working with real, messier datasets outside of this course.",
    altExplain: "These are math shortcuts: COUNT = how many, SUM = total, AVG = average. You put them where a column name would go.",
    visual: "chart-live",
    query: "SELECT department, AVG(salary) as avg_salary FROM employees GROUP BY department;",
    keyTakeaway: "COUNT(*) counts rows; COUNT(column_name) counts only non-empty values in that column - they can give different answers if a column has gaps.",
    commonMistake: "Averaging a column that contains NULLs and expecting NULLs to count as zero - AVG() actually ignores NULLs entirely.",
    challenge: {
      prompt: "Find the total amount of all paid orders combined.",
      hint: "You'll need SUM(amount), and a WHERE clause for status = 'paid' - no GROUP BY needed since you want one total.",
      solution: "SELECT SUM(amount) as total_paid FROM orders WHERE status = 'paid';",
    },
  },
  {
    title: "Subqueries",
    body: "Sometimes answering a question genuinely requires two steps: first calculate something, and only then use that calculated value to filter or shape a second query. A subquery is simply a complete SQL query nested inside another one, usually wrapped in parentheses, and it's evaluated first so that its result can be used by the outer, surrounding query. SELECT name FROM employees WHERE salary > (SELECT AVG(salary) FROM employees) is a clean example of this: the inner query calculates the company's average salary, and the outer query then finds every employee earning more than that calculated number. This pattern - use a subquery to establish a benchmark, then filter against it - comes up constantly in real-world analysis, any time 'more than average', 'less than the maximum', or a similar relative comparison is involved.",
    altExplain: "It's a query that answers a smaller question first (like 'what's the average salary?'), then the outer query uses that answer to filter its own results.",
    visual: null,
    query: "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
    keyTakeaway: "A subquery used like this must return a single value - if it returns multiple rows, you'd need IN instead of a comparison operator.",
    commonMistake: "Writing an inner query that returns multiple rows, then comparing it with = - that throws an error. Use IN (...) instead.",
    challenge: {
      prompt: "Find employees whose department has more than 1 person, using a subquery with GROUP BY and HAVING.",
      hint: "HAVING filters after GROUP BY. Use IN with a subquery that returns qualifying department names.",
      solution: "SELECT name, department FROM employees WHERE department IN (SELECT department FROM employees GROUP BY department HAVING COUNT(*) > 1);",
    },
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "SELECT ... FROM tableA JOIN tableB ON tableA.col = tableB.col;", desc: "Combines matching rows from two tables based on a shared column.", example: "FROM orders JOIN employees ON orders.employee_id = employees.id" },
      { syntax: "INNER JOIN (default) vs LEFT JOIN", desc: "INNER JOIN keeps only matches; LEFT JOIN keeps every row from the left table, filling NULL if unmatched.", example: "FROM employees LEFT JOIN orders ON ..." },
      { syntax: "SELECT col, AGG(col2) FROM table GROUP BY col;", desc: "Bundles rows sharing a value into one summary row per group.", example: "GROUP BY department" },
      { syntax: "COUNT(*) / SUM(col) / AVG(col) / MIN(col) / MAX(col)", desc: "Aggregate functions - collapse many rows into one summary number.", example: "AVG(salary), COUNT(*)" },
      { syntax: "WHERE col > (SELECT ... )", desc: "A subquery - a nested query whose result the outer query uses.", example: "WHERE salary > (SELECT AVG(salary) FROM employees)" },
    ],
  },
];

const SQL_ENTRY_ADVANCED = [
  {
    title: "Common Table Expressions (WITH)",
    body: "As queries grow more complex, nesting subquery inside subquery inside subquery quickly becomes difficult to read and even harder to debug when something goes wrong. A Common Table Expression, written with WITH ... AS, solves this readability problem by letting you name an intermediate result up front and then refer to that name throughout the rest of the query, exactly as though it were a real table sitting in the database. Writing WITH high_earners AS (SELECT * FROM employees WHERE salary > 30000) lets every later part of the query simply reference high_earners instead of repeating that same filtering logic all over again. CTEs don't change what a query is capable of computing - anything you can do with a CTE, you could technically also do with a nested subquery - but they make multi-step logic dramatically easier for a human being to follow, which matters enormously once queries are shared across a team or revisited months after they were originally written.",
    altExplain: "Think of it as a 'helper query' you define first and give a name to, so the rest of your query can just refer to that name.",
    visual: null,
    query: "WITH high_earners AS (\n  SELECT * FROM employees WHERE salary > 30000\n)\nSELECT name, department FROM high_earners ORDER BY department;",
    refBox: {
      syntax: "WITH name AS (SELECT ...) SELECT ... FROM name;",
      desc: "Names an intermediate result up front, so the rest of the query can reference it like a real table.",
      example: "WITH big AS (SELECT * FROM t WHERE x > 10)\nSELECT * FROM big;",
    },
    keyTakeaway: "CTEs don't make a query run faster by themselves - their real value is readability, naming and reusing a step instead of nesting subqueries.",
    commonMistake: "Forgetting that a CTE only exists for the single query it's attached to - you can't reference it in a separate query afterward.",
    challenge: {
      prompt: "Write a CTE called sales_orders that selects all orders with status = 'paid', then select just the amount column from it.",
      hint: "Same shape as the example - swap the WITH query's condition and table.",
      solution: "WITH sales_orders AS (\n  SELECT * FROM orders WHERE status = 'paid'\n)\nSELECT amount FROM sales_orders;",
    },
  },
  {
    title: "Window functions",
    body: "GROUP BY is extremely useful, but it comes with an unavoidable tradeoff: it collapses your data down to one row per group, discarding the individual rows that made up that group in the first place. Window functions solve a genuinely different problem - calculating something across a set of related rows while still keeping every individual row visible in the final output. RANK() OVER (PARTITION BY department ORDER BY salary DESC) computes each employee's salary rank within their own department, but every employee still appears as their own row, with the calculated rank simply added as an extra column alongside their existing data. PARTITION BY defines which rows count as 'related' for the calculation - effectively resetting the ranking for each group - while ORDER BY inside the OVER(...) clause controls how rows are ranked within that partition. This combination of summarizing without collapsing is exactly what makes window functions indispensable for tasks like ranking, running totals, and period-over-period comparisons.",
    altExplain: "Unlike GROUP BY, which merges rows together, a window function adds an extra column of calculated info while keeping every original row visible.",
    visual: null,
    query: "SELECT name, department, salary,\n  RANK() OVER (PARTITION BY department ORDER BY salary DESC) as dept_rank\nFROM employees;",
    refBox: {
      syntax: "FUNC() OVER (PARTITION BY col ORDER BY col2)",
      desc: "Calculates across related rows while keeping every row visible - unlike GROUP BY, nothing collapses.",
      example: "RANK() OVER (PARTITION BY dept ORDER BY salary DESC)",
    },
    keyTakeaway: "PARTITION BY resets the calculation for each group (like a mini GROUP BY inside the window function), while ORDER BY inside OVER(...) controls ranking order.",
    commonMistake: "Confusing window functions with GROUP BY and expecting fewer rows back - window functions keep every row; they add a column, not summarize away detail.",
    challenge: {
      prompt: "Use ROW_NUMBER() to number every employee overall (not per department) from highest to lowest salary.",
      hint: "Drop the PARTITION BY entirely - ROW_NUMBER() OVER (ORDER BY ...) ranks across the whole table.",
      solution: "SELECT name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) as overall_rank FROM employees;",
    },
  },
  {
    title: "Views - saving a query as a virtual table",
    body: "A view takes the idea behind a CTE one step further: instead of a name that only exists for the duration of a single query, a view is a saved query that persists inside the database and can be reused across many different queries, by many different people, indefinitely. Writing CREATE VIEW sales_team AS SELECT * FROM employees WHERE department = 'Sales' doesn't copy or duplicate any data at all - it simply stores the query itself under a chosen name. From that point forward, SELECT * FROM sales_team re-runs the underlying query fresh every single time it's used, meaning the view always reflects the current state of the data, never a stale snapshot frozen from whenever it happened to be created. This makes views an excellent way to standardize a commonly used piece of logic - like 'the current sales team' - so that everyone across an organization works from the exact same definition, instead of relying on subtly different copy-pasted queries scattered everywhere.",
    altExplain: "It's a saved search. Once created, you can SELECT from the view name just like a real table, and it always reflects the latest data.",
    visual: null,
    query: "CREATE VIEW sales_team AS\n  SELECT * FROM employees WHERE department = 'Sales';\nSELECT * FROM sales_team;",
    keyTakeaway: "A view doesn't store its own copy of data - it re-runs its underlying query every time you SELECT from it, so it always shows current data.",
    commonMistake: "Trying to CREATE VIEW with the same name twice - you'll get an error unless you DROP VIEW first.",
    challenge: {
      prompt: "Create a view called big_orders showing only orders with amount over 2000, then select everything from it.",
      hint: "Same CREATE VIEW ... AS pattern, different filter condition.",
      solution: "CREATE VIEW big_orders AS\n  SELECT * FROM orders WHERE amount > 2000;\nSELECT * FROM big_orders;",
    },
  },
  {
    title: "Indexes & query performance",
    body: "As tables grow from a handful of rows to millions, the naive approach of scanning every single row to find a match becomes painfully, unacceptably slow. An index solves this the same way a book's index does: instead of reading every page to find a topic, you consult a compact, pre-sorted structure that points you directly to the right location, skipping everything else. Running CREATE INDEX idx_department ON employees(department) tells the database to build exactly this kind of lookup structure for the department column, dramatically speeding up any future query that filters or joins on that column specifically. This speed doesn't come for free, though - every time a row is inserted, updated, or deleted, any indexes on that table need to be updated too, which slightly slows down write operations. Because of this tradeoff, indexes are typically added deliberately, targeting columns that are frequently searched or joined on, rather than applied to every column just in case they might be useful someday.",
    altExplain: "Like a book's index - instead of reading every page to find a topic, the database jumps straight to the right spot using the index.",
    visual: "code",
    query: "CREATE INDEX idx_department ON employees(department);\nSELECT * FROM employees WHERE department = 'Sales';",
    keyTakeaway: "Indexes speed up reads but slightly slow down writes, since the index has to be updated too - don't index every column 'just in case.'",
    commonMistake: "Assuming more indexes always means a faster database - over-indexing a frequently-written table can actually hurt performance.",
    challenge: {
      prompt: "Create an index on the orders table's status column.",
      hint: "Same CREATE INDEX syntax, just point it at a different table and column.",
      solution: "CREATE INDEX idx_status ON orders(status);",
    },
  },
  {
    title: "Transactions & data integrity",
    body: "Some operations genuinely only make sense as a single, indivisible unit - transferring money between two bank accounts, for instance, requires both a debit and a credit to happen together, since a system that only completed half the operation would leave the data in a state that was never supposed to exist. A transaction groups multiple SQL statements into exactly this kind of all-or-nothing unit: BEGIN TRANSACTION marks the start, your statements run as normal, and COMMIT makes every change permanent all at once. If something goes wrong partway through - an error, a crash, or a deliberate decision to abort - ROLLBACK undoes everything back to the state it was in before BEGIN TRANSACTION, as though none of it had ever happened at all. This guarantee, that a group of changes either fully happens or doesn't happen at all, is one of the foundational promises a reliable database makes, and it's exactly what protects data integrity whenever multiple related changes need to stay in sync with one another.",
    altExplain: "It's an all-or-nothing bundle. If anything inside fails partway, the whole transaction is rolled back, so your data never ends up half-changed.",
    visual: "code",
    query: "BEGIN TRANSACTION;\nUPDATE employees SET salary = salary + 1000 WHERE department = 'Engineering';\nCOMMIT;",
    keyTakeaway: "ROLLBACK undoes everything since the last BEGIN TRANSACTION - it's your safety net if something goes wrong before COMMIT.",
    commonMistake: "Forgetting to COMMIT - some tools leave a transaction open, meaning your changes look successful to you but aren't actually saved yet.",
    challenge: {
      prompt: "Wrap a salary raise of 500 for the Marketing department in a transaction and commit it.",
      hint: "Same three-line pattern: BEGIN TRANSACTION, your UPDATE, COMMIT.",
      solution: "BEGIN TRANSACTION;\nUPDATE employees SET salary = salary + 500 WHERE department = 'Marketing';\nCOMMIT;",
    },
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "WITH name AS (SELECT ...) SELECT ... FROM name;", desc: "Names an intermediate result up front, referenced like a real table.", example: "WITH big AS (SELECT * FROM t WHERE x > 10)\nSELECT * FROM big;" },
      { syntax: "FUNC() OVER (PARTITION BY col ORDER BY col2)", desc: "Calculates across related rows while keeping every row visible.", example: "RANK() OVER (PARTITION BY dept ORDER BY salary DESC)" },
      { syntax: "CREATE VIEW name AS SELECT ...;", desc: "Saves a query as a virtual table you can SELECT from later.", example: "CREATE VIEW high_earners AS SELECT * FROM employees WHERE salary > 30000;" },
      { syntax: "CREATE INDEX idx_name ON table(column);", desc: "Speeds up lookups/filters on that column, at the cost of extra write overhead.", example: "CREATE INDEX idx_dept ON employees(department);" },
      { syntax: "BEGIN TRANSACTION; ... COMMIT; / ROLLBACK;", desc: "Groups statements so they all succeed together or none take effect.", example: "BEGIN TRANSACTION;\nUPDATE ...;\nCOMMIT;" },
    ],
  },
];

const SQL_QUIZ_BANK = {
  basic: [
    { q: "Which keyword picks which columns to return?", options: ["FROM", "SELECT", "WHERE", "TABLE"], correct: 1 },
    { q: "Which clause filters rows based on a condition?", options: ["ORDER BY", "GROUP BY", "WHERE", "SELECT"], correct: 2 },
    { q: "What does 'ORDER BY salary DESC' do?", options: ["Sorts lowest to highest", "Sorts highest to lowest", "Deletes rows", "Filters by salary"], correct: 1 },
    { q: "What does LIMIT 3 do?", options: ["Returns only 3 columns", "Returns only the first 3 rows", "Deletes rows over 3", "Filters salary under 3"], correct: 1 },
    { q: "Which symbol means 'not equal to' in SQL?", options: ["<>", "==", "!!", "%%"], correct: 0 },
  ],
  intermediate: [
    { q: "What does JOIN do?", options: ["Deletes duplicate rows", "Combines rows from two related tables", "Sorts a table", "Creates a new table"], correct: 1 },
    { q: "LEFT JOIN vs INNER JOIN - what's the key difference?", options: ["No difference", "LEFT JOIN keeps unmatched rows from the first table", "INNER JOIN keeps unmatched rows", "LEFT JOIN is faster"], correct: 1 },
    { q: "What does GROUP BY do?", options: ["Filters rows", "Bundles rows by shared value for summarizing", "Sorts columns alphabetically", "Deletes duplicate columns"], correct: 1 },
    { q: "Which function returns the total of a numeric column?", options: ["COUNT", "AVG", "SUM", "MAX"], correct: 2 },
    { q: "HAVING is used to...", options: ["Filter rows before grouping", "Filter groups after GROUP BY", "Sort results", "Join two tables"], correct: 1 },
  ],
  advanced: [
    { q: "What does a CTE (WITH ... AS) let you do?", options: ["Delete a table", "Name a temporary result set to reuse in your query", "Create an index", "Sort results"], correct: 1 },
    { q: "How is a window function different from GROUP BY?", options: ["It's the same thing", "It keeps every row visible while adding calculated info", "It only works on text columns", "It deletes duplicate rows"], correct: 1 },
    { q: "What is an index mainly used for?", options: ["Making tables smaller", "Speeding up lookups on a column", "Formatting output", "Creating backups"], correct: 1 },
    { q: "Why use a transaction?", options: ["To make queries run in parallel", "To group statements so they all succeed or all fail together", "To speed up SELECT statements", "To create a view"], correct: 1 },
    { q: "A VIEW is best described as...", options: ["A permanent copy of data frozen at creation time", "A saved query you can SELECT from like a table", "A type of index", "A backup file"], correct: 1 },
  ],
};

// =========================================================================
// Data Analytics - Entry Level
// =========================================================================
const DA_EMPLOYEES = [
  { name: "Ana Reyes", department: "Sales", salary: 32000, hireDate: "2022-03-14" },
  { name: "Marco Cruz", department: "Engineering", salary: 45000, hireDate: "2021-07-01" },
  { name: "Liza Santos", department: "Sales", salary: 29000, hireDate: "2023-01-20" },
  { name: "Jed Ramos", department: "Engineering", salary: 51000, hireDate: "2020-11-09" },
  { name: "Pia Torres", department: "Marketing", salary: 34000, hireDate: "2022-09-05" },
  { name: "Noel Dizon", department: "Marketing", salary: 30000, hireDate: "2023-06-11" },
];

const DA_ORDERS = [
  { employee: "Ana Reyes", amount: 1250, status: "paid" },
  { employee: "Liza Santos", amount: 800, status: "pending" },
  { employee: "Marco Cruz", amount: 4200, status: "paid" },
  { employee: "Jed Ramos", amount: 2100, status: "paid" },
  { employee: "Ana Reyes", amount: 600, status: "cancelled" },
];

const DA_ENTRY_BASIC = [
  {
    title: "What is data analytics?",
    body: "Data analytics is the discipline of taking raw numbers and turning them into decisions a person or a business can actually act on. It's easy to confuse this with the technical skill of retrieving data - writing a query, filling in a spreadsheet formula - but retrieval and interpretation are genuinely different skills that happen to frequently go together in the same job. Where SQL, or a spreadsheet, answers the question 'what does the data say,' analytics answers a harder set of follow-up questions: is this particular number good or bad, has it been changing over time, does it differ meaningfully across different groups, and - most importantly - what, if anything, should be done differently because of it. This course leans on spreadsheet-style, visual tools rather than written queries, because the skill being taught here is a way of thinking about data, not a particular syntax to memorize. By the end, the goal isn't just that you can calculate a number - it's that you instinctively know which number to calculate, and what real question you're trying to answer by calculating it.",
    altExplain: "SQL gets you the numbers. Analytics is deciding which numbers matter and what they're telling you - you'll mostly work with tables and charts here, not code.",
    visual: "diagram-analytics-flow",
    keyTakeaway: "Every analytics question follows the same shape: pick a metric, compare it to something (a target, a past period, another group), then decide what to do.",
    commonMistake: "Jumping straight to a chart before deciding what question you're actually trying to answer - a pretty chart that answers the wrong question wastes everyone's time.",
  },
  {
    title: "Key metrics & KPIs",
    body: "A KPI, short for Key Performance Indicator, is a specific number that an organization tracks regularly because it's believed to reflect something important about how well things are going - total revenue, average order value, active customer count, and so on. What separates a genuinely good KPI from an arbitrary number is that it should be simple enough to calculate consistently, difficult to inflate artificially without actually improving the underlying business, and clearly connected to an outcome someone actually cares about. In this lesson, you'll work directly with three related KPIs calculated from order data - total revenue, average order value, and order count - and you'll see firsthand how filtering the underlying orders, say to only paid orders versus only pending ones, can shift all three numbers substantially at once. This is an important early lesson in analytics: a single KPI, viewed in isolation, rarely tells the whole story, which is exactly why analysts almost always track a small cluster of related metrics side by side rather than fixating on just one in isolation.",
    altExplain: "A KPI is just one important number you check regularly to see if things are going well, like a scoreboard.",
    visual: null,
    widget: "kpi-cards",
    refBox: {
      syntax: "Average Order Value = Total Revenue / Number of Orders",
      desc: "A KPI is only as trustworthy as its filter - the same formula on \"paid\" vs. \"pending\" orders tells very different stories.",
      example: "$45,000 revenue / 300 orders = $150 average order value",
    },
    keyTakeaway: "A single KPI rarely tells the whole story - total revenue can go up while average order value quietly drops, so track a few related metrics together.",
    commonMistake: "Picking a KPI that's easy to inflate artificially (like 'number of orders' without checking if they're actually paid) instead of one that reflects real business health.",
    challenge: {
      prompt: "Switch the filter to \"pending\" and note the total and average - how different is it from \"paid\"? That gap is money sitting on the table.",
      hint: "Use the status dropdown above the KPI cards, not a formula.",
      solution: "Select \"pending\" in the dropdown and compare the Total Revenue and Avg Order Value cards to the \"paid\" view.",
    },
  },
  {
    title: "Measures of central tendency",
    body: "When someone asks 'what's a typical salary at this company,' there are two very different ways to answer, and choosing the wrong one can quietly mislead an entire conversation. The mean, or average, adds up every value and divides by how many there are - simple to compute, but easily distorted by even a single extremely large or small value sitting in the dataset. The median instead sorts every value from lowest to highest and picks the one sitting exactly in the middle, which makes it far more resistant to outliers, since one unusually high salary can't drag the median upward the way it inevitably drags the mean. In this lesson's interactive table, try editing a single employee's salary to something dramatically higher than the rest and watch what happens: the mean will jump noticeably, while the median barely moves, if it moves at all. That gap between the two numbers is itself useful information - whenever mean and median disagree substantially, it's a strong signal that your data is skewed by one or more outliers, and that reporting only the average would paint a genuinely misleading picture of what's actually 'typical.'",
    altExplain: "Mean = add everything up and divide. Median = sort everyone and pick the middle person. When there's one huge outlier, they disagree.",
    visual: "chart",
    widget: "stats-calc",
    refBox: {
      syntax: "Mean = sum of values / count of values",
      desc: "Median = the middle value when sorted (or the average of the two middle values, if the count is even).",
      example: "[10, 20, 30, 40, 200] \u2192 mean = 60, median = 30",
    },
    keyTakeaway: "When the mean and median are far apart, that's a signal your data is skewed by outliers - always check both, not just one.",
    commonMistake: "Reporting only the average salary of a company as 'typical pay' when a few executive salaries are dragging the mean far above what most employees actually earn.",
    challenge: {
      prompt: "Edit one employee's salary to 200,000 and watch what happens to the mean vs. the median.",
      hint: "Click directly into a salary cell in the table and type a new number.",
      solution: "The mean will jump noticeably; the median will barely move (or not move at all) - that gap is exactly what makes median more outlier-resistant.",
    },
  },
  {
    title: "Trends over time",
    body: "A single number, calculated once, is only a snapshot - it tells you where things stand right now, but says nothing at all about direction. A trend requires comparing that same number across multiple points in time, which is why grouping data by a time period - a year, a month, a week, depending on how granular the question requires - is one of the most fundamental techniques in all of analytics. In this lesson, employees are grouped by the year they were hired, letting you see whether hiring has been accelerating, slowing down, or staying flat over time - a far more useful question for planning purposes than simply knowing the current headcount in isolation. It's worth being careful, though, about what actually counts as a fair comparison: stacking a full year of data against a partial, still-in-progress year will make the incomplete period look artificially weak, even when the underlying pace of hiring hasn't actually changed at all.",
    altExplain: "One number tells you 'where you are.' A trend tells you 'where you're headed' - and that's usually the more useful question.",
    visual: null,
    widget: "trend-builder",
    keyTakeaway: "A trend needs at least 2-3 comparable time periods before it means anything - one data point is a snapshot, not a trend.",
    commonMistake: "Comparing two time periods of very different lengths (like 3 days vs. a full month) and concluding one is 'better' - always compare like-for-like time windows.",
  },
  {
    title: "Segmentation & pivot tables",
    body: "A single company-wide average often hides more than it reveals, because it silently blends together groups that may look nothing alike once separated. Segmentation is the practice of deliberately breaking a metric down by category - department, region, customer type, whatever dimension is actually relevant - instead of collapsing everything down into one flat number. Rather than reporting 'average salary is roughly 37,000' for an entire company, segmenting by department might reveal that Engineering sits meaningfully above that average while Sales sits noticeably below it, a distinction the overall average erases completely. This is essentially what a pivot table automates: you choose a category to group by, a number to summarize, and a way to summarize it - a total, an average, a count - and the tool handles splitting your data into those groups for you automatically. Watch for one pitfall as you segment, though: splitting data into groups so small that each one only contains two or three records tends to produce noisy, unreliable numbers that can look meaningful purely by chance alone.",
    altExplain: "Instead of one big average for everyone, split people into groups (like department) and compare the groups to each other - a pivot table does this automatically.",
    visual: null,
    widget: "pivot-builder",
    keyTakeaway: "If a company-wide average looks 'fine' but individual segments look very different from each other, the average is hiding the real story.",
    commonMistake: "Segmenting into groups so small (2-3 people) that the numbers are noisy and not statistically meaningful, then drawing big conclusions from them anyway.",
    challenge: {
      prompt: "Set the pivot to summarize orders by status, showing the sum of amount. Which status holds the most money?",
      hint: "Change the dataset dropdown to \"orders\", group by \"status\", metric \"amount\", aggregation \"sum\".",
      solution: "With dataset = orders, group by = status, metric = amount, aggregation = sum, you should see 'paid' holds the most total money.",
    },
  },
  {
    title: "Choosing the right visualization",
    body: "Different chart types are built to answer different kinds of questions, and picking the wrong one can make even perfectly correct data look confusing or, worse, subtly misleading. Bar charts excel at comparing distinct categories side by side - department against department, product against product - because the human eye is naturally very good at comparing the relative heights of bars. Line charts, by contrast, are built specifically for continuity: they're the natural choice whenever you're plotting something changing across a continuous sequence like time, since the connecting line itself visually represents the very idea of change from one point to the next. Pie charts attempt to show how individual parts make up a whole, but they run into trouble quickly - once there are more than four or five slices, human eyes genuinely struggle to accurately compare slice sizes against each other, which is why many analysts default to a simple bar chart even for 'share of total' style questions. The underlying principle worth internalizing here is that the right chart is determined by the question you're trying to answer, never by which option simply happens to look most visually interesting.",
    altExplain: "Comparing groups -> bar chart. Watching something change over time -> line chart. Showing how something splits into parts -> use a bar chart instead of pie once there are more than a few categories.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "You want to show how monthly revenue changed over the last 12 months. Which chart type fits best?",
      options: ["Pie chart", "Line chart", "Bar chart comparing departments", "A single KPI card"],
      correct: 1,
      explanation: "A line chart is built for showing change across a continuous sequence like time - it makes direction and rate of change immediately visible in a way a pie chart or single number can't.",
    },
    keyTakeaway: "The right chart type depends on the question you're answering, not on which chart looks the fanciest - a clear bar chart beats a confusing 3D pie chart every time.",
    commonMistake: "Defaulting to a pie chart for everything - once there are more than a handful of categories, pie slices become nearly impossible to compare accurately by eye.",
  },
  {
    title: "Data quality & common pitfalls",
    body: "Even a technically correct analysis can produce a badly misleading conclusion if the underlying data has problems, which is exactly why experienced analysts develop the habit of interrogating their data before trusting any result drawn from it. Two questions are worth asking almost every single time: is this dataset actually complete, with no unexpected missing rows, and is the sample large enough that a pattern found within it is likely to be real rather than random noise? Beyond raw data quality, one particular reasoning trap deserves special attention: correlation is not causation. Just because two numbers rise and fall together doesn't mean one is causing the other - both could be driven by some third factor entirely, as in the classic example of ice cream sales and drowning incidents both rising every summer, driven not by each other at all but by hot weather. Building the instinct to pause and ask 'could something else explain this pattern' before jumping to a causal conclusion is one of the single most valuable habits this entire course can teach you.",
    altExplain: "Bad or incomplete data gives confidently wrong answers. And just because two things happen together doesn't mean one is causing the other.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Ice cream sales and drowning incidents both rise every summer. What's the most likely explanation?",
      options: ["Ice cream causes drowning", "Drowning causes people to buy ice cream", "A third factor (hot weather) drives both", "The data must be wrong"],
      correct: 2,
      explanation: "This is the classic correlation-vs-causation trap: hot weather drives both more swimming (and drowning risk) and more ice cream sales - neither one causes the other directly.",
    },
    keyTakeaway: "Always ask 'how much data is this based on, and is it complete?' before trusting a conclusion - small or messy samples produce misleading results that still look precise.",
    commonMistake: "Seeing two metrics rise together and assuming one causes the other, instead of a shared underlying cause.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "A good KPI: simple, hard to game, tied to a real outcome", desc: "Not every trackable number makes a good KPI - these three properties separate the useful ones.", example: "Average Order Value = Total Revenue / Number of Orders" },
      { syntax: "Mean = sum / count", desc: "The average - easily distorted by a single extreme outlier.", example: "[10, 20, 30, 200] \u2192 mean = 65" },
      { syntax: "Median = the middle value when sorted", desc: "Far more resistant to outliers than the mean - when they disagree, that's a sign of skew.", example: "[10, 20, 30, 200] \u2192 median = 25" },
      { syntax: "Group by time period (year/month/week)", desc: "A single number is a snapshot; grouping over time reveals a trend.", example: "Hiring by year reveals whether it's accelerating or slowing." },
      { syntax: "Correlation \u2260 Causation", desc: "Two numbers moving together doesn't mean one causes the other - a third factor could drive both.", example: "Ice cream sales & drownings both rise with hot weather, not each other." },
    ],
  },
];

const DA_ENTRY_INTERMEDIATE = [
  {
    title: "Data cleaning & quality checks",
    body: "Every dataset pulled from the real world arrives with some amount of mess in it, and learning to spot that mess before analyzing anything is arguably a more valuable skill than any individual statistical technique you'll learn afterward. Duplicate rows can silently double-count something that only genuinely happened once, quietly inflating totals without any obvious warning sign. Inconsistent text values - 'Sales' recorded one way in one place and 'sales' or 'SALES' elsewhere - are especially dangerous because most tools treat text comparisons as case-sensitive by default, meaning what should be a single category quietly splits into two or three separate ones. Missing values create yet another kind of problem: depending on how a particular tool handles them, a gap in the data might get silently excluded from an average, treated as zero, or cause an outright error, and which of those happens can change your results substantially. Because cleaning issues are usually invisible at a casual glance - a spreadsheet full of inconsistent casing still looks perfectly normal on the surface - building the habit of actively checking for these problems, rather than assuming a dataset is clean simply because it looks tidy, is what separates careful analysis from confidently wrong analysis.",
    altExplain: "Messy data gives confidently wrong answers. Before trusting any number, check for duplicates, typos, and missing values first.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A dataset has 'Sales', 'sales', and 'SALES' listed as three different department values. What's the risk if you group by department without fixing this?",
      options: ["No risk, SQL/spreadsheets treat them as identical", "Sales gets split into 3 separate groups, undercounting the real total", "The database will throw an error", "This only matters for numbers, not text"],
      correct: 1,
      explanation: "Most tools treat text case-sensitively by default, so 'Sales' and 'sales' become two different groups - silently splitting what should be one category and making each group's numbers look smaller than reality.",
    },
    keyTakeaway: "Standardize text values (casing, spacing, spelling) before grouping or filtering by them - inconsistent categories are one of the most common silent sources of wrong analysis.",
    commonMistake: "Assuming a clean-looking spreadsheet means clean data - inconsistent casing and stray whitespace are invisible at a glance but break grouping and filtering.",
  },
  {
    title: "Percent change & growth rate",
    body: "Raw differences can be genuinely misleading because they ignore scale entirely - an increase of 5,000 means something very different for a small local shop than it does for a large national retailer, even though the raw number itself is identical in both cases. Percent change solves this by expressing an increase or decrease relative to where a value started, calculated as (new value minus old value), divided by the old value, then multiplied by 100. This relative framing is almost always more useful for comparison purposes than the raw difference alone, since it puts changes of very different sizes and starting points onto one common, directly comparable scale. One subtlety worth internalizing early: percent change and percentage points are not interchangeable, even though they sound similar - moving from a 20% conversion rate to a 25% conversion rate is a 5 percentage-point increase, but expressed as a percent change relative to the starting value, it's actually a 25% relative increase, and mixing these two framings up is an extremely common source of confusion in real-world reporting.",
    altExplain: "Percent change answers 'how big was the change, relative to where we started' - not just the raw number difference.",
    visual: null,
    widget: "percent-calc",
    refBox: {
      syntax: "Percent change = (new - old) / old \u00d7 100",
      desc: "Percentage points and percent change are NOT the same - 20% to 25% is +5 percentage points, but a +25% relative increase.",
      example: "(25 - 20) / 20 \u00d7 100 = 25% increase",
    },
    keyTakeaway: "A negative 'old' value or an old value of zero breaks percent change math - always sanity-check the baseline number before trusting the percentage.",
    commonMistake: "Confusing percentage points with percent change - going from 20% to 25% is a 5 percentage-point increase, but a 25% relative increase (5/20). These get mixed up constantly in reporting.",
  },
  {
    title: "Weighted averages",
    body: "A simple average treats every group feeding into it as equally important, regardless of how large or small that group actually happens to be - which can produce a genuinely misleading picture whenever group sizes differ substantially from one another. A weighted average corrects for this by factoring in each group's size, or some other measure of importance, when combining them together, so that a department with twenty employees pulls the overall number more than a department with only two ever could. Try editing the values in this lesson's table: as you make the headcount numbers more uneven, watch the gap between the simple average and the weighted average grow wider, illustrating exactly how much a naive average can misrepresent an unevenly distributed population. This distinction matters most whenever you're averaging numbers that are themselves already averages - like averaging each department's average salary together - since doing so without weighting silently gives disproportionate influence to small, low-headcount groups that shouldn't carry equal weight.",
    altExplain: "Simple average treats every group the same size. Weighted average gives bigger groups more influence on the final number - which usually matches reality better.",
    visual: null,
    widget: "weighted-avg-calc",
    refBox: {
      syntax: "Weighted avg = \u03a3(value \u00d7 weight) / \u03a3(weight)",
      desc: "Each group's contribution is scaled by its size - unlike a simple average, which treats every group equally.",
      example: "(50k\u00d720 + 70k\u00d72) / (20+2) = $51,818",
    },
    keyTakeaway: "When group sizes are very different, the simple average and weighted average can tell noticeably different stories - the weighted version usually better reflects the overall population.",
    commonMistake: "Averaging a set of already-averaged numbers (like 'the average of each department's average salary') without weighting by headcount - this silently overweights small departments.",
  },
  {
    title: "Comparing segments side-by-side",
    body: "Once you're comfortable calculating a metric for a single group, the natural and often far more valuable next step is placing two groups side by side so that any real difference between them becomes immediately visible at a glance. This kind of comparison - this month against last month, one team against another - is one of the most common and persuasive things an analyst can produce, because differences are almost always easier for an audience to grasp visually than a single isolated number could ever be on its own. For a comparison to actually be meaningful, though, both sides need to be measured the exact same way, over comparable time periods, using the same underlying definitions - comparing a complete month of data against a partial, still-accumulating month will make the incomplete period look artificially weak, regardless of whether real performance has genuinely changed at all. It's also worth staying alert to differences in group size: a percentage difference calculated from three people carries far less statistical weight than the exact same percentage difference calculated from three hundred, even though both might get reported using an identical-looking number on a slide.",
    altExplain: "Instead of looking at one group's number in isolation, put two groups next to each other so the difference is immediately visible.",
    visual: null,
    widget: "comparison-cards",
    keyTakeaway: "A comparison is only fair if both sides are measured the same way over the same time period - comparing a full month to a partial month will always mislead.",
    commonMistake: "Comparing two groups of very different sizes (3 people vs. 30 people) and treating a percentage difference as equally meaningful in both cases.",
  },
  {
    title: "Correlation between two variables",
    body: "A correlation coefficient, usually written as r, gives you a precise, single number describing how strongly two numeric variables move together - ranging from -1, a perfect inverse relationship where one rises exactly as the other falls, through 0, meaning no discernible relationship at all, up to +1, a perfect direct relationship where both rise and fall together in lockstep. This is a meaningfully more precise tool than simply eyeballing a chart and guessing that 'these two things seem related,' since it converts a vague visual impression into an exact, directly comparable number. It's critical to remember, though, that correlation - no matter how strong it measures out to be - never by itself proves that one variable causes the other; it only establishes that they tend to move together, leaving open the real possibility of coincidence, or a shared underlying cause that neither variable directly controls. This caution matters even more with small datasets: with only a handful of data points, as in the six-employee example used throughout this lesson, a correlation coefficient can look deceptively strong purely by chance, which is exactly why sample size should always be reported and considered alongside the correlation number itself, never quietly omitted.",
    altExplain: "The correlation number just tells you how tightly two things move together - a high number doesn't mean one is causing the other.",
    visual: null,
    widget: "correlation-calc",
    refBox: {
      syntax: "Correlation coefficient (r): ranges from -1 to +1",
      desc: "-1 = perfect inverse, 0 = no relationship, +1 = perfect direct relationship. Never proves causation on its own.",
      example: "r = 0.85 \u2192 strong positive relationship (but check sample size first)",
    },
    keyTakeaway: "With very few data points (like our 6 employees here), a correlation number can look strong purely by chance - treat correlations from small samples with real skepticism.",
    commonMistake: "Reporting a correlation coefficient without mentioning the sample size it's based on - a correlation of 0.9 means very different things with 6 data points versus 6,000.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Complete + consistent + large-enough sample", desc: "The three things worth checking about any dataset before trusting a conclusion from it.", example: "No unexpected missing rows; enough data for the pattern to be real." },
      { syntax: "Percent change = (new - old) / old \u00d7 100", desc: "NOT the same as percentage points - 20%\u219225% is +5pp but +25% relative.", example: "(25-20)/20\u00d7100 = 25%" },
      { syntax: "Weighted avg = \u03a3(value \u00d7 weight) / \u03a3(weight)", desc: "Scales each group's contribution by its size, unlike a simple average.", example: "(50k\u00d720 + 70k\u00d72)/(20+2) = $51,818" },
      { syntax: "Side-by-side comparison (same metric, different segments)", desc: "Puts two or more groups' numbers next to each other for direct comparison.", example: "This quarter's revenue by region, compared directly." },
      { syntax: "Correlation coefficient (r): -1 to +1", desc: "Measures how strongly two variables move together - never proves causation.", example: "r = 0.85 \u2192 strong positive relationship" },
    ],
  },
];

const DA_ENTRY_ADVANCED = [
  {
    title: "Cohort analysis",
    body: "A cohort is simply a group of people or events that share a common starting point in time - everyone hired in the same calendar year, everyone who signed up for a service in the same month, and so on. Cohort analysis tracks how each of these groups behaves afterward, which frequently uncovers patterns that a single company-wide number would completely obscure, such as whether more recently hired employees are being promoted or compensated differently than employees hired several years earlier. Conceptually, this is really just segmentation applied to a slightly unusual dimension: instead of grouping by a category like department, you're grouping by 'when someone started,' then comparing those time-based groups to each other using exactly the same pivot-table thinking you've already used elsewhere in this course. One important pitfall to watch for: comparing an older cohort that has had years to develop against a brand-new cohort that's only had a few weeks is fundamentally an unfair comparison, since the two groups are being measured at completely different points in their own lifecycle - the fair comparison is always cohort to cohort at the same relative age, never cohort to cohort at the same calendar date.",
    altExplain: "Instead of looking at everyone at once, group people by when they started, then compare those groups to each other over time.",
    visual: null,
    widget: "pivot-builder-cohort",
    keyTakeaway: "Cohort analysis is just segmentation where the segment is 'time joined' instead of a category like department - the same GROUP BY thinking, applied to a starting date.",
    commonMistake: "Comparing an old cohort (with years of data) to a brand-new cohort (with only weeks of data) as if they're at the same stage - always compare cohorts at the same 'age', not the same calendar date.",
  },
  {
    title: "A/B testing fundamentals",
    body: "An A/B test compares two versions of something - two email subject lines, two page designs, two prices - by randomly splitting an audience into two groups, showing each group a different version, and then measuring which one performs better against a specific, predefined metric. The genuinely difficult part of A/B testing isn't setting up the comparison itself, which is conceptually quite straightforward - it's having actually collected enough data before declaring a winner, since with a small enough sample, random chance alone can easily make one version appear to outperform the other even when the two are, in reality, no different at all. A result like 3 conversions out of 10 for one version versus 4 out of 10 for another, for example, is well within the range that pure randomness alone could plausibly produce, and declaring version B the definitive winner off numbers like these would be exactly the kind of mistake real A/B testing practice explicitly guards against by requiring much larger sample sizes - often hundreds or thousands of visitors per group - before drawing any conclusion at all.",
    altExplain: "Show two groups two different versions of something, measure which one does better - but only trust the result once you've tested on enough people.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Version A converts 3 out of 10 visitors. Version B converts 4 out of 10 visitors. Should you declare Version B the winner?",
      options: ["Yes, 4 is more than 3", "No — 10 visitors per group is far too small a sample to trust the difference", "Yes, but only if it happened on a weekend", "It's impossible to ever know without more info than this"],
      correct: 1,
      explanation: "With only 10 visitors per group, a single extra conversion easily happens by random chance alone. Real A/B tests typically need hundreds or thousands of visitors per group before a difference is trustworthy.",
    },
    keyTakeaway: "'Which number is bigger' is not the same question as 'is this difference real and not just random noise' - sample size is what separates the two.",
    commonMistake: "Stopping a test as soon as one version pulls ahead, instead of deciding on a sample size in advance and sticking to it - early leads in small samples reverse themselves constantly.",
  },
  {
    title: "Forecasting basics",
    body: "Forecasting attempts to answer a fundamentally different kind of question than everything covered so far in this course: not 'what happened,' but instead 'what's likely to happen next.' The simplest possible approach, often called a naive forecast, looks at how much a metric has been changing recently and simply assumes that recent pace of change will roughly continue for one more period - not a sophisticated technique by any stretch, but a legitimate and genuinely useful starting point nonetheless. In fact, a naive forecast serves as an important baseline in professional forecasting work: if a more sophisticated statistical model can't meaningfully outperform this simple 'assume the recent trend continues' approach, that more complex model isn't actually adding real value and probably isn't worth its added complexity. The biggest risk with any forecast, naive or sophisticated, is extrapolating a short-term trend too far into the future without stopping to question whether the conditions driving that trend will actually persist - three unusually strong months in a row are not a guarantee that the fourth month will continue at the exact same pace.",
    altExplain: "The simplest way to guess a future number: look at how much things have been changing recently, and assume that pattern roughly continues.",
    visual: null,
    widget: "forecast-calc",
    refBox: {
      syntax: "Naive forecast = last value + average recent change",
      desc: "The baseline every fancier forecasting model must beat to justify its added complexity.",
      example: "Last month: 100, avg monthly change: +8 \u2192 next month forecast: 108",
    },
    keyTakeaway: "A naive forecast (based on recent average change) is a legitimate baseline - if a fancier model can't beat this simple approach, the fancier model isn't adding value.",
    commonMistake: "Extrapolating a short-term trend far into the future without questioning whether the underlying conditions will stay the same - 3 good months don't guarantee the 4th will follow the same pace.",
  },
  {
    title: "Data storytelling & presenting to stakeholders",
    body: "Even flawless, rigorous analysis fails to create any real value if the people who need to act on it can't quickly understand what it means and what they're supposed to do about it. Effective data storytelling deliberately inverts the natural order in which analysis actually gets performed: rather than walking an audience through data cleaning, then exploration, then findings - the order the work was genuinely done in - it leads immediately with the single most important takeaway, then supports that takeaway with the one chart or number that makes the case most clearly. This matters enormously in time-constrained settings like an executive presentation, where an audience with only five minutes to spare needs the conclusion delivered up front, with the option to ask for supporting detail if they want to dig deeper, rather than being forced to sit through the same sequence of steps the analyst originally worked through to arrive there. Reordering a presentation this way - conclusion first, supporting detail second, methodology only if specifically asked - is frequently the single highest-leverage change an analyst can make to how their work actually lands with a non-technical audience.",
    altExplain: "Don't make people dig through numbers to find the point - say the conclusion first, then show the one chart that proves it.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "You're presenting quarterly results to executives with 5 minutes on the agenda. What's the better approach?",
      options: ["Show all 12 charts you built during analysis, in the order you made them", "Lead with the single most important takeaway and the one chart that supports it", "Focus entirely on your SQL queries and methodology", "Send a 40-page report instead and skip presenting"],
      correct: 1,
      explanation: "With limited time and a decision-making audience, leading with the conclusion and the single strongest supporting visual respects their time and drives action - the full analysis can back it up if they ask follow-up questions.",
    },
    keyTakeaway: "Lead with the conclusion, not the process - stakeholders want the 'so what,' and can ask for the underlying detail if they need it.",
    commonMistake: "Presenting analysis in the same order it was performed (data cleaning, then exploration, then findings) - audiences want the finding first, with supporting detail after.",
  },
  {
    title: "Statistical significance & small sample pitfalls",
    body: "A result is described as statistically significant when it's genuinely unlikely to have occurred purely by random chance - a meaningfully different and far more rigorous claim than simply noticing that two numbers happen to look different from each other. Small sample sizes make this distinction especially important, because with very little data, ordinary random variation can easily produce patterns that look dramatic and meaningful on the surface but would disappear entirely once more data was actually collected. Flipping a coin four times and getting three heads, for instance, happens reasonably often even with a perfectly fair coin - it would be a genuine mistake to conclude the coin itself is biased from a sample that small, and the exact same underlying logic applies just as strongly to business metrics drawn from only a small handful of data points. The core habit this closing lesson aims to build is a reflexive skepticism toward any 'interesting' looking result: before treating a pattern as meaningful, it's always worth asking how much data it's actually resting on, since a dramatic-looking swing built on a tiny sample is, far more often than not, noise rather than signal.",
    altExplain: "With very little data, random luck can easily create patterns that aren't really there. More data makes those false patterns disappear.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "You flip a coin 4 times and get heads 3 times (75%). Does this prove the coin is unfair?",
      options: ["Yes, 75% is clearly not 50%", "No — with only 4 flips, this result is common even for a perfectly fair coin", "Yes, but only if you flip it exactly 4 more times", "It's impossible to know anything from coin flips"],
      correct: 1,
      explanation: "With just 4 flips, getting 3 heads happens fairly often purely by chance, even with a perfectly fair coin. This is the same trap as judging a business metric from a tiny sample - small numbers create dramatic-looking but meaningless swings.",
    },
    keyTakeaway: "The smaller the sample, the more suspicious you should be of any 'interesting' pattern - dramatic-looking results from tiny samples are usually noise, not signal.",
    commonMistake: "Treating every number that looks different as meaningful, without asking how much data it's actually based on.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Cohort = group defined by a shared start point (signup month, etc.)", desc: "Tracks how a group's behavior changes over time since that shared starting point.", example: "% of January signups still active in month 3." },
      { syntax: "Control group vs. Variant group (A/B test)", desc: "One group sees the current version, one sees the change - the only way to isolate a true causal effect.", example: "50% see the old button, 50% see the new one." },
      { syntax: "Naive forecast = last value + average recent change", desc: "The baseline every fancier forecasting model must beat to justify its complexity.", example: "100 + avg change of 8 \u2192 forecast 108" },
      { syntax: "Lead with the takeaway, then the supporting data", desc: "Data storytelling structure - the conclusion first, not buried at the end.", example: "\"Revenue grew 12%\" before the chart that shows it." },
      { syntax: "Small sample \u2192 be suspicious of 'interesting' patterns", desc: "Dramatic results from tiny samples are usually noise, not signal.", example: "3 heads out of 4 coin flips proves nothing about fairness." },
    ],
  },
];

const DA_QUIZ_BANK = {
  basic: [
    { q: "What's the main difference between SQL and data analytics as skills?", options: ["They're the same thing", "SQL retrieves data; analytics interprets it to make decisions", "Analytics doesn't use data", "SQL is only for spreadsheets"], correct: 1 },
    { q: "Which is more resistant to outliers?", options: ["Mean (average)", "Median", "They're equally resistant", "Neither"], correct: 1 },
    { q: "What does segmentation help you find?", options: ["The company-wide average only", "Differences hidden inside subgroups of your data", "How to delete outliers", "The database schema"], correct: 1 },
    { q: "Which chart type is best for showing a trend over time?", options: ["Pie chart", "Line chart", "Bar chart", "None of these show trends"], correct: 1 },
    { q: "Correlation between two metrics means...", options: ["One definitely causes the other", "They move together, but that doesn't prove causation", "The data is wrong", "They are the same metric"], correct: 1 },
  ],
  intermediate: [
    { q: "Why is 'Sales' vs 'sales' vs 'SALES' a data quality problem?", options: ["It isn't, tools always merge them", "It silently splits one category into multiple groups", "It only affects charts, not tables", "It makes queries run slower"], correct: 1 },
    { q: "Percent change is calculated as...", options: ["new minus old", "(new - old) / old x 100", "new divided by old", "old minus new"], correct: 1 },
    { q: "A weighted average differs from a simple average by...", options: ["Ignoring outliers", "Accounting for group size when combining group averages", "Always being higher", "Only working with two groups"], correct: 1 },
    { q: "A fair comparison between two groups requires...", options: ["Different time periods for each", "The same measurement approach and time period for both", "One group to be much larger", "Rounding all numbers first"], correct: 1 },
    { q: "A correlation coefficient close to 0 means...", options: ["The two variables cause each other", "Little to no relationship between the variables", "The data is definitely wrong", "A perfect relationship"], correct: 1 },
  ],
  advanced: [
    { q: "A 'cohort' in cohort analysis is defined by...", options: ["A random sample", "A group sharing a common starting point in time", "Any group of 10 or more", "A single individual"], correct: 1 },
    { q: "Why is sample size critical in A/B testing?", options: ["It isn't, only the percentage matters", "Small samples can show a 'winner' purely by random chance", "Bigger samples are always cheaper", "It only matters for website tests"], correct: 1 },
    { q: "A 'naive forecast' is best described as...", options: ["A forecast with no basis at all", "A simple projection based on recent trend, used as a baseline", "Always wrong", "Only usable for financial data"], correct: 1 },
    { q: "When presenting to executives with limited time, you should...", options: ["Show every chart you made during analysis", "Lead with the key takeaway and strongest supporting chart", "Focus on your methodology first", "Avoid conclusions and let them decide"], correct: 1 },
    { q: "A dramatic-looking pattern from a very small sample is usually...", options: ["Definitely real", "Likely noise rather than a true pattern", "Always a data entry error", "Proof the metric is broken"], correct: 1 },
  ],
};

// =========================================================================
// Course content registry
// =========================================================================
// =========================================================================
// SQL - Professional Level
// =========================================================================
const SQL_PRO_BASIC = [
  {
    title: "NULL and three-valued logic",
    body: "NULL represents the absence of a value - not zero, not an empty string, but genuinely 'unknown or not applicable.' This has a surprising consequence: comparing NULL to anything with = , including another NULL, never returns true - it returns NULL itself, which SQL treats as neither a match nor a non-match. That's why SQL provides dedicated IS NULL and IS NOT NULL operators instead of expecting you to write WHERE column = NULL, which would silently return zero rows every time, no matter what. This 'three-valued logic' - true, false, and unknown - trips up nearly everyone the first time they encounter it, and understanding it early prevents a whole category of confusing, silent bugs later on.",
    altExplain: "NULL means 'unknown', not zero or blank. You can never check for it with =, only with IS NULL or IS NOT NULL.",
    visual: null,
    query: "SELECT * FROM employees WHERE hire_date IS NOT NULL;",
    keyTakeaway: "Always use IS NULL / IS NOT NULL to check for NULL - a plain = NULL comparison silently returns nothing.",
    commonMistake: "Writing WHERE column = NULL expecting it to find empty values - it returns zero rows every time, with no error to warn you.",
    challenge: {
      prompt: "Find any orders where the employee_id column is NULL (there aren't any in this dataset, but the query should still run correctly).",
      hint: "Use IS NULL, not = NULL.",
      solution: "SELECT * FROM orders WHERE employee_id IS NULL;",
    },
  },
  {
    title: "CASE expressions",
    body: "CASE lets you build conditional logic directly into a query, producing different output values depending on a condition - essentially an if/else statement usable anywhere a column could go. Writing CASE WHEN salary > 40000 THEN 'senior' ELSE 'standard' END as pay_tier adds a new computed column that labels each row based on its salary, without needing to change anything about the underlying data. Multiple WHEN branches can be chained together to handle several conditions in order, and SQL evaluates them top to bottom, stopping at the first one that matches. This is an extremely common technique for turning raw numbers into readable categories directly inside a query, rather than doing that categorization in a separate step afterward.",
    altExplain: "CASE is SQL's if/else. It lets you turn a number or condition into a readable label, right inside your SELECT statement.",
    visual: null,
    query: "SELECT name, salary,\n  CASE WHEN salary > 40000 THEN 'senior' ELSE 'standard' END as pay_tier\nFROM employees;",
    refBox: {
      syntax: "CASE WHEN cond THEN val ... ELSE default END",
      desc: "SQL's if/else - checked top to bottom, first matching WHEN wins.",
      example: "CASE WHEN x > 10 THEN 'big' ELSE 'small' END",
    },
    keyTakeaway: "CASE branches are checked in order, top to bottom - the first matching WHEN wins, even if a later one would also match.",
    commonMistake: "Forgetting the ELSE branch - rows that don't match any WHEN condition end up as NULL instead of a sensible default.",
    challenge: {
      prompt: "Label orders as 'large' if amount is over 2000, otherwise 'small'.",
      hint: "Same CASE WHEN ... THEN ... ELSE ... END pattern, applied to orders.amount.",
      solution: "SELECT id, amount, CASE WHEN amount > 2000 THEN 'large' ELSE 'small' END as size FROM orders;",
    },
  },
  {
    title: "String functions",
    body: "Real text data is rarely perfectly formatted, and SQL provides built-in functions to clean it up or transform it on the fly. UPPER() and LOWER() normalize casing, which is genuinely useful for comparing text that might be inconsistently capitalized. LENGTH() returns how many characters a string contains, and SUBSTR(text, start, length) extracts a piece of a string starting at a given position. These functions can be used anywhere a column would normally go, including inside a WHERE clause, which means you can filter or transform text as part of the same query instead of needing a separate cleanup step beforehand.",
    altExplain: "These are text tools: UPPER/LOWER change casing, LENGTH counts characters, SUBSTR grabs part of a string. Handy for cleaning up messy text.",
    visual: null,
    query: "SELECT name, UPPER(department) as dept_upper, LENGTH(name) as name_length FROM employees;",
    keyTakeaway: "Wrapping a column in UPPER() or LOWER() in a WHERE clause is a common fix for case-sensitive matching problems.",
    commonMistake: "Forgetting that these functions create a new computed value - UPPER(department) doesn't change the actual stored data, only the query's output.",
    challenge: {
      prompt: "Show each employee's name and how many characters are in their department name.",
      hint: "LENGTH(department) gives you the character count.",
      solution: "SELECT name, LENGTH(department) as dept_length FROM employees;",
    },
  },
  {
    title: "DISTINCT - removing duplicates",
    body: "Sometimes you only care about the unique values present in a column, not every individual row that contains them. DISTINCT, placed right after SELECT, removes duplicate rows from your results, collapsing repeated values down to a single appearance. SELECT DISTINCT department FROM employees returns each department name exactly once, no matter how many employees belong to it, which is a quick way to answer 'what are all the possible values here' without needing GROUP BY at all. DISTINCT considers the entire row, though, not just one column - if you select multiple columns, only rows that are identical across all of them get collapsed together.",
    altExplain: "DISTINCT removes duplicate rows from your results, so you see each unique value only once.",
    visual: null,
    query: "SELECT DISTINCT department FROM employees;",
    keyTakeaway: "SELECT DISTINCT col FROM table is a quick way to see all unique values in a column without GROUP BY.",
    commonMistake: "Using DISTINCT across multiple columns and expecting it to deduplicate just one of them - it only removes rows that are identical across every selected column.",
    challenge: {
      prompt: "Find every unique order status in the orders table.",
      hint: "Same DISTINCT pattern, applied to orders.status.",
      solution: "SELECT DISTINCT status FROM orders;",
    },
  },
  {
    title: "UNION vs UNION ALL",
    body: "UNION combines the results of two separate SELECT queries into a single result set, stacking rows from the first query on top of rows from the second. Plain UNION automatically removes any duplicate rows that appear in both queries, which requires extra work for the database to check for and eliminate - UNION ALL skips that check entirely and simply concatenates every row from both queries, duplicates included. Because of this, UNION ALL is meaningfully faster whenever you already know duplicates aren't a concern, or when you actually want to keep them. Both queries being combined must return the same number of columns, in compatible types, for a UNION to work at all.",
    altExplain: "UNION stacks two queries' results together and removes duplicates. UNION ALL does the same but keeps duplicates - and is faster because of it.",
    visual: null,
    query: "SELECT name FROM employees WHERE department = 'Sales'\nUNION\nSELECT name FROM employees WHERE salary > 40000;",
    refBox: {
      syntax: "SELECT ... UNION SELECT ...; / UNION ALL",
      desc: "Stacks two queries' results together. UNION removes duplicates; UNION ALL keeps them and is faster.",
      example: "SELECT a FROM t1\nUNION ALL\nSELECT a FROM t2;",
    },
    keyTakeaway: "If you know there won't be duplicates, or don't care about them, use UNION ALL - it skips the extra deduplication work.",
    commonMistake: "Using UNION when the two queries don't return the same number of columns - this throws an error rather than silently working.",
    challenge: {
      prompt: "Combine every employee name with every department name into one list, using UNION ALL so nothing gets removed.",
      hint: "Two SELECT statements, one from employees.name and one from departments.name, joined with UNION ALL.",
      solution: "SELECT name FROM employees\nUNION ALL\nSELECT name FROM departments;",
    },
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "col IS NULL / col IS NOT NULL", desc: "Checks for missing values - NULL can't be compared with = or !=.", example: "WHERE manager_id IS NULL" },
      { syntax: "CASE WHEN cond THEN val ... ELSE default END", desc: "SQL's if/else - checked top to bottom, first matching WHEN wins.", example: "CASE WHEN x > 10 THEN 'big' ELSE 'small' END" },
      { syntax: "UPPER() / LOWER() / TRIM() / SUBSTR()", desc: "Common string functions for cleaning or transforming text.", example: "UPPER(name)" },
      { syntax: "SELECT DISTINCT col FROM table;", desc: "Removes duplicate rows from the result.", example: "SELECT DISTINCT department FROM employees;" },
      { syntax: "SELECT ... UNION SELECT ...; / UNION ALL", desc: "Stacks two queries together - UNION removes duplicates, UNION ALL keeps them.", example: "SELECT a FROM t1\nUNION ALL\nSELECT a FROM t2;" },
    ],
  },
];

const SQL_PRO_INTERMEDIATE = [
  {
    title: "Multi-table joins",
    body: "Real schemas frequently involve more than two related tables, and SQL handles this by simply chaining additional JOIN clauses onto the same query. This dataset now includes a third table, departments, holding each department's budget and manager - joining employees to orders and then to departments in a single query lets you see an order, the employee who placed it, and that employee's department budget all in one unified result. Each additional JOIN needs its own ON clause specifying how that table connects to what's already been joined so far, and the order you chain them in generally doesn't affect the final result, only how the query reads.",
    altExplain: "You can JOIN as many tables as you need, one after another - each one just needs its own ON clause explaining how it connects.",
    visual: null,
    query: "SELECT employees.name, orders.amount, departments.budget\nFROM orders\nJOIN employees ON orders.employee_id = employees.id\nJOIN departments ON employees.department = departments.name;",
    keyTakeaway: "Each JOIN in a chain needs its own ON clause - there's no limit to how many tables you can connect this way.",
    commonMistake: "Mixing up which table a column belongs to once three or more tables are joined - prefixing every column with its table name avoids ambiguous column errors.",
    challenge: {
      prompt: "Show each employee's name alongside their department's manager.",
      hint: "Join employees to departments on department = name, then select employees.name and departments.manager.",
      solution: "SELECT employees.name, departments.manager FROM employees JOIN departments ON employees.department = departments.name;",
    },
  },
  {
    title: "Self-joins",
    body: "A self-join joins a table to itself, treating it as though it were two separate tables by giving each reference a different alias. This is useful whenever rows in a table need to be compared to other rows in that same table - for example, finding pairs of employees who work in the same department. Writing FROM employees a JOIN employees b ON a.department = b.department AND a.id < b.id compares every employee to every other employee in the same department, with the a.id < b.id condition preventing an employee from being paired with themselves and avoiding duplicate reversed pairs. Self-joins can feel conceptually strange at first, since you're joining a table to itself, but the aliasing is what makes it possible to treat the two references as distinct.",
    altExplain: "A self-join compares rows in a table to other rows in that same table, by giving the table two different nicknames (aliases) in the same query.",
    visual: null,
    query: "SELECT a.name as employee_1, b.name as employee_2, a.department\nFROM employees a\nJOIN employees b ON a.department = b.department AND a.id < b.id;",
    refBox: {
      syntax: "FROM table a JOIN table b ON a.col = b.col AND a.id < b.id",
      desc: "A self-join - a table joined to itself using two aliases to compare its own rows.",
      example: "FROM employees a JOIN employees b ON a.dept = b.dept",
    },
    keyTakeaway: "Self-joins require aliasing the same table twice (like a and b) so the database can tell the two references apart.",
    commonMistake: "Forgetting a condition like a.id < b.id, which results in every pair appearing twice (once each direction) plus every employee paired with themselves.",
    challenge: {
      prompt: "Find pairs of employees in the same department where one earns more than the other.",
      hint: "Same self-join structure, add a.salary > b.salary to the ON condition.",
      solution: "SELECT a.name, b.name, a.department FROM employees a JOIN employees b ON a.department = b.department AND a.salary > b.salary;",
    },
  },
  {
    title: "EXISTS and NOT EXISTS",
    body: "EXISTS checks whether a subquery returns any rows at all, without caring how many or what they contain - it evaluates to simply true or false. This makes it a fast, readable way to answer 'does at least one matching row exist' style questions, like finding employees who have placed at least one order. NOT EXISTS flips this to find rows where no matching row exists in the subquery, which is often clearer and can perform better than the equivalent LEFT JOIN plus IS NULL pattern from earlier in this course. Because EXISTS only checks for existence rather than retrieving actual values, the columns selected inside the subquery don't actually matter - SELECT 1 is a common convention to signal that intent clearly.",
    altExplain: "EXISTS asks a yes/no question: does at least one matching row exist? NOT EXISTS asks the opposite - is there no match at all?",
    visual: null,
    query: "SELECT name FROM employees e\nWHERE EXISTS (SELECT 1 FROM orders o WHERE o.employee_id = e.id);",
    refBox: {
      syntax: "WHERE EXISTS (SELECT 1 FROM t WHERE ...) / NOT EXISTS",
      desc: "Checks true/false whether a subquery returns any row - fast, doesn't care what the row contains.",
      example: "WHERE NOT EXISTS (SELECT 1 FROM orders WHERE ...)",
    },
    keyTakeaway: "EXISTS only checks whether any row matches, not what's in it - SELECT 1 inside the subquery is a common convention.",
    commonMistake: "Using EXISTS when you actually need the matched values themselves - EXISTS only tells you true/false, not what matched.",
    challenge: {
      prompt: "Find employees who have never placed an order, using NOT EXISTS.",
      hint: "Same structure as the example, just add NOT before EXISTS.",
      solution: "SELECT name FROM employees e WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.employee_id = e.id);",
    },
  },
  {
    title: "Correlated subqueries",
    body: "A correlated subquery is a subquery that references a column from the outer query, meaning it can't be run on its own - it needs to be re-evaluated once for every row the outer query considers. This is different from the subqueries covered earlier in this course, which were calculated once and reused across the whole query. Writing SELECT name, salary FROM employees e WHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department) finds employees earning more than their own department's average, rather than the company-wide average - the inner query's WHERE clause depends on e.department, which changes for every row being checked. Correlated subqueries are powerful but can be slower on large tables, since the inner query effectively runs once per outer row instead of just once overall.",
    altExplain: "A correlated subquery looks at the current row from the outer query while it runs - so it gets recalculated for every single row, not just once.",
    visual: null,
    query: "SELECT name, salary, department FROM employees e\nWHERE salary > (SELECT AVG(salary) FROM employees WHERE department = e.department);",
    keyTakeaway: "A correlated subquery re-runs once per outer row, since it depends on a value from that row - this can be slow on very large tables.",
    commonMistake: "Confusing a correlated subquery with a regular one - if the inner query references a column from the outer query, it's correlated and behaves differently.",
    challenge: {
      prompt: "Find employees earning less than the maximum salary in their own department.",
      hint: "Same correlated pattern, swap AVG for MAX and > for <.",
      solution: "SELECT name, salary, department FROM employees e WHERE salary < (SELECT MAX(salary) FROM employees WHERE department = e.department);",
    },
  },
  {
    title: "INSERT, UPDATE, and DELETE",
    body: "Every query so far in this course has only read data with SELECT - but SQL also provides statements for actually changing what's stored. INSERT INTO adds a new row to a table, UPDATE modifies existing rows that match a WHERE condition, and DELETE removes rows matching a condition entirely. Both UPDATE and DELETE are genuinely dangerous without a WHERE clause, since leaving it off applies the change to every single row in the table at once - always double-check a WHERE clause is present, and consider testing it first as a SELECT with the same condition, before running the UPDATE or DELETE for real. These three statements, together with SELECT, are often referred to as the core of SQL's data manipulation capability.",
    altExplain: "INSERT adds a new row. UPDATE changes existing rows. DELETE removes rows. Always double check your WHERE clause before running UPDATE or DELETE.",
    visual: "code",
    query: "INSERT INTO employees (id, name, department, salary, hire_date)\nVALUES (7, 'Test Employee', 'Sales', 31000, '2024-01-01');\nSELECT * FROM employees WHERE id = 7;",
    keyTakeaway: "Always include a WHERE clause with UPDATE and DELETE - without one, the change applies to every row in the table.",
    commonMistake: "Running DELETE FROM table; with no WHERE clause at all, which deletes every row in the table with no warning or confirmation.",
    challenge: {
      prompt: "Update the test employee's salary to 33000, then confirm the change with a SELECT.",
      hint: "UPDATE employees SET salary = 33000 WHERE id = 7; then SELECT to check it.",
      solution: "UPDATE employees SET salary = 33000 WHERE id = 7;\nSELECT * FROM employees WHERE id = 7;",
    },
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "FROM t1 JOIN t2 ON ... JOIN t3 ON ...", desc: "Joins more than two tables together in a single query.", example: "FROM orders JOIN employees ON ... JOIN departments ON ..." },
      { syntax: "FROM table a JOIN table b ON a.col = b.col AND a.id < b.id", desc: "A self-join - a table joined to itself using two aliases.", example: "FROM employees a JOIN employees b ON a.dept = b.dept" },
      { syntax: "WHERE EXISTS (SELECT 1 FROM t WHERE ...) / NOT EXISTS", desc: "Checks true/false whether a subquery returns any row.", example: "WHERE NOT EXISTS (SELECT 1 FROM orders WHERE ...)" },
      { syntax: "WHERE col = (SELECT ... WHERE outer.id = inner.id)", desc: "A correlated subquery - re-evaluated once per outer row, referencing the outer query.", example: "WHERE salary > (SELECT AVG(salary) FROM employees e2 WHERE e2.dept = e.dept)" },
      { syntax: "INSERT INTO t (...) VALUES (...); / UPDATE t SET ... WHERE ...; / DELETE FROM t WHERE ...;", desc: "The three statements that change data - always include WHERE on UPDATE/DELETE.", example: "UPDATE employees SET salary = 33000 WHERE id = 7;" },
    ],
  },
];

const SQL_PRO_ADVANCED = [
  {
    title: "Recursive CTEs",
    body: "A recursive CTE is a Common Table Expression that refers to itself, allowing it to build up a result step by step - essential for working with hierarchical or sequential data, like an org chart, a category tree, or generating a sequence of numbers. It's written with WITH RECURSIVE, combining a starting point (the 'anchor' query) with a rule for generating each next step (the 'recursive' query), joined together with UNION ALL. The recursion keeps applying that rule, feeding each result back in as input to generate the next, until the recursive query stops producing new rows. This is a genuinely more advanced pattern than anything covered earlier in this course, since the query effectively refers to its own output while still running.",
    altExplain: "A recursive CTE builds a result step-by-step, using its own previous output as input for the next step - useful for org charts, trees, or number sequences.",
    visual: null,
    query: "WITH RECURSIVE counter(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM counter WHERE n < 5\n)\nSELECT * FROM counter;",
    refBox: {
      syntax: "WITH RECURSIVE name AS (anchor UNION ALL recursive_step) SELECT ...",
      desc: "A CTE that refers to itself - builds a result step by step, needs a stopping condition.",
      example: "WITH RECURSIVE counter(n) AS (\n  SELECT 1 UNION ALL SELECT n+1 FROM counter WHERE n < 5\n) SELECT * FROM counter;",
    },
    keyTakeaway: "A recursive CTE needs an anchor (starting point) and a recursive step joined with UNION ALL, plus a condition that eventually stops it.",
    commonMistake: "Forgetting a stopping condition in the recursive part - without one, the recursion runs indefinitely (or until it hits a safety limit).",
    challenge: {
      prompt: "Modify the counter example to count from 1 up to 10 instead of 5.",
      hint: "Just change the WHERE n < 5 condition to WHERE n < 10.",
      solution: "WITH RECURSIVE counter(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM counter WHERE n < 10\n)\nSELECT * FROM counter;",
    },
  },
  {
    title: "Triggers",
    body: "A trigger is a piece of logic that automatically runs whenever a specific event happens to a table - an INSERT, UPDATE, or DELETE - without needing to be explicitly called. Writing CREATE TRIGGER sets up a rule like 'whenever a row is inserted into orders, also do this other thing,' which is useful for enforcing business rules or keeping related data in sync automatically, without relying on every application that touches the database to remember to do it manually. Triggers run invisibly in the background from the perspective of whoever issued the original INSERT or UPDATE, which makes them powerful but also somewhat risky - unexpected side effects hidden inside a trigger can be genuinely difficult to debug later, since the behavior isn't visible at the point where the original statement was written.",
    altExplain: "A trigger automatically runs some extra logic whenever something happens to a table, like an insert or update - without anyone having to call it directly.",
    visual: "code",
    query: "CREATE TRIGGER log_new_order\nAFTER INSERT ON orders\nBEGIN\n  UPDATE employees SET salary = salary WHERE id = NEW.employee_id;\nEND;",
    keyTakeaway: "Triggers run automatically and invisibly - powerful for enforcing rules, but can make debugging harder since the logic isn't visible at the call site.",
    commonMistake: "Overusing triggers for logic that would be clearer as explicit application code - hidden automatic behavior can surprise the next person working with the database.",
  },
  {
    title: "EXPLAIN QUERY PLAN",
    body: "Before optimizing a slow query, you need to know what the database is actually doing to execute it - EXPLAIN QUERY PLAN reveals exactly that, without actually running the query for real. Placing it before a SELECT returns a description of the steps the database intends to take: which tables it scans, whether it uses an available index or reads every row, and how it plans to join multiple tables together. Reading this output takes some practice, but the single most important thing to look for early on is whether a query is doing a 'SCAN' (reading every row) versus a 'SEARCH' (using an index to jump directly to relevant rows) on a large table - the difference between those two can be the entire explanation for why a query feels slow.",
    altExplain: "EXPLAIN QUERY PLAN shows you what the database plans to do before it actually runs your query - which tables it scans, and whether it uses an index.",
    visual: null,
    query: "EXPLAIN QUERY PLAN\nSELECT * FROM employees WHERE department = 'Sales';",
    keyTakeaway: "Look for SCAN (reading every row) vs SEARCH (using an index) in the output - that distinction usually explains why a query is fast or slow.",
    commonMistake: "Optimizing a query based on guesswork instead of actually checking its EXPLAIN QUERY PLAN output first.",
  },
  {
    title: "Constraints & schema design",
    body: "Constraints let you enforce rules about what data is allowed into a table, catching bad data at the database level instead of relying entirely on application code to prevent it. PRIMARY KEY ensures a column uniquely identifies each row, FOREIGN KEY ensures a value in one table actually corresponds to a real row in another, UNIQUE prevents duplicate values in a column, NOT NULL requires a value to always be present, and CHECK enforces a custom condition, like a salary always being positive. Defining these constraints up front, when a table is first created, is one of the most effective ways to prevent an entire category of data quality problems from ever entering the database in the first place, rather than needing to clean them up after the fact.",
    altExplain: "Constraints are rules the database enforces automatically - like 'this column can't be empty' or 'this value must be positive' - so bad data never gets in.",
    visual: "code",
    query: "CREATE TABLE test_products (\n  id INTEGER PRIMARY KEY,\n  name TEXT NOT NULL,\n  price INTEGER CHECK (price > 0)\n);\nINSERT INTO test_products VALUES (1, 'Widget', 25);\nSELECT * FROM test_products;",
    refBox: {
      syntax: "PRIMARY KEY / FOREIGN KEY / UNIQUE / NOT NULL / CHECK (cond)",
      desc: "Table-level rules that reject bad data automatically, before it's ever stored.",
      example: "price INTEGER CHECK (price > 0)",
    },
    keyTakeaway: "Constraints defined when a table is created catch bad data automatically, before it's ever stored - cheaper than cleaning it up afterward.",
    commonMistake: "Relying entirely on application code to validate data, with no database-level constraints as a backup - a bug or a different application writing to the same table can bypass application-level checks entirely.",
  },
  {
    title: "Normalization basics",
    body: "Normalization is the process of organizing a database's tables to minimize redundant data and avoid certain kinds of update anomalies. First Normal Form (1NF) requires that every column hold a single, indivisible value rather than a list crammed into one field. Second Normal Form (2NF) requires that every non-key column depend on the entire primary key, not just part of it. Third Normal Form (3NF) requires that non-key columns depend only on the primary key, not on each other. In practice, our employees table storing department as plain text rather than a separate departments table is a mild normalization violation - it's why department names need to match exactly everywhere, and why this course introduced a separate departments table to properly normalize that relationship.",
    altExplain: "Normalization means organizing tables so information isn't needlessly duplicated, and so updating one fact doesn't require finding and changing it in multiple places.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A table stores 'Manila, Philippines' as one text value in a single 'location' column. Which normalization rule does this most directly violate?",
      options: ["Third Normal Form (3NF)", "First Normal Form (1NF) - the value isn't broken into indivisible parts", "Second Normal Form (2NF)", "No rule is violated"],
      correct: 1,
      explanation: "1NF requires each column to hold a single, indivisible value. Cramming both city and country into one field makes it harder to filter or aggregate by either piece individually - splitting them into separate columns would fix this.",
    },
    keyTakeaway: "Normalization trades some duplication-avoidance for more JOINs - a fully normalized schema is 'correct' but not always the fastest to query.",
    commonMistake: "Over-normalizing a schema to the point where nearly every query needs five or six JOINs just to answer a simple question.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "WITH RECURSIVE name AS (anchor UNION ALL recursive_step) SELECT ...", desc: "A CTE that refers to itself - needs a stopping condition.", example: "WITH RECURSIVE counter(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM counter WHERE n < 5) SELECT * FROM counter;" },
      { syntax: "CREATE TRIGGER name AFTER action ON table BEGIN ... END;", desc: "Runs automatically in response to an INSERT/UPDATE/DELETE on a table.", example: "CREATE TRIGGER log_update AFTER UPDATE ON employees ..." },
      { syntax: "EXPLAIN QUERY PLAN SELECT ...;", desc: "Shows how the database intends to execute a query - reveals if an index is used.", example: "EXPLAIN QUERY PLAN SELECT * FROM employees WHERE id = 5;" },
      { syntax: "PRIMARY KEY / FOREIGN KEY / UNIQUE / NOT NULL / CHECK (cond)", desc: "Table-level rules that reject bad data automatically.", example: "price INTEGER CHECK (price > 0)" },
      { syntax: "Normal forms (1NF, 2NF, 3NF)", desc: "Guidelines for structuring tables to minimize redundancy and inconsistency.", example: "Split repeating groups into their own table (1NF)." },
    ],
  },
];

// =========================================================================
// SQL - Master Level
// =========================================================================
const SQL_MASTER_BASIC = [
  {
    title: "Query execution order",
    body: "SQL queries are written in one order - SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY - but the database doesn't actually execute them in that order at all. The real execution order is FROM (identify the tables), WHERE (filter individual rows), GROUP BY (bundle rows into groups), HAVING (filter those groups), SELECT (choose and compute final columns), then ORDER BY (sort the result), and finally LIMIT. This explains several things that otherwise seem like arbitrary rules: why WHERE can't reference an aggregate function like COUNT(*) (it runs before grouping even happens), why HAVING can (it runs after), and why ORDER BY can reference a column alias defined in SELECT (it runs last, after that alias already exists).",
    altExplain: "SQL is written SELECT-first, but runs FROM/WHERE/GROUP BY/HAVING/SELECT/ORDER BY - in that order. That's why WHERE can't use an aggregate but HAVING can.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Why does WHERE COUNT(*) > 5 fail, while HAVING COUNT(*) > 5 works?",
      options: ["WHERE just has a typo requirement", "WHERE runs before grouping happens, so COUNT(*) doesn't exist yet at that stage", "COUNT(*) is not a real function", "There's no actual difference between them"],
      correct: 1,
      explanation: "WHERE executes before GROUP BY in SQL's real execution order, so aggregate functions like COUNT(*) haven't been calculated yet at that point. HAVING runs after grouping, when aggregates are available.",
    },
    keyTakeaway: "Memorize the real execution order (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT) - it explains most of SQL's 'weird' rules.",
    commonMistake: "Trying to use a column alias defined in SELECT inside a WHERE clause - it doesn't exist yet at that stage of execution, only later in ORDER BY.",
  },
  {
    title: "INTERSECT and EXCEPT",
    body: "Beyond UNION, SQL provides two other ways to combine the results of two queries based on set logic. INTERSECT returns only the rows that appear in both queries' results - the overlap between the two sets. EXCEPT (sometimes called MINUS in other databases) returns rows that appear in the first query's results but not in the second, effectively subtracting one set from another. Like UNION, both queries being combined need to return the same number of columns in compatible types. These operators come up less often than JOIN or UNION, but they express certain questions - 'what's common between these two lists' or 'what's in this list but not that one' - more directly than an equivalent JOIN-based query would.",
    altExplain: "INTERSECT finds rows common to both queries. EXCEPT finds rows in the first query that aren't in the second - like subtracting one list from another.",
    visual: null,
    query: "SELECT department FROM employees\nINTERSECT\nSELECT name FROM departments;",
    refBox: {
      syntax: "SELECT ... INTERSECT SELECT ...; / EXCEPT",
      desc: "INTERSECT keeps rows common to both queries; EXCEPT keeps rows in the first but not the second.",
      example: "SELECT a FROM t1\nEXCEPT\nSELECT a FROM t2;",
    },
    keyTakeaway: "INTERSECT = common to both queries. EXCEPT = in the first query but not the second. Both need matching column counts and types.",
    commonMistake: "Reaching for a complex JOIN or subquery when INTERSECT or EXCEPT would express the same question much more directly.",
  },
  {
    title: "Date and time functions",
    body: "SQLite stores dates as plain text, but provides functions that understand and manipulate them as real dates rather than arbitrary strings. strftime(format, column) extracts or reformats parts of a date - '%Y' for year, '%m' for month, and so on, which you've already used earlier in this course. date(column, modifier) performs date arithmetic, like date(hire_date, '+1 year') to calculate an anniversary. These functions let you answer time-based questions directly in SQL - like 'how many days has each employee been employed' - without needing to export the data to another tool just to do date math.",
    altExplain: "strftime pulls out parts of a date (year, month). date() lets you do date math, like adding a year to a hire date, right inside SQL.",
    visual: null,
    query: "SELECT name, hire_date, date(hire_date, '+1 year') as first_anniversary FROM employees;",
    keyTakeaway: "strftime extracts parts of a date; date() performs date arithmetic - both work directly on text-stored dates without extra conversion.",
    commonMistake: "Trying to do date math with plain subtraction or string manipulation instead of using the built-in date functions designed for it.",
  },
  {
    title: "Conditional aggregation",
    body: "Combining CASE with an aggregate function like SUM lets you calculate multiple conditional totals in a single query, instead of running several separate queries. SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) adds up only the amounts where the condition is true, treating every other row as contributing zero to that particular sum. This pattern is extremely common in reporting, since it lets you produce something like 'total paid, total pending, and total cancelled' as three separate columns in one single row of output, rather than needing three separate queries or a more complex pivot.",
    altExplain: "Wrapping CASE inside SUM lets you total up just the rows that match a condition - a way to calculate several different totals in one query.",
    visual: null,
    query: "SELECT\n  SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) as paid_total,\n  SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_total\nFROM orders;",
    refBox: {
      syntax: "SUM(CASE WHEN cond THEN value ELSE 0 END)",
      desc: "Calculates a conditional total - only rows matching the condition contribute to the sum.",
      example: "SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)",
    },
    keyTakeaway: "SUM(CASE WHEN ... THEN value ELSE 0 END) is the standard pattern for calculating multiple conditional totals in a single query.",
    commonMistake: "Forgetting the ELSE 0 - without it, non-matching rows contribute NULL instead of zero, which can silently break the SUM depending on the database.",
  },
  {
    title: "Pivoting rows into columns",
    body: "A pivot transforms data from a 'long' shape - one row per category - into a 'wide' shape, with one column per category instead. SQL doesn't have a dedicated PIVOT keyword in every database, but the conditional aggregation pattern from the previous lesson achieves exactly the same result: each conditional SUM becomes one column of the pivoted output. This is precisely what a pivot table in a spreadsheet is doing conceptually, just expressed as raw SQL instead of a drag-and-drop interface, and understanding this connection makes it much easier to translate between 'I want this pivoted a certain way' and the actual SQL needed to produce it.",
    altExplain: "Pivoting turns rows into columns - like turning 'one row per status' into 'one column per status.' Conditional SUMs achieve the same effect as a spreadsheet pivot table.",
    visual: null,
    query: "SELECT\n  department,\n  SUM(CASE WHEN salary > 40000 THEN 1 ELSE 0 END) as high_earners,\n  SUM(CASE WHEN salary <= 40000 THEN 1 ELSE 0 END) as standard_earners\nFROM employees\nGROUP BY department;",
    keyTakeaway: "A 'pivot' in SQL is usually just GROUP BY combined with one conditional SUM (or COUNT) per column you want to produce.",
    commonMistake: "Assuming every database has a built-in PIVOT keyword - many don't, and the conditional aggregation pattern works everywhere.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "FROM \u2192 WHERE \u2192 GROUP BY \u2192 HAVING \u2192 SELECT \u2192 ORDER BY \u2192 LIMIT", desc: "The logical order SQL actually evaluates clauses in - not the order they're written.", example: "WHERE runs before SELECT's aliases exist." },
      { syntax: "SELECT ... INTERSECT SELECT ...; / EXCEPT", desc: "INTERSECT keeps rows common to both queries; EXCEPT keeps rows in the first but not the second.", example: "SELECT a FROM t1\nEXCEPT\nSELECT a FROM t2;" },
      { syntax: "DATE('now') / strftime('%Y-%m', col)", desc: "Common date/time functions - format, extract parts, or do date math.", example: "strftime('%Y', hire_date)" },
      { syntax: "SUM(CASE WHEN cond THEN value ELSE 0 END)", desc: "Calculates a conditional total - only matching rows contribute.", example: "SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END)" },
      { syntax: "GROUP BY col + conditional SUM per output column", desc: "The standard way to pivot rows into columns in SQL.", example: "SUM(CASE WHEN salary > 40000 THEN 1 ELSE 0 END)" },
    ],
  },
];

const SQL_MASTER_INTERMEDIATE = [
  {
    title: "LAG and LEAD",
    body: "LAG and LEAD are window functions that let a row 'see' a value from a neighboring row, without needing a self-join. LAG(column) OVER (ORDER BY ...) retrieves the value from the previous row in the specified order, while LEAD(column) OVER (ORDER BY ...) retrieves the value from the next row. This is exactly what's needed for period-over-period comparisons, like calculating how much salary changed from one hire to the next in chronological order - something that would otherwise require an awkward self-join to accomplish. Both functions accept an optional second argument specifying how many rows back or forward to look, defaulting to exactly one row away.",
    altExplain: "LAG looks at the previous row's value; LEAD looks at the next row's value - both without needing a self-join. Great for comparing a row to its neighbor.",
    visual: null,
    query: "SELECT name, hire_date, salary,\n  LAG(salary) OVER (ORDER BY hire_date) as previous_hire_salary\nFROM employees;",
    refBox: {
      syntax: "LAG(col) OVER (ORDER BY col2) / LEAD(col) OVER (ORDER BY col2)",
      desc: "LAG sees the previous row's value; LEAD sees the next row's - no self-join needed.",
      example: "LEAD(salary) OVER (ORDER BY hire_date)",
    },
    keyTakeaway: "LAG/LEAD let you compare a row to its neighbor in sorted order, without a self-join - essential for period-over-period calculations.",
    commonMistake: "Forgetting the ORDER BY inside OVER(...) - without it, 'previous row' is meaningless since there's no defined order to look backward or forward through.",
  },
  {
    title: "Running totals",
    body: "A running total accumulates a sum as you move through a sorted set of rows, showing not just each individual value but the cumulative total up to that point. SUM(amount) OVER (ORDER BY id) computes exactly this: for each row, it sums every row from the start of the ordered sequence up through the current one. This is a classic window function use case, since it needs to see multiple rows to compute each value while still returning one row of output per input row, exactly like the ranking examples covered earlier in this course. Running totals are extremely common in financial reporting, inventory tracking, and any scenario involving cumulative progress over time.",
    altExplain: "A running total adds up as you go - each row shows the sum of everything up to and including itself, in a chosen order.",
    visual: null,
    query: "SELECT id, amount, SUM(amount) OVER (ORDER BY id) as running_total FROM orders;",
    refBox: {
      syntax: "SUM(col) OVER (ORDER BY col2)",
      desc: "A running total - each row shows the cumulative sum up through itself, in the chosen order.",
      example: "SUM(amount) OVER (ORDER BY id) as running_total",
    },
    keyTakeaway: "SUM(column) OVER (ORDER BY ...) with no PARTITION BY computes a running total across the entire ordered result.",
    commonMistake: "Adding a PARTITION BY when you actually wanted one continuous running total - partitioning resets the sum at each group boundary instead.",
  },
  {
    title: "Window frame clauses",
    body: "By default, a window function like SUM() OVER (ORDER BY ...) considers every row from the start up through the current row - but you can control this precisely with a frame clause like ROWS BETWEEN. Writing ROWS BETWEEN 2 PRECEDING AND CURRENT ROW limits the calculation to only the current row plus the two rows immediately before it, producing a moving average or moving sum instead of a full running total. This level of control is what makes window functions genuinely powerful for time-series style analysis, letting you calculate rolling metrics like a 7-day moving average directly in SQL, without needing to export data to a separate tool.",
    altExplain: "A frame clause controls exactly which nearby rows a window function looks at - like 'just the last 2 rows' instead of everything from the start.",
    visual: null,
    query: "SELECT id, amount,\n  AVG(amount) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) as moving_avg\nFROM orders;",
    keyTakeaway: "ROWS BETWEEN lets you compute moving averages and rolling sums, not just full running totals from the very start.",
    commonMistake: "Assuming every window function automatically considers the whole table - without an explicit frame, the default frame can behave differently than expected depending on whether ORDER BY is present.",
  },
  {
    title: "Materialized views & caching",
    body: "A regular view, covered earlier in this course, re-runs its underlying query every single time it's used - which is always accurate, but can be slow if that underlying query is itself expensive to compute. A materialized view instead stores the computed result physically, like a cached snapshot, so reading from it is fast - at the cost of that snapshot going stale until it's deliberately refreshed. Not every database supports true materialized views (SQLite, which powers this course's playground, does not), but the underlying tradeoff - accuracy and freshness versus speed - shows up constantly in real systems, often solved instead with a separate summary table that's updated on a schedule.",
    altExplain: "A materialized view is a saved snapshot of a query's result, kept for speed - unlike a regular view, it can go stale until refreshed.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What's the main tradeoff a materialized view makes compared to a regular view?",
      options: ["It uses less storage", "It trades always-fresh data for faster read speed", "It can only be used once", "There's no difference between them"],
      correct: 1,
      explanation: "A materialized view stores a computed snapshot for fast reads, but that snapshot can become outdated until it's refreshed - a regular view is always current, but potentially slower since it recalculates every time.",
    },
    keyTakeaway: "Materialized views (or summary tables) trade data freshness for read speed - useful when a query is expensive and perfect real-time accuracy isn't required.",
    commonMistake: "Using a materialized view for data that needs to be perfectly real-time, without accounting for how stale the cached snapshot might get between refreshes.",
  },
  {
    title: "Query optimization strategies",
    body: "Beyond adding indexes, several habits consistently make queries faster and more predictable. Selecting only the columns you actually need, instead of SELECT *, reduces the amount of data the database has to read and transfer. Filtering as early and specifically as possible in a WHERE clause lets the database eliminate rows before doing more expensive work like joins or sorting. Avoiding functions wrapped around indexed columns in a WHERE clause (like WHERE UPPER(department) = 'SALES') matters too, since that often prevents the database from using an index on that column at all, forcing a full scan instead. None of these tricks matter much on a tiny six-row table like the one in this course, but on tables with millions of rows, they're frequently the difference between a query that returns instantly and one that times out.",
    altExplain: "A few habits that consistently help: select only the columns you need, filter early and specifically, and avoid wrapping indexed columns in functions inside WHERE.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Why might WHERE UPPER(department) = 'SALES' be slower than WHERE department = 'Sales' on a large table with an index on department?",
      options: ["UPPER() is always slower to type", "Wrapping the column in a function often prevents the database from using the index on that column", "There's no actual difference in speed", "UPPER() only works on numbers"],
      correct: 1,
      explanation: "Many databases can't use a standard index when a function is applied to the indexed column in the WHERE clause, forcing a full table scan instead of an indexed lookup.",
    },
    keyTakeaway: "Select only needed columns, filter early, and avoid wrapping indexed columns in functions inside WHERE - small habits with a big impact at scale.",
    commonMistake: "Optimizing based on general 'best practices' without checking EXPLAIN QUERY PLAN to confirm they actually apply to a specific slow query.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the syntax introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of the syntax you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "LAG(col) OVER (ORDER BY col2) / LEAD(col) OVER (ORDER BY col2)", desc: "LAG sees the previous row's value; LEAD sees the next row's.", example: "LEAD(salary) OVER (ORDER BY hire_date)" },
      { syntax: "SUM(col) OVER (ORDER BY col2)", desc: "A running total - cumulative sum up through the current row.", example: "SUM(amount) OVER (ORDER BY id) as running_total" },
      { syntax: "OVER (ORDER BY col ROWS BETWEEN n PRECEDING AND CURRENT ROW)", desc: "A window frame - narrows a window function to a specific slice of rows, like a moving average.", example: "AVG(x) OVER (ORDER BY id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)" },
      { syntax: "CREATE MATERIALIZED VIEW / cached results", desc: "Stores a query's result physically, refreshed periodically, for fast repeated reads.", example: "Unlike a normal VIEW, this trades freshness for speed." },
      { syntax: "avoid FUNC(indexed_col) in WHERE", desc: "Wrapping an indexed column in a function often prevents the database from using its index.", example: "WHERE department = 'Sales'  -- not UPPER(department) = 'SALES'" },
    ],
  },
];

const SQL_MASTER_ADVANCED = [
  {
    title: "Transactions & isolation levels",
    body: "Transactions were introduced earlier in this course as an all-or-nothing bundle of statements, but there's a second dimension to them: isolation, which controls what one transaction is allowed to see of another transaction's in-progress, uncommitted changes. At one extreme, READ UNCOMMITTED allows seeing uncommitted changes from other transactions, which is fast but risks reading data that might later be rolled back. At the other extreme, SERIALIZABLE behaves as though every transaction ran one at a time with no overlap at all, which is the safest option but can hurt performance under heavy concurrent load. READ COMMITTED and REPEATABLE READ sit between these two extremes, each making a different tradeoff between consistency guarantees and how much concurrent transactions are allowed to interfere with each other.",
    altExplain: "Isolation levels control how much one transaction can 'see' of another transaction's unfinished work - stricter levels are safer but can be slower under heavy load.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Which isolation level generally offers the strongest consistency guarantee, at the cost of potential performance under concurrent load?",
      options: ["READ UNCOMMITTED", "SERIALIZABLE", "There's no difference between isolation levels", "Isolation levels only affect SELECT statements"],
      correct: 1,
      explanation: "SERIALIZABLE behaves as though transactions ran one after another with zero overlap, which is the safest option but can reduce throughput when many transactions are happening at once.",
    },
    keyTakeaway: "Isolation levels trade consistency guarantees against concurrency performance - stricter isolation is safer but can reduce how many transactions run smoothly at once.",
    commonMistake: "Assuming all databases default to the same isolation level - defaults genuinely differ between database systems, and it's worth checking rather than assuming.",
  },
  {
    title: "Concurrency & locking",
    body: "When multiple transactions try to read or modify the same data at the same time, the database needs a way to prevent them from corrupting each other's work - this is handled through locking. A lock temporarily reserves a row, or sometimes an entire table, preventing other transactions from modifying (or in stricter cases, even reading) that same data until the lock is released. A deadlock occurs when two transactions each hold a lock the other one needs, and neither can proceed - most databases detect this situation automatically and forcibly cancel one of the two transactions to break the standoff. Understanding locking matters most once an application has many simultaneous users, since a transaction that holds locks for too long can quietly slow down or block everyone else trying to use the same data.",
    altExplain: "Locking prevents two transactions from stepping on each other's changes at the same time. A deadlock happens when two transactions are each waiting on the other - the database has to break the tie.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What is a deadlock?",
      options: ["A database crash", "Two transactions each waiting on a lock the other one holds, with neither able to proceed", "A type of index", "A slow query"],
      correct: 1,
      explanation: "A deadlock is a standoff between two transactions, each holding a lock the other needs. Databases typically detect this automatically and cancel one transaction to let the other proceed.",
    },
    keyTakeaway: "Long-held locks from a slow transaction can quietly block every other user trying to touch the same data - keeping transactions short matters under real concurrent load.",
    commonMistake: "Holding a transaction open for a long time (e.g. waiting on user input mid-transaction) while it holds locks other users need.",
  },
  {
    title: "Replication",
    body: "Replication means keeping copies of the same database on multiple servers, typically with one 'primary' server accepting all writes, and one or more 'replica' servers that continuously receive a copy of every change and stay in sync. Read queries can then be spread across the replicas, reducing load on the primary and improving performance for read-heavy applications, while writes still all flow through the single primary to keep things consistent. Replication also provides a safety net: if the primary server fails, a replica can often be promoted to take over, minimizing downtime. The main challenge is replication lag - the small delay between a write happening on the primary and that same change appearing on a replica, which means a replica can briefly serve slightly outdated data.",
    altExplain: "Replication keeps copies of a database on multiple servers - one handles writes, others handle reads, sharing the load and providing a backup if the main one fails.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What is 'replication lag'?",
      options: ["A bug in the database software", "The small delay before a change on the primary server appears on a replica", "A type of deadlock", "The time it takes to create an index"],
      correct: 1,
      explanation: "Replication lag is the brief delay between a write completing on the primary server and that same change propagating to replica servers - during that window, a replica can serve slightly outdated data.",
    },
    keyTakeaway: "Replicas can serve reads and provide failover, but replication lag means they can briefly be slightly out of date compared to the primary.",
    commonMistake: "Reading immediately-just-written data from a replica and expecting it to already be there - replication lag can mean it hasn't arrived yet.",
  },
  {
    title: "Sharding & horizontal scaling",
    body: "Replication copies the entire database onto multiple servers, but sharding takes a different approach: splitting the data itself across multiple servers, with each shard holding only a portion of the total rows - for example, customers A through M on one server and N through Z on another. This lets a system scale beyond what a single server could handle, since both storage and query load get distributed across many machines rather than all landing on one. The tradeoff is complexity: queries that need to combine data from multiple shards (like a company-wide total across all customers) become significantly harder to write and slower to run than they would be against a single, unsharded database.",
    altExplain: "Sharding splits your data across multiple servers, each holding a portion of the total - unlike replication, which copies everything onto each server.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What's the key difference between replication and sharding?",
      options: ["They're the same technique with different names", "Replication copies the whole database to multiple servers; sharding splits the data itself across servers", "Sharding is only used for backups", "Replication only works with small databases"],
      correct: 1,
      explanation: "Replication keeps full copies of the same data on multiple servers for redundancy and read scaling. Sharding divides the data itself, with each server holding only part of the total, to scale storage and write capacity.",
    },
    keyTakeaway: "Sharding scales storage and write capacity by splitting data across servers, but makes cross-shard queries significantly more complex.",
    commonMistake: "Sharding a database before it's actually needed - sharding adds real complexity, and most applications never reach a scale where a single well-indexed database can't handle the load.",
  },
  {
    title: "Bringing it together: designing a schema",
    body: "Every concept in this course - tables, keys, JOINs, constraints, normalization, indexes - comes together when designing a schema from scratch for a real scenario. A solid process starts with identifying the core 'things' involved (like employees, orders, departments), giving each one its own table with a clear primary key, then identifying the relationships between them and expressing those with foreign keys. From there, constraints enforce the business rules that must always hold true, indexes get added deliberately on columns that will be frequently searched or joined on, and normalization keeps redundant data from creeping in - while accepting that a small amount of deliberate denormalization is sometimes a reasonable trade for performance. This is the capstone skill this entire course has been building toward: not just querying an existing schema, but designing one well in the first place.",
    altExplain: "Good schema design combines everything from this course: clear tables with primary keys, foreign keys for relationships, constraints for business rules, and indexes where they're actually needed.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "When designing a new schema, which order of decisions makes the most sense?",
      options: ["Add every possible index first, then design tables", "Identify core tables and primary keys, then relationships (foreign keys), then constraints and indexes", "Normalize to the highest possible form regardless of query patterns", "Skip primary keys until the schema is finished"],
      correct: 1,
      explanation: "A sound design process starts with the core entities and their primary keys, defines relationships next, then layers on constraints and indexes based on how the data will actually be queried and protected.",
    },
    keyTakeaway: "Schema design is a sequence of deliberate tradeoffs - between normalization and query simplicity, between indexing and write speed - not a single 'correct' answer.",
    commonMistake: "Designing a schema purely around today's queries without leaving room for the relationships and constraints that keep data correct as the application grows.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the syntax and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Isolation levels: Read Uncommitted \u2192 Read Committed \u2192 Repeatable Read \u2192 Serializable", desc: "Each stricter level prevents more concurrency anomalies, at the cost of more locking/blocking.", example: "Stricter isolation = fewer anomalies, less concurrency." },
      { syntax: "Row lock vs table lock", desc: "A row lock blocks only conflicting rows; a table lock blocks the whole table - row locks allow more concurrency.", example: "Two transactions updating different rows rarely block each other." },
      { syntax: "Replication: primary \u2192 replica(s)", desc: "Copies data to additional servers - for read scaling and failover, with some replication lag.", example: "Reads can be served from replicas; writes go to the primary." },
      { syntax: "Sharding: split data across multiple databases by a key", desc: "Horizontal scaling - each shard holds a subset of rows, chosen by a shard key.", example: "Shard by customer_id range or hash." },
      { syntax: "Design order: entities/keys \u2192 relationships \u2192 constraints/indexes", desc: "A sound schema design process, roughly in this sequence.", example: "Identify core tables and primary keys first." },
    ],
  },
];

const SQL_PRO_QUIZ_BANK = {
  basic: [
    { q: "How do you correctly check for NULL values?", options: ["WHERE column = NULL", "WHERE column IS NULL", "WHERE column == NULL", "WHERE column IS EMPTY"], correct: 1 },
    { q: "In a CASE expression, what happens to rows that don't match any WHEN?", options: ["They cause an error", "They become NULL unless there's an ELSE", "They're automatically excluded", "They default to zero"], correct: 1 },
    { q: "What does UPPER(department) do?", options: ["Deletes the department column", "Returns the department value in uppercase, without changing stored data", "Sorts departments alphabetically", "Filters out lowercase values"], correct: 1 },
    { q: "SELECT DISTINCT department removes...", options: ["All departments", "Duplicate department values, keeping each unique one once", "Empty departments only", "Departments with low headcount"], correct: 1 },
    { q: "UNION ALL differs from UNION by...", options: ["Requiring fewer columns", "Keeping duplicate rows instead of removing them", "Only working on numbers", "Running slower"], correct: 1 },
  ],
  intermediate: [
    { q: "A query joining 3 tables needs...", options: ["One ON clause total", "One ON clause per JOIN", "No ON clauses", "A UNION instead"], correct: 1 },
    { q: "A self-join requires...", options: ["Two separate tables", "Aliasing the same table twice to treat it as two references", "A subquery", "A VIEW"], correct: 1 },
    { q: "EXISTS returns...", options: ["The matched rows themselves", "Simply true or false, based on whether any row matches", "The count of matches", "An error if no match is found"], correct: 1 },
    { q: "A correlated subquery is one that...", options: ["Runs once for the whole query", "References a column from the outer query, re-running per outer row", "Cannot use WHERE", "Only works with JOIN"], correct: 1 },
    { q: "Which statement actually changes stored data?", options: ["SELECT", "UPDATE", "EXPLAIN", "DISTINCT"], correct: 1 },
  ],
  advanced: [
    { q: "A recursive CTE requires...", options: ["Only a single SELECT", "An anchor query and a recursive query joined with UNION ALL", "A trigger", "A foreign key"], correct: 1 },
    { q: "A trigger runs...", options: ["Only when manually called", "Automatically in response to an INSERT, UPDATE, or DELETE", "Once per day automatically", "Only during EXPLAIN"], correct: 1 },
    { q: "EXPLAIN QUERY PLAN shows...", options: ["The query's results", "How the database intends to execute the query", "A backup of the table", "The table's constraints only"], correct: 1 },
    { q: "A CHECK constraint is used to...", options: ["Speed up queries", "Enforce a custom condition on a column's values", "Create an index", "Join two tables"], correct: 1 },
    { q: "First Normal Form (1NF) requires...", options: ["Every table to have a foreign key", "Every column to hold a single, indivisible value", "No indexes", "At least two tables"], correct: 1 },
  ],
};

const SQL_MASTER_QUIZ_BANK = {
  basic: [
    { q: "What is SQL's real execution order (not writing order)?", options: ["SELECT, FROM, WHERE", "FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY", "ORDER BY first, then everything else", "There is no fixed order"], correct: 1 },
    { q: "INTERSECT returns...", options: ["Everything from both queries", "Only rows appearing in both queries", "Rows in the first query but not the second", "An error"], correct: 1 },
    { q: "strftime is used to...", options: ["Sort text", "Extract or reformat parts of a date", "Join two tables", "Create an index"], correct: 1 },
    { q: "SUM(CASE WHEN ... THEN value ELSE 0 END) is a pattern for...", options: ["Deleting rows", "Calculating a conditional total", "Creating a view", "Sorting results"], correct: 1 },
    { q: "'Pivoting' data generally means...", options: ["Deleting duplicate rows", "Turning rows into columns, often via conditional aggregation", "Adding an index", "Creating a foreign key"], correct: 1 },
  ],
  intermediate: [
    { q: "LAG() OVER (...) retrieves...", options: ["The next row's value", "The previous row's value in a specified order", "The maximum value overall", "A random row"], correct: 1 },
    { q: "A running total is typically written as...", options: ["COUNT(*) GROUP BY id", "SUM(column) OVER (ORDER BY ...)", "AVG(column) WHERE id > 0", "SELECT DISTINCT column"], correct: 1 },
    { q: "ROWS BETWEEN in a window function controls...", options: ["Which columns are selected", "Exactly which nearby rows are included in the calculation", "The table being queried", "The WHERE condition"], correct: 1 },
    { q: "A materialized view differs from a regular view by...", options: ["Being slower always", "Storing a cached snapshot instead of recalculating every time", "Never being able to update", "Only working with one table"], correct: 1 },
    { q: "Wrapping an indexed column in a function inside WHERE typically...", options: ["Speeds up the query", "Can prevent the database from using the index on that column", "Has no effect at all", "Only works on text columns"], correct: 1 },
  ],
  advanced: [
    { q: "SERIALIZABLE isolation generally offers...", options: ["The weakest consistency guarantee", "The strongest consistency guarantee, at a potential performance cost", "No isolation at all", "Only read access"], correct: 1 },
    { q: "A deadlock occurs when...", options: ["A query has a syntax error", "Two transactions each hold a lock the other needs", "An index is missing", "A table has no primary key"], correct: 1 },
    { q: "Replication lag refers to...", options: ["A database crash", "The delay before a primary's change appears on a replica", "A slow query", "A missing foreign key"], correct: 1 },
    { q: "Sharding differs from replication because it...", options: ["Copies the full database to every server", "Splits the data itself across multiple servers", "Only works with one table", "Is exactly the same thing"], correct: 1 },
    { q: "Good schema design generally starts with...", options: ["Adding as many indexes as possible", "Identifying core tables, primary keys, then relationships and constraints", "Choosing a database brand", "Writing the slowest query first"], correct: 1 },
  ],
};


// =========================================================================
// Data Analytics - Professional Level
// =========================================================================
const DA_PRO_BASIC = [
  {
    title: "Data types & measurement scales",
    body: "Not all numbers or categories carry the same kind of information, and knowing which scale you're working with determines what calculations actually make sense. Nominal data is just labels with no inherent order, like department names - you can count them, but averaging them is meaningless. Ordinal data has a meaningful order but not consistent gaps between values, like a satisfaction rating of low/medium/high. Interval data has consistent gaps but no true zero, like temperature in Celsius. Ratio data, like salary or order amount, has both consistent gaps and a true zero, which is why it's the only scale where things like 'twice as much' are genuinely meaningful. Misapplying a calculation meant for one scale to another - like averaging a satisfaction rating as if it were a ratio number - is a subtle but common analytics mistake.",
    altExplain: "Different kinds of data support different math. You can average a salary, but averaging a 'low/medium/high' rating doesn't really mean anything the same way.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Customer satisfaction is rated Low, Medium, or High. Why is averaging these directly (after assigning 1, 2, 3) potentially misleading?",
      options: ["It isn't misleading at all", "The gap between Low-Medium may not equal the gap between Medium-High in reality", "You can never analyze satisfaction data", "Only nominal data can be counted"],
      correct: 1,
      explanation: "Ordinal scales have a meaningful order but not necessarily equal spacing between levels. Treating them as evenly-spaced numbers for averaging purposes can distort what the 'average' actually represents.",
    },
    keyTakeaway: "Nominal = labels only. Ordinal = ordered, uneven gaps. Interval = even gaps, no true zero. Ratio = even gaps with a true zero, like salary or amount.",
    commonMistake: "Averaging ordinal survey data (like 1-5 star ratings) as though the gap between each star is mathematically identical.",
  },
  {
    title: "Standard deviation & variance",
    body: "Mean and median describe where the 'center' of your data sits, but they say nothing about how spread out the values are around that center. Variance measures this spread by averaging the squared distance of each value from the mean, and standard deviation is simply the square root of variance, which brings the measure back into the same units as the original data, making it much easier to interpret. A low standard deviation means most values cluster tightly around the mean; a high one means values are spread widely, which changes how much you should trust that mean as a representative 'typical' value. Edit the salary table in this lesson and watch standard deviation rise as you make the numbers more spread out, even while the mean itself might barely move.",
    altExplain: "Standard deviation measures how spread out your numbers are. Low = tightly clustered around the average. High = widely scattered.",
    visual: null,
    widget: "stats-calc",
    refBox: {
      syntax: "Std dev = \u221a(average of squared distances from the mean)",
      desc: "Variance is that same average before the square root - std dev brings it back into the original data's units.",
      example: "Salaries [40k,42k,45k] \u2192 low spread. [20k,42k,90k] \u2192 high spread.",
    },
    keyTakeaway: "Two datasets can have the identical mean but very different standard deviations - always check spread, not just the center.",
    commonMistake: "Reporting a mean without any measure of spread, leaving out whether that mean represents a tight cluster or a widely scattered set of values.",
  },
  {
    title: "Percentiles & quartiles",
    body: "A percentile tells you what proportion of your data falls below a given value - the 75th percentile is the value below which 75% of observations sit. Quartiles are a specific set of percentiles that divide data into four equal parts: Q1 (25th percentile), Q2 (the median, 50th percentile), and Q3 (75th percentile). The interquartile range, or IQR, is the distance between Q1 and Q3, and it describes the spread of the 'middle half' of your data while deliberately ignoring extreme values at either end - which makes it a more outlier-resistant measure of spread than standard deviation. These are the exact building blocks behind a 'box plot,' one of the most common ways analysts visualize distribution and spread at a glance.",
    altExplain: "Percentiles tell you what share of the data falls below a value. Quartiles split data into four equal chunks - the middle 50% (IQR) is a good outlier-resistant measure of spread.",
    visual: null,
    widget: "percentile-calc",
    refBox: {
      syntax: "IQR = Q3 (75th percentile) - Q1 (25th percentile)",
      desc: "The 'middle 50%' spread - resistant to outliers, unlike standard deviation which extreme values can distort heavily.",
      example: "Q1=40k, Q3=65k \u2192 IQR = $25k",
    },
    keyTakeaway: "IQR (the middle 50% of data, Q3 minus Q1) is a more outlier-resistant spread measure than standard deviation, since it ignores extreme values entirely.",
    commonMistake: "Confusing 'percentile' with 'percentage' - being in the 90th percentile doesn't mean scoring 90%, it means outperforming 90% of the comparison group.",
  },
  {
    title: "Distributions & skewness",
    body: "A distribution describes the overall shape of how values in a dataset are spread out - which values are common, which are rare, and whether the shape is symmetric or lopsided. Skewness measures that lopsidedness: a right-skewed (positively skewed) distribution has a long tail of high values pulling the mean above the median, which is exactly the salary-outlier pattern covered several lessons ago. A left-skewed distribution has the opposite pattern, with a long tail of low values pulling the mean below the median. Recognizing skewness matters because many statistical techniques quietly assume a roughly symmetric distribution, and applying them blindly to heavily skewed data can produce misleading or invalid results.",
    altExplain: "Skewness describes whether your data has a lopsided 'tail' - a few very high values (right-skewed) or a few very low ones (left-skewed) that pull the mean away from the median.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "In a dataset where mean is noticeably higher than median, what shape is the distribution likely to have?",
      options: ["Perfectly symmetric", "Right-skewed, with a long tail of high values", "Left-skewed, with a long tail of low values", "It's impossible to tell anything from this"],
      correct: 1,
      explanation: "When a small number of unusually high values pull the mean upward while the median stays put, that's the signature of a right-skewed (positively skewed) distribution - the same pattern seen with skewed salary data.",
    },
    keyTakeaway: "Mean above median suggests right skew (a high-value tail); mean below median suggests left skew (a low-value tail).",
    commonMistake: "Applying techniques that assume symmetric data (like some quick average-based comparisons) to a heavily skewed dataset without adjusting for it.",
  },
  {
    title: "Sampling methods",
    body: "It's rarely practical to measure an entire population, so analysts work with a sample - a subset chosen to represent the whole. Random sampling gives every member of the population an equal chance of being selected, which is the gold standard for avoiding bias, but is not always practical to execute perfectly. Stratified sampling deliberately divides the population into subgroups (like departments) first, then samples proportionally from each, guaranteeing that smaller subgroups aren't accidentally left out entirely. Convenience sampling simply uses whoever or whatever is easiest to reach, which is fast and cheap but carries a real risk of systematic bias, since 'easy to reach' is rarely the same as 'representative.'",
    altExplain: "Random sampling gives everyone an equal chance of being picked. Stratified sampling makes sure every subgroup is represented. Convenience sampling just grabs whoever's easiest to reach - and risks bias because of it.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A company surveys only the customers who happen to reply fastest to an email. What sampling method is this, and what's the main risk?",
      options: ["Random sampling; no real risk", "Convenience sampling; fast repliers may not represent the full customer base", "Stratified sampling; perfectly representative", "This isn't sampling at all"],
      correct: 1,
      explanation: "Surveying whoever responds fastest is convenience sampling. Fast repliers might be more engaged, younger, or otherwise different from the full customer base, introducing bias into the results.",
    },
    keyTakeaway: "The easiest sample to collect (convenience sampling) is also the most likely to be biased - representativeness usually requires more deliberate effort.",
    commonMistake: "Treating a convenience sample (like survey responses from whoever happened to reply) as if it represents the entire population equally well.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Nominal / Ordinal / Interval / Ratio", desc: "The four measurement scales - each determines which statistics are even meaningful to calculate.", example: "You can average a Ratio scale (income) but not a Nominal one (region name)." },
      { syntax: "Std dev = \u221a(average of squared distances from the mean)", desc: "Measures spread in the original data's units - variance is the same before the square root.", example: "Low spread: [40k,42k,45k]. High spread: [20k,42k,90k]." },
      { syntax: "IQR = Q3 (75th percentile) - Q1 (25th percentile)", desc: "The 'middle 50%' spread - resistant to outliers, unlike standard deviation.", example: "Q1=40k, Q3=65k \u2192 IQR = $25k" },
      { syntax: "Symmetric / Right-skewed / Left-skewed distribution", desc: "Skew determines whether mean or median better represents the 'typical' value.", example: "Income is usually right-skewed - median beats mean there." },
      { syntax: "Random / Stratified / Convenience sampling", desc: "Convenience sampling is easiest to collect but also the most likely to be biased.", example: "Surveying only fast email repliers = convenience sampling." },
    ],
  },
];

const DA_PRO_INTERMEDIATE = [
  {
    title: "Regression basics",
    body: "Correlation tells you whether two variables move together and how strongly, but regression goes a step further by fitting an actual equation - a 'line of best fit' - that lets you predict one variable from the other. Simple linear regression finds the line salary = slope x tenure + intercept that best fits the observed data, minimizing the total distance between the line and every actual data point. Once that line is calculated, you can plug in a new tenure value and get a predicted salary, even for a tenure that doesn't appear anywhere in the original dataset. It's worth remembering that a regression line describes the pattern in the data you have - it doesn't guarantee the same relationship holds for values far outside the range you actually observed.",
    altExplain: "Regression fits a straight line through your data that lets you predict one number from another - like predicting salary based on years of tenure.",
    visual: null,
    widget: "regression-calc",
    refBox: {
      syntax: "y = slope \u00d7 x + intercept (line of best fit)",
      desc: "Minimizes the total distance between the line and every actual data point - reliable only within the range of data it was built from.",
      example: "salary = 3000 \u00d7 tenure + 42000",
    },
    keyTakeaway: "A regression line is only as trustworthy as the range of data it was built from - predicting far outside that range is a genuine extrapolation risk.",
    commonMistake: "Using a regression line to predict values far outside the range of the original data and treating that prediction with the same confidence as an interpolated one.",
  },
  {
    title: "Confidence intervals",
    body: "A single calculated number - like an average - is really just a best estimate based on the sample you happened to collect; a different sample would likely produce a slightly different number. A confidence interval expresses this honestly by providing a range instead of a single point, along with a stated confidence level, like 'we're 95% confident the true average falls between X and Y.' Wider intervals reflect more uncertainty, usually from a smaller sample size or more variable data, while narrower intervals reflect more precision. Reporting a confidence interval alongside a point estimate is a meaningfully more honest way to communicate a result than reporting a single number as though it were exact and certain.",
    altExplain: "A confidence interval gives a range instead of one exact number, admitting some uncertainty - like saying 'probably between X and Y' instead of pretending to know the exact answer.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What does a wider confidence interval generally indicate?",
      options: ["More precise data", "More uncertainty, often from a smaller sample or more variable data", "A calculation error", "A stronger conclusion"],
      correct: 1,
      explanation: "A wider confidence interval reflects more uncertainty in the estimate - typically the result of a smaller sample size or data with more natural variability.",
    },
    keyTakeaway: "A confidence interval is a more honest way to report a result than a single number, since it communicates how much uncertainty is actually involved.",
    commonMistake: "Reporting only a point estimate (like 'average satisfaction is 7.2') without any sense of how much that number might vary with a different sample.",
  },
  {
    title: "Hypothesis testing basics",
    body: "Hypothesis testing gives analysts a formal framework for deciding whether an observed effect is likely real or just random noise. It starts by stating a null hypothesis - typically 'there is no real effect or difference' - and an alternative hypothesis representing what you actually suspect is true. The analysis then calculates how likely the observed data would be if the null hypothesis were actually true; if that likelihood is low enough (below a threshold decided in advance, commonly 5%), the null hypothesis is rejected in favor of the alternative. This is the same underlying logic behind the A/B testing lessons covered earlier - it's just formalized here with explicit statistical language and a stated decision threshold.",
    altExplain: "Hypothesis testing starts by assuming 'nothing's really going on' (the null hypothesis), then checks if the data is surprising enough under that assumption to conclude something real is happening instead.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What does the 'null hypothesis' typically represent?",
      options: ["The effect you're hoping to find", "The default assumption that there's no real effect or difference", "A mistake in the data", "The final conclusion of the test"],
      correct: 1,
      explanation: "The null hypothesis is the conservative default assumption - that nothing unusual is happening. A hypothesis test looks for enough evidence to reject that default in favor of a real effect.",
    },
    keyTakeaway: "Hypothesis testing is the formal version of the same logic behind A/B testing: assume nothing's happening by default, then look for strong enough evidence to conclude otherwise.",
    commonMistake: "Treating 'failing to reject the null hypothesis' as proof that there's definitely no effect, rather than simply insufficient evidence to conclude there is one.",
  },
  {
    title: "Seasonality in time series",
    body: "Many metrics don't just trend up or down over time - they also repeat a predictable pattern tied to a calendar cycle, like retail sales spiking every December or restaurant traffic dipping every Monday. This repeating pattern is called seasonality, and failing to account for it can make a completely normal fluctuation look like a meaningful trend, or mask a real trend underneath the noise of the seasonal cycle. Recognizing seasonality usually means comparing a period to the same period a year (or week, or day) earlier, rather than to the immediately preceding period, since December will always look dramatically different from November regardless of whether the underlying business is actually growing.",
    altExplain: "Seasonality is a repeating pattern tied to a calendar cycle, like holiday sales spikes. Compare to the same period last year, not just last month, or you'll mistake a normal cycle for a real trend.",
    visual: null,
    widget: "trend-builder",
    keyTakeaway: "When a metric has strong seasonality, compare to the same period a year ago, not the immediately prior period, to avoid mistaking a normal cycle for a real change.",
    commonMistake: "Comparing December sales to November sales and concluding 'huge growth,' when the jump is actually just the normal seasonal holiday pattern repeating.",
  },
  {
    title: "Dashboard design principles",
    body: "A dashboard exists to answer questions at a glance, which means every design choice should be judged by how quickly it helps someone understand what's happening. The most important metrics belong at the top, in the largest, most prominent position, since that's where eyes naturally go first. Related metrics should be grouped together visually, and color should be used deliberately and sparingly - reserved for drawing attention to something that actually needs it, like a metric that's off target, rather than decorating every element equally. A dashboard crammed with fifteen equally-sized charts forces the viewer to do the work of figuring out what matters; a well-designed one has already done that work for them.",
    altExplain: "Good dashboards put the most important number where the eye lands first, group related things together, and use color sparingly - only to flag what actually needs attention.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A dashboard shows 15 charts, all the same size, all in the same shade of blue. What's the main problem?",
      options: ["There are too many colors", "Nothing is visually prioritized, so the viewer has to do the work of figuring out what matters", "15 charts is always too many", "Blue is a bad color choice"],
      correct: 1,
      explanation: "Without visual hierarchy - size, position, or color signaling importance - a viewer has no guidance on what to look at first. Good dashboard design does that prioritization work for the viewer in advance.",
    },
    keyTakeaway: "Use size, position, and color deliberately to create visual hierarchy - a dashboard should show the viewer what matters most, not make them hunt for it.",
    commonMistake: "Giving every metric equal visual weight, which forces the viewer to figure out on their own what's actually important.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "y = slope \u00d7 x + intercept (line of best fit)", desc: "Regression fits a line that predicts one variable from another, minimizing total distance to actual points.", example: "salary = 3000 \u00d7 tenure + 42000" },
      { syntax: "95% confidence interval", desc: "A range likely to contain the true population value - not a guarantee, a stated confidence level.", example: "Mean satisfaction: 7.2, 95% CI: [6.8, 7.6]" },
      { syntax: "p-value < 0.05 (common threshold)", desc: "Tests whether an observed effect is likely real or could plausibly be random chance.", example: "p = 0.03 \u2192 statistically significant at the 0.05 threshold." },
      { syntax: "Trend + seasonal pattern (recurring cycle)", desc: "Separates a long-term direction from a predictable repeating cycle, like holiday spikes.", example: "Sales rise every December regardless of the yearly trend." },
      { syntax: "Visual hierarchy: size, position, color = importance", desc: "A dashboard should show the viewer what matters most, not make them hunt for it.", example: "The single most important number should be the largest/first." },
    ],
  },
];

const DA_PRO_ADVANCED = [
  {
    title: "Multiple regression",
    body: "Simple linear regression predicts an outcome from a single input variable, but real outcomes are usually influenced by several factors at once. Multiple regression extends the same core idea to handle several predictor variables simultaneously - salary might depend on tenure, department, and performance rating all at once, rather than tenure alone. Each predictor gets its own coefficient, describing how much that specific variable contributes to the outcome while holding the other variables constant. This 'holding other variables constant' framing is genuinely important: it's what separates a naive single-variable correlation from a more rigorous multi-variable analysis, since it isolates each factor's individual contribution rather than conflating them together.",
    altExplain: "Multiple regression predicts an outcome from several factors at once, instead of just one - and can show how much each factor matters on its own, holding the others steady.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What does multiple regression let you do that simple linear regression can't?",
      options: ["Use text data instead of numbers", "Account for several predictor variables simultaneously, isolating each one's individual effect", "Skip needing any data at all", "Guarantee a causal relationship"],
      correct: 1,
      explanation: "Multiple regression incorporates several predictors at once and estimates each one's individual contribution to the outcome while holding the others constant, which a single-variable model can't do.",
    },
    keyTakeaway: "Multiple regression isolates each predictor's individual contribution while holding others constant - far more realistic than a single-variable model for most real questions.",
    commonMistake: "Adding many predictor variables to a regression without checking whether they're themselves correlated with each other, which can make individual coefficients unreliable.",
  },
  {
    title: "Clustering & segmentation",
    body: "Earlier in this course, segmentation meant grouping data by a category you already knew about, like department. Clustering flips this around: it's an unsupervised technique that discovers natural groupings in the data on its own, based purely on how similar data points are to each other across multiple variables, without being told the groups in advance. A common approach, k-means clustering, tries to partition data into a chosen number of groups such that points within each group are as similar as possible to each other, and as different as possible from points in other groups. This is genuinely useful for discovering customer segments or behavior patterns that weren't obvious from any single existing category, though the resulting clusters still require human judgment to interpret and name meaningfully.",
    altExplain: "Clustering finds natural groupings in data automatically, without you telling it the categories in advance - unlike segmentation, where you already know the groups (like department).",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "How does clustering differ from the segmentation covered earlier in this course?",
      options: ["They're identical techniques", "Clustering discovers groups automatically from patterns in the data; segmentation uses categories you already know", "Clustering only works with text", "Segmentation is always more accurate"],
      correct: 1,
      explanation: "Segmentation groups data by a category you already know (like department). Clustering is unsupervised - it finds natural groupings based on similarity across variables, without being told the categories in advance.",
    },
    keyTakeaway: "Clustering discovers groups the data itself suggests, rather than groups you already defined - but the resulting clusters still need human interpretation to become meaningful.",
    commonMistake: "Treating clustering output as automatically meaningful without applying human judgment to interpret what each discovered group actually represents.",
  },
  {
    title: "Predictive modeling overview",
    body: "Predictive modeling uses historical data to build a model capable of estimating an outcome for new, unseen cases - extending the regression concept toward more general-purpose prediction. A core practice in this field is splitting data into a training set, used to build the model, and a separate test set, held back and used only to check how well the model performs on data it has never seen before. This split matters enormously: a model can appear to fit the training data almost perfectly while performing poorly on new data, a problem called overfitting, where the model has essentially memorized noise specific to the training set rather than learning a genuine, generalizable pattern.",
    altExplain: "Predictive modeling builds something that can estimate outcomes for new cases. Splitting data into training and test sets checks whether the model actually generalizes, or just memorized the training data.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Why do analysts hold back a separate 'test set' instead of training a model on all available data?",
      options: ["To make training faster", "To check whether the model generalizes to new data, rather than just memorizing the training data", "Test sets aren't actually necessary", "To make the model more complex"],
      correct: 1,
      explanation: "A model can fit its training data extremely well while failing on new data - a problem called overfitting. A held-out test set reveals whether the model has learned a real, generalizable pattern.",
    },
    keyTakeaway: "A model that performs great on training data but poorly on a test set is overfit - it memorized noise rather than learning a pattern that generalizes.",
    commonMistake: "Evaluating a model's quality only on the same data it was trained on, which can hide serious overfitting problems.",
  },
  {
    title: "Experiment design beyond A/B testing",
    body: "Basic A/B testing compares exactly two versions on one metric, but real experimentation often needs more nuance. A multivariate test changes several elements at once and measures how they interact, rather than testing one change in isolation. Guardrail metrics are equally important: even when a primary metric like conversion rate improves, it's worth watching other metrics (like page load time or complaint rate) to make sure the 'winning' change didn't quietly damage something else important. Well-designed experiments decide on their primary metric, sample size, and guardrail metrics before the test begins, precisely to avoid the temptation to selectively interpret results after the fact based on whatever looks favorable.",
    altExplain: "Beyond simple A/B tests, real experiments often track 'guardrail metrics' too - making sure a win on one number didn't quietly break something else important.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A checkout redesign increases conversion rate but also increases customer complaints. What role does 'complaint rate' play here?",
      options: ["It's irrelevant to the experiment", "It's a guardrail metric, revealing an unintended cost of the 'winning' change", "It proves the experiment was invalid", "It should be ignored since conversion improved"],
      correct: 1,
      explanation: "A guardrail metric monitors for unintended side effects of a change. Even a genuine improvement in the primary metric can come with hidden costs elsewhere that guardrail metrics are specifically designed to catch.",
    },
    keyTakeaway: "Decide on your primary metric, sample size, and guardrail metrics before an experiment starts - deciding afterward invites cherry-picking whatever looks good.",
    commonMistake: "Declaring an experiment a clear win based on one improved metric, without checking whether any other important metric quietly got worse.",
  },
  {
    title: "Building an analytics pipeline",
    body: "Everything covered across this course - cleaning data, calculating metrics, segmenting, testing, and presenting - fits together into a repeatable pipeline in real analytics work, rather than a one-off exercise performed once and forgotten. A typical pipeline starts with reliably collecting and cleaning raw data, moves through calculating and validating key metrics, then into deeper analysis like segmentation or testing, and finally into a dashboard or report designed for a specific decision-making audience. Building this as a repeatable, documented process - rather than a collection of one-off spreadsheets built from scratch each time - is what separates ad hoc analysis from a genuinely reliable analytics function that stakeholders can trust and depend on over time.",
    altExplain: "A real analytics pipeline connects everything from this course into one repeatable process: collect and clean data, calculate metrics, analyze deeper, then present - built once, run repeatedly, not redone from scratch every time.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What's the main advantage of a documented, repeatable analytics pipeline over one-off spreadsheet analysis?",
      options: ["It requires no data cleaning ever again", "It's reliable and reusable, rather than rebuilt from scratch (and possibly inconsistently) each time", "It eliminates the need for stakeholder presentations", "It only works for very small datasets"],
      correct: 1,
      explanation: "A documented pipeline ensures the same reliable process runs every time, rather than each analysis being rebuilt ad hoc - which risks inconsistency and wastes effort re-solving the same problems repeatedly.",
    },
    keyTakeaway: "The skills in this course become far more valuable connected into a repeatable pipeline than used as isolated, one-off techniques.",
    commonMistake: "Rebuilding the same analysis from scratch each reporting period instead of investing in a reusable, documented process.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "y = b\u2080 + b\u2081x\u2081 + b\u2082x\u2082 + ... (multiple regression)", desc: "Extends simple regression to predict from several variables at once.", example: "salary = base + (tenure \u00d7 b1) + (education \u00d7 b2)" },
      { syntax: "Cluster = group of similar data points (no predefined labels)", desc: "Finds natural groupings in data without being told what the groups should be in advance.", example: "Customer segments discovered from purchase behavior, not predefined." },
      { syntax: "Train data \u2192 build model \u2192 test on new data", desc: "The core predictive modeling workflow - a model must generalize to data it hasn't seen.", example: "A model trained on 2024 data, tested against 2025 data." },
      { syntax: "Multivariate / sequential testing designs", desc: "Test more than one change at once, or adapt the test as results come in - beyond simple A/B.", example: "Testing three button colors simultaneously, not just two." },
      { syntax: "Ingest \u2192 Clean \u2192 Transform \u2192 Analyze \u2192 Report (pipeline)", desc: "A documented, repeatable process beats rebuilding analysis from scratch each time.", example: "The same reliable steps run automatically every reporting period." },
    ],
  },
];

const DA_PRO_QUIZ_BANK = {
  basic: [
    { q: "Which measurement scale has both consistent gaps and a true zero?", options: ["Nominal", "Ordinal", "Ratio", "None of them"], correct: 2 },
    { q: "Standard deviation measures...", options: ["The center of the data", "How spread out the data is around the mean", "The number of rows", "The correlation between variables"], correct: 1 },
    { q: "The IQR (interquartile range) covers...", options: ["All the data", "The middle 50% of the data, between Q1 and Q3", "Only the top 10%", "Just the median value"], correct: 1 },
    { q: "A right-skewed distribution typically has...", options: ["Mean below median", "Mean above median, due to a high-value tail", "Mean exactly equal to median", "No median at all"], correct: 1 },
    { q: "Convenience sampling risks...", options: ["Being too expensive", "Bias, since 'easy to reach' isn't the same as 'representative'", "Being too slow", "Requiring too much data"], correct: 1 },
  ],
  intermediate: [
    { q: "Regression differs from correlation because it...", options: ["Only works with categories", "Fits an equation that can predict one variable from another", "Cannot show a relationship's strength", "Never uses numbers"], correct: 1 },
    { q: "A wider confidence interval indicates...", options: ["More certainty", "More uncertainty in the estimate", "A calculation mistake", "A larger dataset always"], correct: 1 },
    { q: "The null hypothesis typically assumes...", options: ["The effect you're hoping to find is real", "There is no real effect or difference by default", "The data is definitely wrong", "The test has already concluded"], correct: 1 },
    { q: "To account for seasonality, you should generally compare...", options: ["A period to the one right before it, always", "A period to the same period a year (or cycle) earlier", "Only the most recent single data point", "Nothing, seasonality can be ignored"], correct: 1 },
    { q: "Good dashboard design uses color to...", options: ["Decorate every element equally", "Draw attention deliberately to what actually needs it", "Make charts look busier", "Replace the need for labels"], correct: 1 },
  ],
  advanced: [
    { q: "Multiple regression differs from simple regression by...", options: ["Using only text data", "Handling several predictor variables at once", "Never producing predictions", "Requiring no data"], correct: 1 },
    { q: "Clustering is best described as...", options: ["The same thing as segmentation", "An unsupervised technique that discovers groups from the data itself", "Only usable on financial data", "A way to delete outliers"], correct: 1 },
    { q: "A model that fits training data perfectly but performs poorly on new data is...", options: ["Underfit", "Overfit", "Perfectly designed", "Impossible"], correct: 1 },
    { q: "A guardrail metric is used to...", options: ["Replace the primary metric", "Catch unintended side effects of a change, even when the primary metric improves", "Speed up an experiment", "Guarantee a test's result"], correct: 1 },
    { q: "A documented analytics pipeline's main advantage is...", options: ["No data cleaning is ever needed again", "Reliable, repeatable results instead of rebuilding analysis from scratch each time", "It removes the need to present findings", "It only works once"], correct: 1 },
  ],
};

// =========================================================================
// Data Analytics - Master Level
// =========================================================================
const DA_MASTER_BASIC = [
  {
    title: "Time series decomposition",
    body: "A time series - any metric measured repeatedly over time - can be thought of as the sum of three underlying components: trend (the long-term direction), seasonality (the repeating calendar-based pattern covered earlier), and noise (random, unexplained fluctuation left over after accounting for the other two). Decomposing a time series means separating these three components out so each can be examined on its own, rather than trying to interpret one tangled, combined signal all at once. This separation matters practically: a sudden dip that looks alarming in the raw combined data might turn out to be entirely explained by ordinary seasonality once decomposed, revealing that the underlying trend is actually still healthy.",
    altExplain: "Any metric over time is really trend + seasonality + noise, all combined together. Decomposing separates these out so you can look at each one on its own.",
    visual: null,
    widget: "trend-builder",
    keyTakeaway: "A worrying-looking dip in raw data can often be fully explained by ordinary seasonality once trend, seasonality, and noise are separated out.",
    commonMistake: "Reacting to a single unusual-looking data point in raw time series data without checking whether it's just an expected seasonal pattern or genuine random noise.",
  },
  {
    title: "Outlier detection methods",
    body: "Earlier lessons dealt with outliers conceptually, but real analysis needs a consistent, repeatable rule for flagging them rather than relying on eyeballing a chart. The IQR method, used in the widget below, flags any value more than 1.5 times the interquartile range beyond Q1 or Q3 as a potential outlier - a widely used convention with a solid statistical basis. An alternative is the z-score method, which flags any value more than roughly 2 or 3 standard deviations away from the mean. Neither method automatically means an outlier should be deleted - a flagged value might be a genuine data entry error, or it might be a real, important, unusual case that deserves closer investigation rather than removal.",
    altExplain: "Outlier detection uses a consistent rule (like IQR or standard deviation distance) instead of just eyeballing a chart - but a flagged value still needs human judgment before deciding what to do about it.",
    visual: null,
    widget: "outlier-detector",
    refBox: {
      syntax: "Outlier if: value < Q1 - 1.5\u00d7IQR  or  value > Q3 + 1.5\u00d7IQR",
      desc: "The IQR method's standard rule of thumb. The z-score method (2-3 std devs from the mean) is a common alternative.",
      example: "Q1=40k, Q3=65k, IQR=25k \u2192 flag anything below $2.5k or above $102.5k",
    },
    keyTakeaway: "Flagging an outlier is not the same as deciding to remove it - a flagged value might be an error, or it might be a real and important case worth investigating.",
    commonMistake: "Automatically deleting every statistically flagged outlier without first checking whether it represents a genuine data error or a real, meaningful case.",
  },
  {
    title: "Normalization & scaling for analysis",
    body: "When comparing or combining variables measured on very different scales - salary in thousands versus tenure in single-digit years, for instance - the variable with the larger raw numbers can end up dominating a calculation simply because of its scale, not because it's actually more important. Min-max scaling rescales every value into a consistent 0-to-1 range based on the minimum and maximum observed. Z-score standardization instead rescales values based on how many standard deviations they sit from the mean, centering everything around zero. Both techniques put variables on a comparable footing before combining them, which matters for many statistical and machine learning techniques that would otherwise be quietly skewed by whichever input variable happens to have the largest raw numbers.",
    altExplain: "When combining variables measured on very different scales, scaling puts them all on a level playing field first - otherwise the variable with bigger raw numbers can unfairly dominate.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Why might combining 'salary' (in thousands) and 'tenure' (in single years) directly cause a problem in some analyses?",
      options: ["It never causes a problem", "Salary's much larger raw numbers could dominate the calculation just due to scale, not real importance", "Tenure is always more important", "You can't ever combine two variables"],
      correct: 1,
      explanation: "Without scaling, a variable with naturally larger raw numbers (like salary) can dominate certain calculations purely due to magnitude, even if it's not genuinely more important than a smaller-scale variable like tenure.",
    },
    keyTakeaway: "Scaling (min-max or z-score) puts variables measured on different scales on equal footing before combining or comparing them.",
    commonMistake: "Combining variables with very different scales without normalizing first, letting the larger-scale variable dominate the result by accident.",
  },
  {
    title: "Cognitive biases in analysis",
    body: "Analysts are just as susceptible to reasoning shortcuts and biases as anyone else, and several specific ones show up constantly in data work. Confirmation bias is the tendency to notice and favor evidence supporting what you already believed, while downplaying or explaining away contradicting evidence. Survivorship bias comes from only analyzing the 'survivors' of some process while ignoring the ones that didn't make it - like studying only currently successful companies while ignoring the many similar ones that failed, which can produce a badly distorted picture of what actually predicts success. Being aware these biases exist doesn't make anyone immune to them, but it does make it more likely you'll pause and double-check a conclusion that happens to conveniently confirm what you expected to find.",
    altExplain: "Confirmation bias makes you notice evidence that supports what you already believe. Survivorship bias comes from only studying the 'winners' while ignoring everyone who didn't make it - both distort conclusions.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A study of 'highly successful startups' finds they all share a certain trait. Why might this conclusion be misleading?",
      options: ["Successful startups can't be studied", "It ignores failed startups that may have shared the same trait (survivorship bias)", "The trait must be fake", "There's no possible bias here"],
      correct: 1,
      explanation: "This is survivorship bias: without also examining failed startups that might share the same trait, there's no way to know if the trait actually predicts success or is simply common regardless of outcome.",
    },
    keyTakeaway: "Survivorship bias comes from only studying the 'winners' of a process - always ask what happened to the ones that didn't make it into your dataset.",
    commonMistake: "Drawing conclusions about what causes success by only studying successful cases, without any comparison group of similar cases that didn't succeed.",
  },
  {
    title: "Ethics in data analysis",
    body: "Working with data - especially data about people - carries real ethical weight that goes beyond simply getting the numbers right. Privacy means being deliberate about what personal data is collected, how long it's kept, and who can access it, rather than gathering everything possible by default. Fairness means checking whether an analysis or a model treats different groups equitably, since patterns learned from historical data can unintentionally encode and perpetuate historical biases and discrimination. Transparency means being honest about a method's real limitations, rather than overstating confidence in a conclusion to make a report look more decisive or impressive than the underlying evidence actually supports. These aren't abstract concerns reserved for large tech companies - they apply to any analysis that touches real people's data, at any scale.",
    altExplain: "Working with data about people carries real responsibility: protect privacy, check that conclusions treat different groups fairly, and be honest about a method's actual limitations.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A hiring model trained on historical data unintentionally favors one demographic group because that group was historically hired more often. What ethical concern does this raise?",
      options: ["None, the model is just following the data", "Fairness — the model may be encoding and perpetuating historical bias", "This is purely a technical bug with no ethical dimension", "Privacy is the only real concern here"],
      correct: 1,
      explanation: "Models trained on historically biased data can learn and perpetuate that bias. This is a fairness concern - it's important to actively check whether an analysis treats different groups equitably, not just whether it matches historical patterns.",
    },
    keyTakeaway: "Data reflecting historical patterns can encode historical unfairness - actively checking for this is part of responsible analysis, not an optional extra step.",
    commonMistake: "Assuming a data-driven conclusion is automatically neutral or objective, without checking whether the underlying data itself reflects historical bias.",
  },
  {
    title: "Cheatsheet: Basic track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Trend + Seasonality + Residual (decomposition)", desc: "Splits a time series into a long-term direction, a repeating cycle, and what's left over (noise).", example: "December spikes are seasonal; the year-over-year climb is trend." },
      { syntax: "Outlier if: value < Q1 - 1.5\u00d7IQR  or  value > Q3 + 1.5\u00d7IQR", desc: "The IQR method's standard rule of thumb for flagging outliers.", example: "Q1=40k, Q3=65k, IQR=25k \u2192 flag below $2.5k or above $102.5k" },
      { syntax: "Min-max scaling / Z-score normalization", desc: "Rescales variables onto comparable ranges before combining or comparing them.", example: "Puts 'age' and 'income' on the same 0-1 scale for fair comparison." },
      { syntax: "Confirmation bias, anchoring, survivorship bias", desc: "Common cognitive biases that can quietly distort an analyst's own conclusions.", example: "Only studying successful companies misses what failed ones had in common too." },
      { syntax: "Fairness + privacy + transparency (ethics checklist)", desc: "Historically biased data can encode and perpetuate that bias - actively check for it.", example: "A hiring model trained on biased historical hiring data." },
    ],
  },
];

const DA_MASTER_INTERMEDIATE = [
  {
    title: "Statistical power in A/B testing",
    body: "Statistical power is the probability that an experiment will actually detect a real effect, if one truly exists - low power means a test might easily miss a genuine difference simply because it wasn't run on a large enough sample. Power depends on three things working together: sample size, the size of the effect being looked for, and how much natural variability exists in the underlying data. This is precisely why real A/B tests calculate a required sample size in advance, before the test even begins, rather than just running it for a while and checking whenever it feels convenient - stopping too early risks concluding 'no difference found' when a real difference may have simply been too small to detect with the data collected so far.",
    altExplain: "Statistical power is the chance your test actually catches a real effect, if there is one. Too small a sample means low power - you might miss something real just because you didn't collect enough data.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "An A/B test finds 'no significant difference' after only 50 visitors per group. What's a likely explanation?",
      options: ["There's definitely no real difference", "The test may have had too little statistical power to detect a real, smaller effect", "50 visitors is always plenty", "Statistical power doesn't apply here"],
      correct: 1,
      explanation: "With a small sample, a test can lack the statistical power needed to reliably detect a real but modest effect - 'no significant difference found' isn't the same as 'proven no difference exists.'",
    },
    keyTakeaway: "'No significant difference found' with a small sample often means 'not enough power to detect it,' not 'proven there's no effect.'",
    commonMistake: "Concluding an A/B test found 'no effect' after too small a sample, when the real problem is insufficient statistical power to detect a genuine but modest difference.",
  },
  {
    title: "Multi-touch attribution",
    body: "A customer often interacts with several marketing touchpoints - a social media ad, an email, a search result - before eventually making a purchase, which raises a genuinely hard question: which touchpoint actually deserves credit for the sale? Last-touch attribution gives all the credit to the final interaction before purchase, which is simple but ignores everything that led up to it. First-touch attribution does the opposite, crediting whatever first introduced the customer. Multi-touch models split credit across several touchpoints using various weighting rules, attempting a more balanced, realistic picture of the customer journey - though no attribution model is perfectly objective, and the choice of model can meaningfully change which marketing channels appear most effective.",
    altExplain: "When a sale involves several marketing touches (an ad, an email, a search), attribution decides who gets credit. Last-touch, first-touch, and multi-touch models all split that credit differently.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Why might last-touch attribution undervalue a brand-awareness ad campaign?",
      options: ["Ad campaigns are never valuable", "Last-touch gives all credit to the final interaction, ignoring earlier touchpoints that built awareness", "Attribution models don't consider ads at all", "This is not a real concern in marketing"],
      correct: 1,
      explanation: "A brand-awareness ad might introduce a customer who converts weeks later through a different channel. Last-touch attribution would credit only that final channel, completely undervaluing the ad that started the journey.",
    },
    keyTakeaway: "The choice of attribution model can meaningfully change which marketing channels look effective - there's no single 'objectively correct' way to split credit.",
    commonMistake: "Relying entirely on last-touch attribution and concluding that top-of-funnel awareness channels 'don't work,' when they may simply not appear in a last-touch-only model.",
  },
  {
    title: "Cohort retention curves",
    body: "Building on the cohort analysis covered earlier, a retention curve tracks the percentage of a cohort still active - still ordering, still logging in - at each successive time period after they joined, rather than looking at just one single snapshot in time. A healthy retention curve typically drops sharply at first, then flattens out into a stable long-term percentage, and that flattening point matters enormously: it represents roughly how many customers from a cohort a business can expect to keep for the long haul. Comparing retention curves across different cohorts - customers acquired through different channels, or in different months - can reveal which acquisition sources bring in customers who actually stick around, versus ones who churn quickly regardless of the initial acquisition cost.",
    altExplain: "A retention curve tracks what percentage of a group is still active over time, not just at one snapshot. Where the curve flattens out shows roughly how many will stick around long-term.",
    visual: null,
    widget: "pivot-builder-cohort",
    keyTakeaway: "Where a retention curve flattens out - not the initial drop - is usually the most important number, since it estimates long-term retention.",
    commonMistake: "Judging retention from a single early snapshot (like 'week 1 retention') without watching whether the curve eventually stabilizes or keeps declining.",
  },
  {
    title: "Funnel analysis",
    body: "A funnel breaks a multi-step process - visiting a site, signing up, adding to cart, purchasing - into sequential stages, then measures what percentage of people make it from each stage to the next. This reveals exactly where potential customers are dropping off, which is far more actionable than a single overall conversion rate, since a low overall rate could be caused by a problem at any one of several very different steps. Try adjusting the numbers in this lesson's funnel: a large drop between two adjacent stages points directly at a specific part of the experience worth investigating, whether that's a confusing signup form or an unexpectedly complicated checkout flow.",
    altExplain: "A funnel shows conversion step by step, so you can see exactly where people drop off - much more useful than one overall conversion number that hides where the problem actually is.",
    visual: null,
    widget: "funnel-calc",
    keyTakeaway: "The biggest percentage drop between two adjacent funnel stages usually points directly at the specific step most worth fixing first.",
    commonMistake: "Focusing only on the overall conversion rate (visitors to purchases) without breaking it into stages to find exactly where the biggest drop-off actually happens.",
  },
  {
    title: "Customer Lifetime Value (CLV)",
    body: "Customer Lifetime Value estimates the total revenue a business can expect from a single customer over the entire span of their relationship, not just from one transaction. A simple version multiplies average order value, purchase frequency per year, and expected customer lifespan in years together, though more sophisticated versions also factor in profit margin and the fact that money received later is worth somewhat less than money received today. CLV matters enormously for decision-making because it directly informs how much a business can reasonably afford to spend acquiring a new customer - a customer worth 5,000 over their lifetime justifies a very different acquisition budget than one worth 500, even if both cost the same amount to acquire in the first place.",
    altExplain: "CLV estimates the total value a customer brings over their whole relationship with a business, not just one purchase - which tells you how much is reasonable to spend acquiring a new one.",
    visual: null,
    widget: "clv-calc",
    refBox: {
      syntax: "CLV = Avg Order Value \u00d7 Purchase Frequency \u00d7 Customer Lifespan",
      desc: "A simple version; more sophisticated ones factor in profit margin and discount future revenue to present value.",
      example: "$150 \u00d7 4/year \u00d7 3 years = $1,800 lifetime value",
    },
    keyTakeaway: "CLV directly informs acquisition budgets - a high-CLV customer segment justifies spending more to acquire than a low-CLV one, even at the same acquisition cost.",
    commonMistake: "Setting a marketing budget based only on the value of a single first purchase, ignoring the repeat revenue a loyal customer generates over their full lifetime.",
  },
  {
    title: "Cheatsheet: Intermediate track",
    body: "A quick reference for the formulas and concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Statistical power = 1 - false negative rate", desc: "The probability an A/B test correctly detects a real effect, if one truly exists.", example: "Low power \u2192 a real winner might get missed as 'no difference.'" },
      { syntax: "First-touch / Last-touch / Multi-touch attribution", desc: "Different rules for crediting which marketing touchpoint(s) drove a conversion.", example: "Multi-touch splits credit across every touchpoint in the journey." },
      { syntax: "Retention curve = % still active by period since signup", desc: "Tracks a cohort's decay over time since a shared starting point.", example: "80% active month 1, 45% active month 3." },
      { syntax: "Funnel: stage 1 \u2192 stage 2 \u2192 ... (conversion % per step)", desc: "Tracks drop-off at each sequential stage of a process.", example: "1000 visits \u2192 200 signups \u2192 50 purchases." },
      { syntax: "CLV = Avg Order Value \u00d7 Purchase Frequency \u00d7 Lifespan", desc: "Estimates total customer value - informs how much is reasonable to spend acquiring one.", example: "$150 \u00d7 4/year \u00d7 3 years = $1,800" },
    ],
  },
];

const DA_MASTER_ADVANCED = [
  {
    title: "Causal inference overview",
    body: "Randomized experiments like A/B tests are the gold standard for establishing that one thing actually causes another, but a genuine randomized experiment isn't always possible - you can't randomly assign people to different countries, income levels, or historical time periods. Causal inference is a set of techniques for estimating cause-and-effect relationships from observational data where true randomization wasn't possible. A natural experiment looks for situations where something close to random assignment happened to occur naturally, like a policy change that affected one region but not a neighboring one otherwise similar in every relevant way. These methods are more assumption-dependent and generally less airtight than a true randomized experiment, but they're often the only realistic option when running an actual controlled experiment simply isn't feasible.",
    altExplain: "When you can't run a true randomized experiment, causal inference looks for situations that approximate one anyway - like a policy change hitting one region but not a similar neighboring one - to still estimate cause and effect.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Why can't every causal question be answered with a true randomized A/B test?",
      options: ["A/B tests are always possible for anything", "Some factors (like country, historical era, or income level) can't ethically or practically be randomly assigned", "Causal inference is never necessary", "Randomized tests always give wrong answers"],
      correct: 1,
      explanation: "Many real-world questions involve factors that can't be randomly assigned to people or places - you can't randomly assign someone's home country. Causal inference techniques try to approximate the logic of an experiment using observational data instead.",
    },
    keyTakeaway: "Causal inference techniques are a reasonable substitute for randomized experiments only when true randomization genuinely isn't possible - they rest on more assumptions and are less airtight.",
    commonMistake: "Treating a causal inference result with the same confidence as a true randomized experiment, without acknowledging the extra assumptions it depends on.",
  },
  {
    title: "Executive dashboards at scale",
    body: "Building on the dashboard design and storytelling principles from earlier in this course, an executive-level dashboard faces an additional constraint: it needs to remain useful and comprehensible even as the underlying business grows more complex, with more products, regions, or teams than it started with. This usually means designing a layered structure - a single top-level view showing only the handful of company-wide metrics that matter most, with the ability to drill down into any one of them for underlying detail, rather than trying to cram every possible metric onto one crowded screen. The discipline required here is ruthless prioritization: deciding what genuinely belongs on that top-level view, and trusting the drill-down layers to hold everything else.",
    altExplain: "As a business grows more complex, executive dashboards need a layered structure - a small top-level view of what matters most, with the ability to drill into details, rather than cramming everything onto one screen.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "As a business grows more complex, what's the recommended approach to executive dashboard design?",
      options: ["Add every new metric to the main screen as it becomes available", "Build a layered structure: a small top-level view with drill-down detail available underneath", "Remove all dashboards and rely on written reports only", "Keep the dashboard exactly the same regardless of business changes"],
      correct: 1,
      explanation: "A layered approach keeps the top-level view focused on only the most important company-wide metrics, while still making detailed data available through drill-downs - avoiding an ever-more-crowded single screen.",
    },
    keyTakeaway: "As complexity grows, resist adding more metrics to the top-level view - build drill-down layers instead, and ruthlessly prioritize what earns a place on the main screen.",
    commonMistake: "Continuously adding new metrics to a company's main dashboard over time until it becomes too crowded to actually use at a glance.",
  },
  {
    title: "Data governance & quality frameworks",
    body: "As an organization's data grows across many teams and systems, informal, ad hoc data quality checks stop being sufficient, which is where data governance comes in - a formal set of policies defining who owns each dataset, what quality standards it must meet, and how issues get identified and resolved when they arise. A data governance framework typically assigns clear ownership for each key dataset, establishes documented definitions for important metrics so different teams aren't quietly calculating 'revenue' three different ways, and sets up monitoring to catch data quality problems automatically, before they quietly propagate into a report or a decision. This is essentially the data-cleaning instincts built earlier in this course, formalized and scaled up to work reliably across an entire organization rather than just one person's individual analysis.",
    altExplain: "Data governance is a formal system for who owns each dataset, how key metrics are defined consistently, and how quality problems get caught - the data-cleaning instincts from earlier in this course, scaled up across a whole organization.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "Two teams report different 'revenue' numbers because each calculates it slightly differently. What governance practice would prevent this?",
      options: ["Firing one of the teams", "Establishing a single documented definition for the metric that every team uses", "Ignoring the discrepancy since both numbers are 'close enough'", "Removing revenue reporting entirely"], correct: 1,
      explanation: "A core data governance practice is establishing a single, documented, agreed-upon definition for important metrics, so teams across an organization are calculating and reporting the same thing consistently.",
    },
    keyTakeaway: "Data governance formalizes and scales the same data-quality instincts covered early in this course, applied across an entire organization rather than one analysis at a time.",
    commonMistake: "Letting each team define important metrics independently, leading to inconsistent numbers for the same supposed metric across different reports.",
  },
  {
    title: "Analytics vs. machine learning",
    body: "Traditional analytics and machine learning share the same underlying data and many of the same statistical foundations, but they diverge in their goals. Analytics is primarily focused on understanding and explaining what has happened and why, favoring interpretable methods where a human can follow and trust the reasoning behind a conclusion. Machine learning is primarily focused on prediction accuracy, sometimes using far more complex models that are harder for a human to fully interpret, but that may predict future outcomes more precisely as a result. Many real-world problems benefit from both: analytics to understand the underlying business context, patterns, and constraints, and machine learning to build an accurate predictive system once that context is genuinely understood - each approach is a tool suited to a different kind of question, not a replacement for the other.",
    altExplain: "Analytics focuses on understanding and explaining what happened, in a way a human can follow. Machine learning focuses on predicting accurately, sometimes with less interpretable methods. Many real problems benefit from both.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "A business wants both to understand why customers churn AND to automatically flag at-risk customers going forward. What's the most sensible approach?",
      options: ["Use only machine learning for everything", "Use analytics to understand the underlying patterns, and machine learning to build the predictive flagging system", "These two goals are mutually exclusive", "Use only traditional analytics and ignore prediction"],
      correct: 1,
      explanation: "Analytics excels at explaining and understanding root causes in an interpretable way. Machine learning excels at building an accurate predictive system once the underlying patterns are understood. Combining both suits this business need well.",
    },
    keyTakeaway: "Analytics and machine learning answer different kinds of questions - explaining why versus predicting accurately - and often work best combined rather than treated as competing choices.",
    commonMistake: "Reaching for a complex machine learning model when a simpler, more interpretable analytics approach would answer the actual business question just as well, with far more transparency.",
  },
  {
    title: "Capstone: designing an analytics strategy",
    body: "Every concept across this entire course - metrics and KPIs, statistical rigor, experimentation, storytelling, ethics, and governance - comes together when designing a genuine analytics strategy for a real business. A sound strategy starts by identifying the handful of decisions the business actually needs to make, then works backward to determine which metrics would genuinely inform those specific decisions, rather than starting from 'what data do we happen to have' and trying to find some use for it afterward. From there, it establishes reliable data collection and governance, builds the dashboards and reports the relevant decision-makers actually need, and creates a culture where experimentation and honest, rigorous analysis - including the willingness to report an inconvenient result - are genuinely valued over simply telling stakeholders whatever they already wanted to hear.",
    altExplain: "A real analytics strategy starts from the decisions a business needs to make, works backward to the metrics that would inform them, then builds the data, dashboards, and culture to support that - rather than starting from whatever data happens to already exist.",
    visual: null,
    widget: "insight-check",
    insightCheck: {
      question: "What's the better starting point for building an analytics strategy?",
      options: ["Start with whatever data already exists and find some use for it", "Start with the actual decisions the business needs to make, then work backward to the metrics that inform them", "Start by buying the most expensive analytics software available", "Start by hiring as many analysts as possible"],
      correct: 1,
      explanation: "A sound analytics strategy works backward from real business decisions to the specific metrics that would inform them - rather than starting from existing data and searching for some use for it afterward.",
    },
    keyTakeaway: "The strongest analytics strategies start from real business decisions and work backward to the metrics and data needed to inform them, not the other way around.",
    commonMistake: "Building extensive dashboards and reports around whatever data is easiest to collect, without first confirming they actually inform a real decision anyone needs to make.",
  },
  {
    title: "Cheatsheet: Advanced track",
    body: "A quick reference for the concepts introduced in this track - bookmark this lesson and come back to it any time you need a quick reminder, rather than re-reading full lessons.",
    altExplain: "This lesson is just a summary table of what you've already learned in this track - nothing new to learn here.",
    visual: null,
    isCheatsheet: true,
    refTable: [
      { syntax: "Correlation \u2260 Causation; causal inference tries to bridge that gap", desc: "Techniques (natural experiments, instrumental variables) aim to isolate true cause and effect.", example: "Did the ad campaign cause the sales lift, or did something else?" },
      { syntax: "Executive dashboard: few metrics, high signal", desc: "Fewer, carefully chosen metrics beat comprehensive dashboards for senior decision-makers.", example: "3-5 KPIs an executive actually acts on, not 30 they skim past." },
      { syntax: "Data governance: ownership + quality standards + access rules", desc: "The framework that keeps data trustworthy and appropriately controlled at organizational scale.", example: "Clear ownership for who's accountable when a metric looks wrong." },
      { syntax: "Analytics (explains the past) vs ML (predicts/automates)", desc: "Related but distinct disciplines - analytics informs humans, ML often acts more directly.", example: "A dashboard reports churn rate; an ML model predicts which customers will churn." },
      { syntax: "Start from business decisions \u2192 work backward to metrics", desc: "The strongest analytics strategies work backward from real decisions, not from available data.", example: "What decision needs making? Then: what data would inform it?" },
    ],
  },
];

const DA_MASTER_QUIZ_BANK = {
  basic: [
    { q: "Time series decomposition separates a metric into...", options: ["Mean, median, and mode", "Trend, seasonality, and noise", "Rows and columns", "Categories and labels"], correct: 1 },
    { q: "The IQR method for outlier detection flags values...", options: ["Above the mean only", "More than 1.5x the IQR beyond Q1 or Q3", "Below zero only", "That are text instead of numbers"], correct: 1 },
    { q: "Scaling variables before combining them helps prevent...", options: ["Data loss", "A large-scale variable from dominating just due to its raw size", "The need for a database", "Rounding errors"], correct: 1 },
    { q: "Survivorship bias comes from...", options: ["Sample sizes being too large", "Only studying the 'survivors' of a process while ignoring the rest", "Using the wrong chart type", "A database error"], correct: 1 },
    { q: "A key ethical concern in data analysis is...", options: ["Using too many charts", "Ensuring analyses and models treat different groups fairly", "Always using the newest software", "Avoiding all automation"], correct: 1 },
  ],
  intermediate: [
    { q: "Low statistical power means...", options: ["The test is guaranteed correct", "The test may miss a real effect due to insufficient sample size", "The sample is too large", "There's definitely no effect"], correct: 1 },
    { q: "Last-touch attribution gives credit to...", options: ["Every touchpoint equally", "Only the final interaction before purchase", "Only the first interaction", "No interactions at all"], correct: 1 },
    { q: "A retention curve's 'flattening point' represents...", options: ["The exact day everyone churns", "Roughly how many customers a business can expect to keep long-term", "A data error", "The total number of customers"], correct: 1 },
    { q: "Funnel analysis is useful because it...", options: ["Only shows one overall conversion number", "Reveals exactly where in a multi-step process people drop off", "Cannot be used for websites", "Replaces the need for KPIs"], correct: 1 },
    { q: "CLV (Customer Lifetime Value) helps determine...", options: ["Employee salaries", "How much is reasonable to spend acquiring a customer", "Server costs", "Tax obligations"], correct: 1 },
  ],
  advanced: [
    { q: "Causal inference techniques are used when...", options: ["A true randomized experiment isn't possible", "You want to avoid using any data", "Correlation is always enough", "Experiments are too easy to run"], correct: 1 },
    { q: "As a business grows, executive dashboards should...", options: ["Add every new metric to the main screen", "Use a layered structure with a focused top-level view and drill-down detail", "Be removed entirely", "Stay exactly the same forever"], correct: 1 },
    { q: "Data governance primarily addresses...", options: ["Choosing chart colors", "Ownership, consistent metric definitions, and quality monitoring across an organization", "Server hardware", "Marketing budgets"], correct: 1 },
    { q: "Compared to traditional analytics, machine learning generally emphasizes...", options: ["Interpretability above all else", "Prediction accuracy, sometimes with less interpretable models", "Avoiding data entirely", "Manual calculation only"], correct: 1 },
    { q: "A sound analytics strategy starts from...", options: ["Whatever data already exists", "The actual decisions a business needs to make", "The most expensive software available", "Hiring decisions"], correct: 1 },
  ],
};


// the UI will show them as "coming soon" until lessons are added.
function emptyLevel() {
  return { basic: [], intermediate: [], advanced: [], quiz: {} };
}

const COURSE_CONTENT = {
  sql: {
    entry: {
      basic: SQL_ENTRY_BASIC,
      intermediate: SQL_ENTRY_INTERMEDIATE,
      advanced: SQL_ENTRY_ADVANCED,
      quiz: SQL_QUIZ_BANK,
    },
    professional: {
      basic: SQL_PRO_BASIC,
      intermediate: SQL_PRO_INTERMEDIATE,
      advanced: SQL_PRO_ADVANCED,
      quiz: SQL_PRO_QUIZ_BANK,
    },
    master: {
      basic: SQL_MASTER_BASIC,
      intermediate: SQL_MASTER_INTERMEDIATE,
      advanced: SQL_MASTER_ADVANCED,
      quiz: SQL_MASTER_QUIZ_BANK,
    },
  },
  "data-analytics": {
    entry: {
      basic: DA_ENTRY_BASIC,
      intermediate: DA_ENTRY_INTERMEDIATE,
      advanced: DA_ENTRY_ADVANCED,
      quiz: DA_QUIZ_BANK,
    },
    professional: {
      basic: DA_PRO_BASIC,
      intermediate: DA_PRO_INTERMEDIATE,
      advanced: DA_PRO_ADVANCED,
      quiz: DA_PRO_QUIZ_BANK,
    },
    master: {
      basic: DA_MASTER_BASIC,
      intermediate: DA_MASTER_INTERMEDIATE,
      advanced: DA_MASTER_ADVANCED,
      quiz: DA_MASTER_QUIZ_BANK,
    },
  },
};
