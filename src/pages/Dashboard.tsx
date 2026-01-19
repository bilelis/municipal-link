import { Building2, Key, ShoppingCart, CreditCard, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockBiens, mockLocations, mockPaiements, mockVentes } from '@/data/mockData';
import { DashboardStats } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function calculateStats(): DashboardStats {
  const totalBiens = mockBiens.length;
  const biensLoues = mockBiens.filter(b => b.status === 'loue').length;
  const biensVendus = mockBiens.filter(b => b.status === 'vendu').length;
  const biensDisponibles = mockBiens.filter(b => b.status === 'disponible').length;
  
  const revenusMensuels = mockLocations
    .filter(l => l.status === 'active')
    .reduce((sum, l) => sum + l.monthlyRent, 0);
  
  const revenusAnnuels = revenusMensuels * 12;
  
  const paiementsEnRetard = mockPaiements.filter(p => p.status === 'overdue').length;
  const contratsActifs = mockLocations.filter(l => l.status === 'active').length;

  return {
    totalBiens,
    biensLoues,
    biensVendus,
    biensDisponibles,
    revenusMensuels,
    revenusAnnuels,
    paiementsEnRetard,
    contratsActifs,
  };
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--destructive))', 'hsl(var(--muted-foreground))'];

export default function Dashboard() {
  const stats = calculateStats();

  const pieData = [
    { name: 'Loués', value: stats.biensLoues },
    { name: 'Vendus', value: stats.biensVendus },
    { name: 'Disponibles', value: stats.biensDisponibles },
  ];

  const revenueData = [
    { month: 'Jan', revenus: 4100 },
    { month: 'Fév', revenus: 4100 },
    { month: 'Mar', revenus: 4100 },
    { month: 'Avr', revenus: 4100 },
    { month: 'Mai', revenus: 4100 },
    { month: 'Jun', revenus: 4100 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-muted-foreground">Vue d'ensemble du patrimoine municipal</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Biens</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBiens}</div>
              <p className="text-xs text-muted-foreground">
                {stats.biensDisponibles} disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Biens Loués</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.biensLoues}</div>
              <p className="text-xs text-muted-foreground">
                {stats.contratsActifs} contrats actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenusMensuels.toLocaleString()} DT</div>
              <p className="text-xs text-muted-foreground">
                {stats.revenusAnnuels.toLocaleString()} DT/an
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Paiements en Retard</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.paiementsEnRetard}</div>
              <p className="text-xs text-muted-foreground">
                Nécessitent une action
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Répartition des Biens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenus Mensuels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} DT`, 'Revenus']} />
                    <Bar dataKey="revenus" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPaiements.slice(0, 5).map((paiement) => (
                <div key={paiement.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{paiement.bienName}</p>
                      <p className="text-sm text-muted-foreground">{paiement.locataire}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{paiement.amount} DT</p>
                    <p className={`text-sm ${
                      paiement.status === 'paid' ? 'text-green-600' :
                      paiement.status === 'overdue' ? 'text-destructive' : 'text-yellow-600'
                    }`}>
                      {paiement.status === 'paid' ? 'Payé' :
                       paiement.status === 'overdue' ? 'En retard' : 'En attente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
