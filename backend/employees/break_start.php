<?php
require_once "../cors.php";
session_start();
require_once __DIR__ . "/../config/database.php";

if (!isset($_SESSION['employee_id'])) {
  http_response_code(401);
  echo json_encode(["error" => "Not logged in"]);
  exit;
}

$employee_id = $_SESSION['employee_id'];
$today = date('Y-m-d');

// get today time_log
$stmt = $conn->prepare("
  SELECT time_log_id FROM time_logs
  WHERE employee_id = ? AND log_date = ? AND time_out IS NULL
");
$stmt->bind_param("is", $employee_id, $today);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
  http_response_code(400);
  echo json_encode(["error" => "Not timed in"]);
  exit;
}

$time_log_id = $res->fetch_assoc()['time_log_id'];

$conn->query("
  INSERT INTO break_logs (time_log_id, break_start)
  VALUES ($time_log_id, NOW())
");

echo json_encode(["message" => "Break started"]);
exit;