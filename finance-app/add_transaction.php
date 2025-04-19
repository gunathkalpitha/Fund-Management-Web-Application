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

if (!$data || !is_array($data)) {
  $data = $_POST;
}


file_put_contents("debug_log.txt", "RAW: $input\nPARSED: " . print_r($data, true));


if (
  empty($data['user']) ||
  empty($data['type']) ||
  empty($data['amount']) ||
  empty($data['description'])
) {
  echo json_encode(["status" => "error", "message" => "Invalid or missing input"]);
  exit();
}


$stmt = $conn->prepare("INSERT INTO transactions (user, type, amount, description) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssds", $data['user'], $data['type'], $data['amount'], $data['description']);

if ($stmt->execute()) {
  echo json_encode(["status" => "success"]);
} else {
  echo json_encode(["status" => "error", "message" => $stmt->error]);
}

$stmt->close();
$conn->close();
?>
