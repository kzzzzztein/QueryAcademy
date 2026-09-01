<?php
/**
 * Tutor API proxy.
 *
 * The React app calls this endpoint instead of calling Claude's API directly,
 * so the API key never appears in the browser. This file reads the key from
 * config.php, which is NOT committed/uploaded to any public repo or shared
 * folder — see README.md for setup instructions.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // tighten this to your domain once deployed
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php'; // defines ANTHROPIC_API_KEY — see config.example.php

if (!defined('ANTHROPIC_API_KEY') || ANTHROPIC_API_KEY === '') {
    http_response_code(500);
    echo json_encode(['error' => 'Tutor API key not configured yet.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$message = trim($input['message'] ?? '');
$lesson = trim($input['lesson'] ?? '');

if ($message === '') {
    http_response_code(400);
    echo json_encode(['error' => 'No question provided.']);
    exit;
}

$systemPrompt = "You are a friendly, encouraging SQL tutor inside a course called query.academy. "
    . "The learner is currently on the lesson: \"$lesson\". "
    . "Answer their question clearly and briefly (3-5 sentences max), using simple language and a short SQL example when useful. "
    . "Stay focused on SQL and databases.";

$payload = [
    'model' => 'claude-sonnet-5',
    'max_tokens' => 400,
    'system' => $systemPrompt,
    'messages' => [
        ['role' => 'user', 'content' => $message],
    ],
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . ANTHROPIC_API_KEY,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not reach the tutor service.']);
    exit;
}

$data = json_decode($response, true);

if ($httpCode !== 200 || !isset($data['content'][0]['text'])) {
    http_response_code(502);
    echo json_encode(['error' => $data['error']['message'] ?? 'Unexpected response from tutor service.']);
    exit;
}

echo json_encode(['reply' => $data['content'][0]['text']]);
