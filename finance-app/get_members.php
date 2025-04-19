<?php
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=localhost;dbname=finance_management", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    
    $stmt = $pdo->query("SELECT name FROM users");
    $members = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo json_encode($members);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
