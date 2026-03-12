<?php
require_once "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once "../config/database.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// ================= GET ROLE + CLUSTER_id =================
$stmtUser = $conn->prepare("
    SELECT r.role_name, e.cluster_id
    FROM users u
    JOIN roles r ON u.role_id = r.role_id
    LEFT JOIN employees e ON u.user_id = e.user_id
    WHERE u.user_id = ?
");

$stmtUser->bind_param("i", $user_id);
$stmtUser->execute();
$resultUser = $stmtUser->get_result();
$userData = $resultUser->fetch_assoc();

$role = $userData['role_name'];
$coachCluster_id = $userData['cluster_id'];

// ================= QUERY =================
if ($role === "Teamcoach") {

    $stmt = $conn->prepare("
        SELECT 
            e.employee_id,
            e.first_name,
            e.middle_name,
            e.last_name,
            e.email,
            e.cluster_id,
            e.employment_status,
            s.day_of_week,
            s.shift_type,
            s.start_time,
            s.end_time,
            s.work_setup
        FROM employees e
        LEFT JOIN schedules s ON e.employee_id = s.employee_id
        WHERE e.cluster_id = ?
        ORDER BY e.employee_id DESC
    ");

    $stmt->bind_param("s", $coachCluster_id);
    $stmt->execute();
    $result = $stmt->get_result();

} else {
    // Admin & Superadmin see all

    $result = $conn->query("
        SELECT 
            e.employee_id,
            e.first_name,
            e.middle_name,
            e.last_name,
            e.email,
            e.cluster_id,
            e.employment_status,
            s.day_of_week,
            s.shift_type,
            s.start_time,
            s.end_time,
            s.work_setup
        FROM employees e
        LEFT JOIN schedules s ON e.employee_id = s.employee_id
        ORDER BY e.employee_id DESC
    ");
}

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
            "cluster_id" => $row['cluster_id'],
            "employment_status" => $row['employment_status'],
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
    "role" => $role, // 🔥 return role to frontend
    "employees" => array_values($employees)
]);

$conn->close();
