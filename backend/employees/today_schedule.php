<?php
require_once "../cors.php";
session_start();
require_once __DIR__ . "/../config/database.php";

if (!isset($_SESSION['employee_id'])) {
  echo json_encode(null);
  exit;
}

$employee_id = $_SESSION['employee_id'];
$day = date('l'); // Monday, Tuesday, etc.

$stmt = $conn->prepare("
  SELECT start_time, end_time, shift_type, work_setup
  FROM schedules
  WHERE employee_id = ? AND day_of_week = ?
  LIMIT 1
");
$stmt->bind_param("is", $employee_id, $day);
$stmt->execute();

echo json_encode($stmt->get_result()->fetch_assoc());
exit;
