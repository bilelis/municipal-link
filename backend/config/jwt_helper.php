<?php
/**
 * jwt_helper.php - Simple JWT Implementation for PHP (No dependencies)
 */

class JWT {
    private static $secret = 'municipal_link_secret_key_2026'; // Change this in production

    public static function encode($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, self::$secret, true);
        $base64UrlSignature = self::base64UrlEncode($signature);
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    public static function decode($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        $header = $parts[0];
        $payload = $parts[1];
        $signature = $parts[2];

        $validSignature = self::base64UrlEncode(hash_hmac('sha256', $header . "." . $payload, self::$secret, true));

        if ($signature !== $validSignature) return null;

        return json_decode(self::base64UrlDecode($payload), true);
    }

    private static function base64UrlEncode($data) {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    private static function base64UrlDecode($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $padlen = 4 - $remainder;
            $data .= str_repeat('=', $padlen);
        }
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
    }
}
?>
