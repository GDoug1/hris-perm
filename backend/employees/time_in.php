<?php

// ================= CORS =================
require_once "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once "../config/database.php";

if (!isset($_SESSION['employee_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$employee_id = $_SESSION['employee_id'];

$today = date('Y-m-d');

$conn->begin_transaction();

// check attendance
$check = $conn->prepare("
SELECT attendance_id FROM attendance
WHERE employee_id = ? AND attendance_date = ?
");
$check->bind_param("is", $employee_id, $today);
$check->execute();
$res = $check->get_result();

if ($res->num_rows > 0) {
  http_response_code(400);
  echo json_encode(["message" => "Already timed in"]);
  exit;
}

// insert attendance
$insertAttendance = $conn->prepare("
INSERT INTO attendance (employee_id, attendance_date, attendance_status)
VALUES (?, ?, 'Present')
");
$insertAttendance->bind_param("is", $employee_id, $today);
$insertAttendance->execute();

$attendance_id = $conn->insert_id;

// insert time log
$insertLog = $conn->prepare("
INSERT INTO time_logs (employee_id, attendance_id, time_in, log_date)
VALUES (?, ?, NOW(), ?)
");
$insertLog->bind_param("iis", $employee_id, $attendance_id, $today);
$insertLog->execute();

$conn->commit();

echo json_encode(["message" => "Timed in successfully"]);
