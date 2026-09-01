<?php
/**
 * Returns the signed-in user (or null) - the frontend calls this once on
 * page load to restore session state without needing to log in again.
 */

require_once __DIR__ . '/auth.php';

cors_headers();

$user = current_user();
send_json(['user' => $user]);
