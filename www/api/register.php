<?php
/**
 * Registration endpoint. POST {name, email, password}.
 *
 * The very first account ever created becomes an admin automatically -
 * so to get your own admin account, just register normally (as the
 * first person to do so) before sharing the site with anyone else.
 * Every account after that gets the regular "student" role.
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') send_json(['error' => 'Use POST.'], 405);

$input = json_input();
$name = trim($input['name'] ?? '');
$email = trim(strtolower($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if ($name === '' || mb_strlen($name) > 100) {
    send_json(['error' => 'Please enter your name.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) {
    send_json(['error' => 'Please enter a valid email address.'], 400);
}
if (strlen($password) < 8) {
    send_json(['error' => 'Password must be at least 8 characters.'], 400);
}

$db = get_db();

$existing = $db->prepare('SELECT id FROM users WHERE email = ?');
$existing->execute([$email]);
if ($existing->fetch()) {
    send_json(['error' => 'An account with that email already exists.'], 409);
}

$countStmt = $db->query('SELECT COUNT(*) AS c FROM users');
$isFirstAccount = ((int)$countStmt->fetch()['c']) === 0;
$role = $isFirstAccount ? 'admin' : 'student';

$hash = password_hash($password, PASSWORD_DEFAULT);

$insert = $db->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
$insert->execute([$name, $email, $hash, $role]);
$userId = (int)$db->lastInsertId();

start_session();
session_regenerate_id(true); // fresh session ID on privilege change (login/registration) - avoids session fixation
$_SESSION['user_id'] = $userId;

send_json([
    'user' => ['id' => $userId, 'name' => $name, 'email' => $email, 'role' => $role],
]);
