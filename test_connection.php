<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "finance_management";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("❌ Connection failed: " . $conn->connect_error);
} else {
    echo "✅ Database connected successfully!";
}
?>
