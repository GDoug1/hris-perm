<?php
// ================= CORS =================
require_once "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();

require_once "../helpers/permission_helper.php";
checkPermission("Delete Employee");

require_once __DIR__ . '/../config/database.php';


// ================= INPUT =================
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['employee_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid employee ID"
    ]);
    exit();
}

$employee_id = $data['employee_id'];


// ================= ARCHIVE EMPLOYEE =================
$stmt = $conn->prepare("
UPDATE employees
SET archived = 1
WHERE employee_id = ?
");

$stmt->bind_param("i", $employee_id);

if ($stmt->execute()) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "error" => $stmt->error
    ]);

}