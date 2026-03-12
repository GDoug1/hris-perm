<?php
require_once "../cors.php";

session_start();
require_once "../helpers/permission_helper.php";

checkPermission("Add Employee");
require_once "../config/database.php";
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit();
}

$conn->begin_transaction();

$check = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
$check->bind_param("s", $data['email']);
$check->execute();
$result = $check->get_result();

if ($result->num_rows > 0) {
    throw new Exception("Email already exists.");
}

try {

    // ================= PASSWORD GENERATION =================
    $firstLetter = strtolower(substr($data['first_name'], 0, 1));
    $lastName    = strtolower($data['last_name']);
    $plainPassword = $firstLetter . $lastName . "@123!";
    $hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT);

    // ================= CREATE USER =================
    $role_id = 4; // Employee role

    $stmtUser = $conn->prepare("
        INSERT INTO users (email, password, role_id)
        VALUES (?, ?, ?)
    ");

    $stmtUser->bind_param(
        "ssi",
        $data['email'],
        $hashedPassword,
        $role_id
    );

    $stmtUser->execute();
    $user_id = $stmtUser->insert_id;

    // ================= CREATE EMPLOYEE =================
    $stmtEmp = $conn->prepare("
        INSERT INTO employees (
            user_id,
            first_name,
            middle_name,
            last_name,
            address,
            birthdate,
            civil_status,
            email,
            personal_email,
            position,
            account,
            contact_number,
            employment_status,
            employee_type,
            date_hired
            
        )
        VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Active', ?, CURDATE()
        )
    ");

    $stmtEmp->bind_param(
        "issssssssssss",
        $user_id,
        $data['first_name'],
        $data['middle_name'],
        $data['last_name'],
        $data['address'],
        $data['birthdate'],
        $data['civil_status'],
        $data['email'],
        $data['personal_email'],
        $data['position'],
        $data['account'],
        $data['contact_number'],
        $data['employee_type']
    );

    $stmtEmp->execute();

    $conn->commit();

    echo json_encode([
        "success" => true,
        "generated_account" => [
            "email" => $data['email'],
            "password" => $plainPassword
        ]
    ]);

} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}