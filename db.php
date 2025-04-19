<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "finance_management";

$conn = new mysqli($host, $user, $password, $dbname);


if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]));
}
?>
