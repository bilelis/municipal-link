<?php
/**
 * auth.php - Resilient Auth Endpoint
 */

// 1. FORCE CORS HEADERS IMMEDIATELY
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// 2. HANDLE PREFLIGHT OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. DETECT INPUT
$input = json_decode(file_get_contents("php://input"));

// 4. TEST MODE (No DB needed)
if ($input && isset($input->email) && $input->email === "admin@test.tn" && $input->password === "test1234") {
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => "0",
            "name" => "Test Admin",
            "email" => "admin@test.tn",
            "role" => "admin",
            "isActive" => true
        ],
        "token" => "test_token_12345"
    ]);
    exit();
}

// 5. REAL AUTH (Includes DB)
try {
    require_once '../config/db.php';
    require_once '../config/jwt_helper.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "error" => "Method Not Allowed"]);
        exit();
    }

    if (!$input || empty($input->email) || empty($input->password)) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Missing credentials"]);
        exit();
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? LIMIT 1");
    $stmt->execute([$input->email]);
    $user = $stmt->fetch();

    if ($user && password_verify($input->password, $user['password'])) {
        unset($user['password']);
        echo json_encode([
            "success" => true,
            "user" => $user,
            "token" => JWT::encode($user)
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["success" => false, "error" => "Invalid credentials"]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Server error: " . $e->getMessage()]);
}
?>
