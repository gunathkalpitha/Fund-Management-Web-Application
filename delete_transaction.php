<?php
header('Content-Type: application/json');

$host = 'localhost';
$db = 'finance_management';
$user = 'root';
$pass = '';
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
  echo json_encode(["status" => "error", "message" => "DB connection failed"]);
  exit();
}

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!isset($data['id'])) {
  echo json_encode(["status" => "error", "message" => "Transaction ID missing"]);
  exit();
}

$id = intval($data['id']);

$stmt = $conn->prepare("DELETE FROM transactions WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
