<?php
/**
 * Logout endpoint. POST, no body needed.
 */

require_once __DIR__ . '/auth.php';

cors_headers();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') send_json(['error' => 'Use POST.'], 405);

start_session();
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
}
session_destroy();

send_json(['success' => true]);
