<?php

require_once "../cors.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

session_start();
require_once "../config/database.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || empty($data['email']) || empty($data['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Email and password are required"
    ]);
    exit();
}

$email = $data['email'];
$password = $data['password'];


// ================= GET USER =================

$stmt = $conn->prepare("
SELECT 
    u.user_id,
    u.email,
    u.password,
    u.role_id,
    r.role_name
FROM users u
INNER JOIN roles r ON u.role_id = r.role_id
WHERE u.email = ?
LIMIT 1
");

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);
    exit();
}

$user = $result->fetch_assoc();


// ================= VERIFY PASSWORD =================

if (!password_verify($password, $user['password'])) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);
    exit();
}


// ================= GET EMPLOYEE =================

$empStmt = $conn->prepare("
SELECT employee_id
FROM employees
WHERE user_id = ?
LIMIT 1
");

$empStmt->bind_param("i", $user['user_id']);
$empStmt->execute();
$empResult = $empStmt->get_result();

if ($empResult->num_rows === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Employee record not found"
    ]);
    exit();
}

$employee = $empResult->fetch_assoc();

// ================= ROLE PERMISSIONS =================

$rolePermStmt = $conn->prepare("
    SELECT p.permission_id, p.permission_name
    FROM role_permissions rp
    INNER JOIN permissions p 
        ON rp.permission_id = p.permission_id
    WHERE rp.role_id = ?
");

$rolePermStmt->bind_param("i", $user['role_id']);
$rolePermStmt->execute();
$rolePermResult = $rolePermStmt->get_result();

$permissions = [];

while ($row = $rolePermResult->fetch_assoc()) {
    $permissions[$row['permission_id']] = $row['permission_name'];
}


// ================= USER OVERRIDES =================

$userPermStmt = $conn->prepare("
    SELECT permission_id, is_allowed
    FROM user_permissions
    WHERE user_id = ?
");

$userPermStmt->bind_param("i", $user['user_id']);
$userPermStmt->execute();
$userPermResult = $userPermStmt->get_result();

while ($row = $userPermResult->fetch_assoc()) {

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

// ================= SAVE SESSION =================

$_SESSION['user_id']     = $user['user_id'];
$_SESSION['employee_id'] = $employee['employee_id'];
$_SESSION['email']    = $user['email'];
$_SESSION['role_id']     = $user['role_id'];
$_SESSION['role_name']   = $user['role_name'];

$_SESSION['permissions'] = array_values(array_filter($permissions));


// ================= RESPONSE =================

echo json_encode([
    "success" => true,
    "user" => [
        "user_id" => $user['user_id'],
        "email" => $user['email'],
        "role" => $user['role_name']
    ]
]);