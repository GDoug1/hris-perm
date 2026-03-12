<?php
require_once "../cors.php";
session_start();

require_once __DIR__ . "/../config/database.php";

// default = today
$date = $_GET['date'] ?? date('Y-m-d');
$search = $_GET['search'] ?? '';

$sql = "
SELECT
  e.employee_id,
  e.first_name,
  e.last_name,
  a.attendance_date,
  a.attendance_status,
  t.time_in,
  t.time_out,
  t.total_work_minutes
FROM attendance a
JOIN employees e ON a.employee_id = e.employee_id
LEFT JOIN time_logs t ON a.attendance_id = t.attendance_id
WHERE a.attendance_date = ?
  AND CONCAT(e.first_name, ' ', e.last_name) LIKE ?
ORDER BY e.first_name
";

$stmt = $conn->prepare($sql);
$searchLike = "%$search%";
$stmt->bind_param("ss", $date, $searchLike);
$stmt->execute();

$result = $stmt->get_result();
$data = [];

while ($row = $result->fetch_assoc()) {
  $data[] = $row;
}

echo json_encode($data);
exit;
