<?php

header("Content-Type: application/json");

$host = 'localhost';
$dbname = 'finance_management';
$user = 'root'; 
$pass = '';     

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "DB connection failed: " . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"]);
$password = $data["password"];

if (!$name || !$password) {
    echo json_encode(["status" => "error", "message" => "Missing name or password"]);
    exit();
}


$stmt = $pdo->prepare("SELECT * FROM users WHERE name = ?");
$stmt->execute([$name]);
if ($stmt->rowCount() > 0) {
    echo json_encode(["status" => "error", "message" => "User already exists"]);
    exit();
}


$stmt = $pdo->prepare("INSERT INTO users (name, password) VALUES (?, ?)");
if ($stmt->execute([$name, password_hash($password, PASSWORD_DEFAULT)])) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Signup failed"]);
}
?>


