<?php
header('Content-Type: application/json');
$input = json_decode(file_get_contents('php://input'), true);

$name = $input['name'];
$password = $input['password'];

try {
    $pdo = new PDO("mysql:host=localhost;dbname=finance_management", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("SELECT * FROM users WHERE name = ?");
    $stmt->execute([$name]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid name or password.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
