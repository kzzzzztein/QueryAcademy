<?php
/**
 * Login endpoint. POST {email, password}.
 */

require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/db.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') send_json(['error' => 'Use POST.'], 405);

$input = json_input();
$email = trim(strtolower($input['email'] ?? ''));
$password = (string)($input['password'] ?? '');

if ($email === '' || $password === '') {
    send_json(['error' => 'Please enter your email and password.'], 400);
}

$db = get_db();
$stmt = $db->prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

// Deliberately identical error for "no such account" and "wrong password" -
// telling them apart lets an attacker enumerate which emails are registered.
if (!$user || !password_verify($password, $user['password_hash'])) {
    send_json(['error' => 'Incorrect email or password.'], 401);
}

start_session();
session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];

send_json([
    'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'role' => $user['role']],
]);
