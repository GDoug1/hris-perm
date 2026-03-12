<?php
require_once "../cors.php";
require_once "../helpers/permission_helper.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once "../config/database.php";

$sql = "
SELECT 
  e.employee_id,
  e.first_name,
  e.middle_name,
  e.last_name,
  e.email,
  e.personal_email,
  e.position,
  e.account,
  e.cluster_id,
  e.employee_type,
  e.employment_status,
  e.date_hired,
  s.day_of_week,
  s.shift_type,
  s.start_time,
  s.end_time,
  s.work_setup
FROM employees e
LEFT JOIN schedules s ON e.employee_id = s.employee_id
WHERE e.archived = 0
ORDER BY e.employee_id DESC
";

$result = $conn->query($sql);

$employees = [];

while ($row = $result->fetch_assoc()) {
    $id = $row['employee_id'];

    if (!isset($employees[$id])) {
        $employees[$id] = [
            "employee_id" => (int)$id,
            "first_name" => $row['first_name'],
            "middle_name" => $row['middle_name'],
            "last_name" => $row['last_name'],
            "email" => $row['email'],
            "personal_email" => $row['personal_email'],
            "position" => $row['position'],
            "account" => $row['account'],
            "cluster_id" => $row['cluster_id'],
            "employee_type" => $row['employee_type'],
            "employment_status" => $row['employment_status'],
            "date_hired" => $row['date_hired'],
            "schedules" => []
        ];
    }

    if (!empty($row['day_of_week'])) {
        $employees[$id]['schedules'][] = [
            "day" => $row['day_of_week'],
            "shift_type" => $row['shift_type'],
            "start" => $row['start_time'],
            "end" => $row['end_time'],
            "work_setup" => $row['work_setup']
        ];
    }
}

echo json_encode([
    "success" => true,
    "employees" => array_values($employees)
]);

$conn->close();