<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT p.*, b.name as bienName, l.locataire 
                FROM paiements p 
                JOIN locations l ON p.locationId = l.id 
                JOIN biens b ON l.bienId = b.id 
                ORDER BY p.dueDate DESC";
        $stmt = $pdo->query($sql);
        $paiements = $stmt->fetchAll();
        echo json_encode($paiements);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO paiements (locationId, amount, dueDate, paidDate, status, month) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->locationId, $data->amount, $data->dueDate, 
            $data->paidDate ?? null, $data->status, $data->month
        ]);
        echo json_encode(["message" => "Paiement created", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "UPDATE paiements SET paidDate=?, status=? WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->paidDate, $data->status, $data->id
        ]);
        echo json_encode(["message" => "Paiement updated"]);
        break;
}
?>
