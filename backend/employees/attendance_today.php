<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ================= CORS =================
require_once "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================= SESSION =================
ini_set('session.cookie_samesite', 'None');
ini_set('session.cookie_secure', 'false'); // dev only
session_start();

// ================= DB =================
require_once __DIR__ . "/../config/database.php";

// ================= AUTH GUARD =================
if (!isset($_SESSION['employee_id'])) {
    http_response_code(401);
    echo json_encode(null);
    exit;
}

$employee_id = $_SESSION['employee_id'];
$today = date('Y-m-d');

// ================= QUERY =================
$stmt = $conn->prepare("
    SELECT 
        a.attendance_id,
        t.time_in,
        t.time_out
    FROM attendance a
    LEFT JOIN time_logs t 
        ON a.attendance_id = t.attendance_id
    WHERE a.employee_id = ?
      AND a.attendance_date = ?
    LIMIT 1
");

$stmt->bind_param("is", $employee_id, $today);
$stmt->execute();

$result = $stmt->get_result();

$data = $result->fetch_assoc();

// ================= RESPONSE =================
echo json_encode($data ?: null);
exit;
