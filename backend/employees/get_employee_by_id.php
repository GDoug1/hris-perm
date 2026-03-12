<?php
require_once "../cors.php";

include("../config/database.php");

if (!isset($_GET['id'])) {
    echo json_encode(["success" => false, "message" => "No ID"]);
    exit();
}

$id = intval($_GET['id']);

$stmt = $conn->prepare("SELECT * FROM employees WHERE employee_id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($employee = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "employee" => $employee]);
} else {
    echo json_encode(["success" => false]);
}
