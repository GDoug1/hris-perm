<?php

function logAction($conn, $user_id, $action, $target = null) {

    $stmt = $conn->prepare("
        INSERT INTO activity_logs (user_id, action, target)
        VALUES (?, ?, ?)
    ");

    $stmt->bind_param("iss", $user_id, $action, $target);
    $stmt->execute();
}