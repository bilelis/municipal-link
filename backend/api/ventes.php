<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT v.*, b.name as bienName 
                FROM ventes v 
                JOIN biens b ON v.bienId = b.id 
                ORDER BY v.createdAt DESC";
        $stmt = $pdo->query($sql);
        $ventes = $stmt->fetchAll();
        echo json_encode($ventes);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO ventes (bienId, buyerName, buyerPhone, buyerEmail, salePrice, saleDate) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->bienId, $data->buyerName, $data->buyerPhone, $data->buyerEmail,
            $data->salePrice, $data->saleDate
        ]);
        
        // Update bien status
        $updateBien = $pdo->prepare("UPDATE biens SET status = 'vendu' WHERE id = ?");
        $updateBien->execute([$data->bienId]);
        
        echo json_encode(["message" => "Vente created", "id" => $pdo->lastInsertId()]);
        break;
}
?>
