CREATE DATABASE IF NOT EXISTS municipal_link CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE municipal_link;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee', 'finance') NOT NULL DEFAULT 'employee',
    isActive BOOLEAN DEFAULT TRUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: biens
CREATE TABLE IF NOT EXISTS biens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('cafe', 'jardin', 'local', 'terrain') NOT NULL,
    status ENUM('disponible', 'loue', 'vendu') NOT NULL DEFAULT 'disponible',
    address TEXT NOT NULL,
    surface DECIMAL(10, 2) NOT NULL,
    description TEXT,
    monthlyRent DECIMAL(10, 2),
    salePrice DECIMAL(12, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table: locations
CREATE TABLE IF NOT EXISTS locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bienId INT NOT NULL,
    locataire VARCHAR(255) NOT NULL,
    locatairePhone VARCHAR(50),
    locataireEmail VARCHAR(255),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    monthlyRent DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'expired', 'terminated') NOT NULL DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bienId) REFERENCES biens(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table: ventes
CREATE TABLE IF NOT EXISTS ventes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bienId INT NOT NULL,
    buyerName VARCHAR(255) NOT NULL,
    buyerPhone VARCHAR(50),
    buyerEmail VARCHAR(255),
    salePrice DECIMAL(12, 2) NOT NULL,
    saleDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bienId) REFERENCES biens(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table: paiements
CREATE TABLE IF NOT EXISTS paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    locationId INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    dueDate DATE NOT NULL,
    paidDate DATE,
    status ENUM('paid', 'pending', 'overdue') NOT NULL DEFAULT 'pending',
    month VARCHAR(50) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (locationId) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Initial data (password: admin123)
INSERT INTO users (email, password, name, role) VALUES 
('admin@commune.tn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ahmed Ben Ali', 'admin');

-- Mock Biens
INSERT INTO biens (name, type, status, address, surface, description, monthlyRent) VALUES 
('Café Central', 'cafe', 'loue', 'Avenue Habib Bourguiba, Centre Ville', 120, 'Café situé au centre ville avec terrasse', 1500),
('Jardin d\'Enfants Al Amal', 'jardin', 'loue', 'Rue de la Liberté, Quartier Nord', 300, 'Jardin d\'enfants avec espace de jeux', 2000),
('Local Commercial N°5', 'local', 'disponible', 'Marché Municipal, Stand 5', 45, 'Local commercial au marché municipal', 800),
('Local Artisanal', 'local', 'loue', 'Rue des Artisans, N°23', 60, 'Local pour activités artisanales', 600);

INSERT INTO biens (name, type, status, address, surface, description, salePrice) VALUES 
('Terrain Zone Industrielle', 'terrain', 'vendu', 'Zone Industrielle, Lot 12', 5000, 'Terrain à usage industriel', 250000);

-- Mock Locations
INSERT INTO locations (bienId, locataire, locatairePhone, locataireEmail, startDate, endDate, monthlyRent, status) VALUES 
(1, 'Société ABC', '+216 71 123 456', 'contact@abc.tn', '2024-01-01', '2025-12-31', 1500, 'active'),
(2, 'Association Al Amal', '+216 71 234 567', 'alamal@email.tn', '2024-02-01', '2026-01-31', 2000, 'active'),
(4, 'Artisan Khadija', '+216 71 345 678', 'khadija@email.tn', '2024-03-01', '2025-02-28', 600, 'active');

-- Mock Ventes
INSERT INTO ventes (bienId, buyerName, buyerPhone, buyerEmail, salePrice, saleDate) VALUES 
(5, 'Société Industrielle XYZ', '+216 71 456 789', 'xyz@industry.tn', 250000, '2024-03-15');

-- Mock Paiements
INSERT INTO paiements (locationId, amount, dueDate, paidDate, status, month) VALUES 
(1, 1500, '2024-01-05', '2024-01-03', 'paid', 'Janvier 2024'),
(1, 1500, '2024-02-05', '2024-02-04', 'paid', 'Février 2024'),
(1, 1500, '2024-03-05', NULL, 'pending', 'Mars 2024'),
(2, 2000, '2024-02-05', '2024-02-10', 'paid', 'Février 2024'),
(2, 2000, '2024-03-05', NULL, 'overdue', 'Mars 2024'),
(3, 600, '2024-03-05', '2024-03-01', 'paid', 'Mars 2024');
