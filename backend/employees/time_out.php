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
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$employee_id = $_SESSION['employee_id'];
$today = date('Y-m-d');

// ================= TIME OUT =================
$conn->begin_transaction();
// ================= GET ACTIVE TIME LOG =================
$stmt = $conn->prepare("
    SELECT 
        time_log_id,
        time_in
    FROM time_logs
    WHERE employee_id = ?
      AND log_date = ?
      AND time_out IS NULL
    LIMIT 1
");
$stmt->bind_param("is", $employee_id, $today);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $conn->rollback();
    http_response_code(400);
    echo json_encode(["message" => "No active time-in"]);
    exit;
}

$log = $result->fetch_assoc();
$time_log_id = $log['time_log_id'];
$time_in = new DateTime($log['time_in']);
$time_out = new DateTime();

// ================= GET TOTAL BREAK MINUTES =================
$breakStmt = $conn->prepare("
    SELECT COALESCE(SUM(total_break_minutes), 0) AS total_break
    FROM break_logs
    WHERE time_log_id = ?
");
$breakStmt->bind_param("i", $time_log_id);
$breakStmt->execute();
$breakResult = $breakStmt->get_result()->fetch_assoc();

$totalBreakMinutes = (int)$breakResult['total_break'];

// ================= COMPUTE WORKED MINUTES =================
$workedMinutes =
    (($time_out->getTimestamp() - $time_in->getTimestamp()) / 60)
    - $totalBreakMinutes;

$workedMinutes = max(0, (int)$workedMinutes);

// ================= UPDATE TIME LOG =================
$update = $conn->prepare("
    UPDATE time_logs
    SET 
        time_out = NOW(),
        total_work_minutes = ?
    WHERE time_log_id = ?
");
$update->bind_param("ii", $workedMinutes, $time_log_id);
$update->execute();

$conn->commit();

echo json_encode([
    "message" => "Timed out successfully",
    "worked_minutes" => $workedMinutes
]);
exit;
