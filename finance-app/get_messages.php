<?php


header('Content-Type: application/json');

$pdo = new PDO("mysql:host=localhost;dbname=finance_management", "root", "");

$sender = $_GET['sender'];
$receiver = $_GET['receiver'];

try {
    
    $stmt = $pdo->prepare("
        SELECT * FROM messages
        WHERE 
            (receiver = :receiver AND sender = :sender)
            OR (receiver = :sender AND sender = :receiver)
            OR (receiver = 'everyone')
        ORDER BY timestamp ASC
    ");

    $stmt->execute([
        ':sender' => $sender,
        ':receiver' => $receiver
    ]);

    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($messages);

} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
