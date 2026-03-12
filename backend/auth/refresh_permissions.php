<?php

require_once "../cors.php";
session_start();
require_once "../config/database.php";

if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Not authenticated"
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

$permissions = [];

/* ================= ROLE PERMISSIONS ================= */

$stmt = $conn->prepare("
SELECT p.permission_id, p.permission_name
FROM users u
JOIN role_permissions rp ON u.role_id = rp.role_id
JOIN permissions p ON rp.permission_id = p.permission_id
WHERE u.user_id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $permissions[$row['permission_id']] = $row['permission_name'];
}


/* ================= USER OVERRIDES ================= */

$stmt = $conn->prepare("
SELECT permission_id, is_allowed
FROM user_permissions
WHERE user_id = ?
");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {

    $permId = $row['permission_id'];

    if ($row['is_allowed']) {

        $permStmt = $conn->prepare("
        SELECT permission_name
        FROM permissions
        WHERE permission_id = ?
        ");

        $permStmt->bind_param("i", $permId);
        $permStmt->execute();
        $permResult = $permStmt->get_result();
        $perm = $permResult->fetch_assoc();

        $permissions[$permId] = $perm['permission_name'];

    } else {

        unset($permissions[$permId]);

    }

}

$_SESSION['permissions'] = array_values($permissions);

echo json_encode([
    "success" => true,
    "permissions" => $_SESSION['permissions']
]);