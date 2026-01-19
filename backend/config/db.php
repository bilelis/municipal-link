<?php
header("Content-Type: application/json; charset=UTF-8");

// Database configuration
$host = "localhost";
$db_name = "municipal_link";
$username = "root";
$password = "";

try {
    $pdo = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    // Force UTF-8
    $pdo->exec("set names utf8");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $exception) {
    // If connection fails, return 500
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Database connection failed: " . $exception->getMessage()
    ]);
    exit();
}
?>
