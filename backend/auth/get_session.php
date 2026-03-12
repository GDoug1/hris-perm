<?php
require_once "../cors.php";
session_start();

echo json_encode([
    "success" => true,
    "permissions" => $_SESSION['permissions'] ?? [],
    "role" => $_SESSION['role_name'] ?? null
]);