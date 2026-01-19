<?php
/**
 * cors.php - Robust CORS Header Management
 */

// Define allowed origins
$allowed_origin = "http://localhost:8080";

// Only add headers if they haven't been added by Apache (.htaccess)
if (!headers_sent()) {
    header("Access-Control-Allow-Origin: $allowed_origin");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");
}

// Handle OPTIONS Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
