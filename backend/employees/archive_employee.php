<?php

require_once "../cors.php";
session_start();

require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

$employee_id = $data['employee_id'];

$stmt = $conn->prepare("
UPDATE employees
SET archived = 1
WHERE employee_id = ?
");

$stmt->bind_param("i", $employee_id);
$stmt->execute();

echo json_encode([
    "success" => true
]);