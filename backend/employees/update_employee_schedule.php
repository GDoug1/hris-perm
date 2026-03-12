<?php
require_once "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['employee_id'], $data['schedules'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request payload'
    ]);
    exit();
}

$employee_id = (int)$data['employee_id'];
$schedules = $data['schedules'];

$conn->begin_transaction();

try {

    // 1️⃣ Delete existing schedules
    $deleteStmt = $conn->prepare("DELETE FROM schedules WHERE employee_id = ?");
    $deleteStmt->bind_param("i", $employee_id);
    $deleteStmt->execute();

    // 2️⃣ Insert new schedules
    $insertStmt = $conn->prepare("
        INSERT INTO schedules
        (employee_id, day_of_week, shift_type, start_time, end_time, work_setup)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    foreach ($schedules as $day) {
        $insertStmt->bind_param(
            "isssss",
            $employee_id,
            $day['day'],
            $day['shift_type'],
            $day['start'],
            $day['end'],
            $day['work_setup']
        );

        $insertStmt->execute();
    }

    $conn->commit();

    echo json_encode(['success' => true]);

} catch (Throwable $e) {

    $conn->rollback();

    echo json_encode([
        'success' => false,
        'message' => 'Failed to save schedule',
        'error' => $e->getMessage()
    ]);
}
