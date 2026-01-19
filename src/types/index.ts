// User & Auth Types
export type UserRole = 'admin' | 'employee' | 'finance';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Bien (Property) Types
export type BienType = 'cafe' | 'jardin' | 'local' | 'terrain';
export type BienStatus = 'disponible' | 'loue' | 'vendu';

export interface Bien {
  id: string;
  name: string;
  type: BienType;
  status: BienStatus;
  address: string;
  surface: number;
  description: string;
  monthlyRent?: number;
  salePrice?: number;
  createdAt: string;
}

// Location (Rental) Types
export type ContractStatus = 'active' | 'expired' | 'terminated';

export interface Location {
  id: string;
  bienId: string;
  bienName: string;
  locataire: string;
  locatairePhone: string;
  locataireEmail: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: ContractStatus;
  createdAt: string;
}

// Vente (Sale) Types
export interface Vente {
  id: string;
  bienId: string;
  bienName: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  salePrice: number;
  saleDate: string;
  createdAt: string;
}

// Paiement (Payment) Types
export type PaymentStatus = 'paid' | 'pending' | 'overdue';

export interface Paiement {
  id: string;
  locationId: string;
  bienName: string;
  locataire: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  month: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalBiens: number;
  biensLoues: number;
  biensVendus: number;
  biensDisponibles: number;
  revenusMensuels: number;
  revenusAnnuels: number;
  paiementsEnRetard: number;
  contratsActifs: number;
}
