<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM biens WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $bien = $stmt->fetch();
            echo json_encode($bien);
        } else {
            $stmt = $pdo->query("SELECT * FROM biens ORDER BY createdAt DESC");
            $biens = $stmt->fetchAll();
            echo json_encode($biens);
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "INSERT INTO biens (name, type, status, address, surface, description, monthlyRent, salePrice) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->name, $data->type, $data->status, $data->address, 
            $data->surface, $data->description, $data->monthlyRent ?? null, $data->salePrice ?? null
        ]);
        echo json_encode(["message" => "Bien created", "id" => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $sql = "UPDATE biens SET name=?, type=?, status=?, address=?, surface=?, description=?, monthlyRent=?, salePrice=? 
                WHERE id=?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $data->name, $data->type, $data->status, $data->address, 
            $data->surface, $data->description, $data->monthlyRent ?? null, $data->salePrice ?? null, $data->id
        ]);
        echo json_encode(["message" => "Bien updated"]);
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM biens WHERE id = ?");
        $stmt->execute([$id]);
        echo json_encode(["message" => "Bien deleted"]);
        break;
}
?>
