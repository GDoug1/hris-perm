<?php

// ================= CORS =================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================= SESSION =================
session_start();

// ================= DB =================
require_once "../config/database.php";

// ================= LOGOUT =================
// Unset all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Clear session cookie (extra safety)
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

header("Content-Type: application/json");
echo json_encode(["message" => "Logged out successfully"]);
