<?php
header('Content-Type: application/json');

$dsn = "mysql:host=localhost;dbname=finance_management;charset=utf8mb4";
$username = "root";
$password = "";

try {
    $pdo = new PDO($dsn, $username, $password);
    $stmt = $pdo->query("SELECT * FROM transactions ORDER BY id DESC");
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($transactions);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
