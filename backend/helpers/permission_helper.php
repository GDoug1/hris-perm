<?php
function checkPermission($permission) {

    if (!isset($_SESSION['permissions'])) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Unauthorized"
        ]);
        exit();
    }

    if (!in_array($permission, $_SESSION['permissions'])) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Access denied"
        ]);
        exit();
    }
}