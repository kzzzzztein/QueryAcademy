<?php
/**
 * Shared session/auth helpers. Every account endpoint requires this file
 * before it requires db.php. Uses PHP's built-in session mechanism
 * (a cookie), which only works cleanly when the frontend and /api/ are
 * served from the same domain - true for a normal single-Hostinger-account
 * deployment of this site, but worth knowing if you ever split them onto
 * separate domains later (that would need a different auth approach,
 * like a bearer token, since cross-origin cookies get complicated fast).
 */

function start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) return;
    $isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
    // A request carrying an Origin header that differs from this site's own
    // host is a genuinely cross-origin call - the Android app's bundled
    // pages, calling out from their own local origin, not this website
    // calling itself. SameSite=Lax (the safer default) blocks a cookie from
    // being sent on exactly that kind of cross-origin fetch, so the app
    // would look logged-out on every request even after a real login -
    // SameSite=None is what's needed there, and browsers require Secure
    // (HTTPS) whenever SameSite=None is used, which is already checked below.
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $ownHost = $_SERVER['HTTP_HOST'] ?? '';
    $isCrossOrigin = $origin !== '' && parse_url($origin, PHP_URL_HOST) !== $ownHost;
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,     // JS can't read the session cookie - blocks a whole class of XSS token theft
        'samesite' => $isCrossOrigin ? 'None' : 'Lax',
        'secure' => $isCrossOrigin || $isHttps,
    ]);
    session_start();
}

function json_input(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function send_json($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function current_user(): ?array {
    start_session();
    if (empty($_SESSION['user_id'])) return null;
    require_once __DIR__ . '/db.php';
    $stmt = get_db()->prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?');
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    return $user ?: null;
}

function require_login(): array {
    $user = current_user();
    if (!$user) send_json(['error' => 'Not signed in.'], 401);
    return $user;
}

function require_admin(): array {
    $user = require_login();
    if ($user['role'] !== 'admin') send_json(['error' => 'Admins only.'], 403);
    return $user;
}

function cors_headers(): void {
    // Wildcard (*) Access-Control-Allow-Origin cannot be combined with
    // Access-Control-Allow-Credentials: true - every browser and WebView
    // (including the Android app's) silently rejects that combination for
    // any request sending cookies, which every login/register/me/logout
    // call here does. This only ever worked on the website itself because
    // same-origin requests aren't subject to CORS at all - reflecting back
    // the actual calling Origin (instead of *) is what makes it also work
    // for a genuinely different origin, like the Android app's bundled
    // local pages calling out to this real domain.
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}
