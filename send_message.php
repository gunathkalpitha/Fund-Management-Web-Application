<?php

header('Content-Type: application/json');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$sender = $data['sender'] ?? '';
$receiver = $data['receiver'] ?? '';
$message = $data['message'] ?? '';

if (!$sender || !$receiver || !$message) {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
    exit;
}

try {
    $pdo = new PDO("mysql:host=localhost;dbname=finance_management", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO messages (sender, receiver, message, timestamp) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$sender, $receiver, $message]);

    echo json_encode(["status" => "success"]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB error: " . $e->getMessage()]);
}
