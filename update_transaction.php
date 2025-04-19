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

$id = intval($data['id']);
$user = $data['user'];
$type = $data['type'];
$amount = floatval($data['amount']);
$description = $data['description'];

$stmt = $conn->prepare("UPDATE transactions SET user = ?, type = ?, amount = ?, description = ? WHERE id = ?");
$stmt->bind_param("ssdsi", $user, $type, $amount, $description, $id);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
