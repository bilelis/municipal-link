<?php
require_once '../config/cors.php';
require_once '../config/db.php';

$stats = [];

// Total Biens
$stats['totalBiens'] = (int)$pdo->query("SELECT COUNT(*) FROM biens")->fetchColumn();

// Biens Loués
$stats['biensLoues'] = (int)$pdo->query("SELECT COUNT(*) FROM biens WHERE status = 'loue'")->fetchColumn();

// Biens Vendus
$stats['biensVendus'] = (int)$pdo->query("SELECT COUNT(*) FROM biens WHERE status = 'vendu'")->fetchColumn();

// Biens Disponibles
$stats['biensDisponibles'] = (int)$pdo->query("SELECT COUNT(*) FROM biens WHERE status = 'disponible'")->fetchColumn();

// Revenus Mensuels (Sum of monthlyRent from active locations)
$stats['revenusMensuels'] = (float)$pdo->query("SELECT SUM(monthlyRent) FROM locations WHERE status = 'active'")->fetchColumn();

// Revenus Annuels (Sum of all paid paiements in the current year)
$currentYear = date('Y');
$stats['revenusAnnuels'] = (float)$pdo->query("SELECT SUM(amount) FROM paiements WHERE status = 'paid' AND YEAR(paidDate) = $currentYear")->fetchColumn();

// Paiements en retard
$stats['paiementsEnRetard'] = (int)$pdo->query("SELECT COUNT(*) FROM paiements WHERE status = 'overdue'")->fetchColumn();

// Contrats actifs
$stats['contratsActifs'] = (int)$pdo->query("SELECT COUNT(*) FROM locations WHERE status = 'active'")->fetchColumn();

echo json_encode($stats);
?>
