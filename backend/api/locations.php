<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT l.*, b.name as bienName 
                FROM locations l 
                JOIN biens b ON l.bienId = b.id 
                ORDER BY l.createdAt DESC";
        $stmt = $pdo->query($sql);
        $locations = $stmt->fetchAll();
        echo json_encode($locations);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO locations (bienId, locataire, locatairePhone, locataireEmail, startDate, endDate, monthlyRent, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->bienId, $data->locataire, $data->locatairePhone, $data->locataireEmail,
            $data->startDate, $data->endDate, $data->monthlyRent, $data->status
        ]);
        
        // Update bien status if needed
        $updateBien = $pdo->prepare("UPDATE biens SET status = 'loue' WHERE id = ?");
        $updateBien->execute([$data->bienId]);
        
        echo json_encode(["message" => "Location created", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "UPDATE locations SET locataire=?, locatairePhone=?, locataireEmail=?, startDate=?, endDate=?, monthlyRent=?, status=? 
                WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->locataire, $data->locatairePhone, $data->locataireEmail,
            $data->startDate, $data->endDate, $data->monthlyRent, $data->status, $data->id
        ]);
        echo json_encode(["message" => "Location updated"]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM locations WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Location deleted"]);
        break;
}
?>
