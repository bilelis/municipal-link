import { useState } from 'react';
import { Search, CheckCircle, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockPaiements } from '@/data/mockData';
import { Paiement, PaymentStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const statusConfig = {
  paid: { 
    color: 'bg-green-100 text-green-800', 
    label: 'Payé',
    icon: CheckCircle,
  },
  pending: { 
    color: 'bg-yellow-100 text-yellow-800', 
    label: 'En attente',
    icon: Clock,
  },
  overdue: { 
    color: 'bg-red-100 text-red-800', 
    label: 'En retard',
    icon: AlertTriangle,
  },
};

export default function Paiements() {
  const [paiements, setPaiements] = useState<Paiement[]>(mockPaiements);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  const filteredPaiements = paiements.filter(paiement => {
    const matchesSearch = paiement.bienName.toLowerCase().includes(search.toLowerCase()) ||
                         paiement.locataire.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || paiement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = (id: string) => {
    setPaiements(paiements.map(p => 
      p.id === id 
        ? { ...p, status: 'paid' as PaymentStatus, paidDate: new Date().toISOString().split('T')[0] }
        : p
    ));
    toast({ 
      title: 'Paiement confirmé', 
      description: 'Le paiement a été marqué comme payé' 
    });
  };

  const totalPaid = paiements
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = paiements
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalOverdue = paiements
    .filter(p => p.status === 'overdue')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Paiements</h1>
          <p className="text-muted-foreground">Suivez les paiements des locations</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Payés</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalPaid.toLocaleString()} DT</div>
              <p className="text-xs text-muted-foreground">
                {paiements.filter(p => p.status === 'paid').length} paiements
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{totalPending.toLocaleString()} DT</div>
              <p className="text-xs text-muted-foreground">
                {paiements.filter(p => p.status === 'pending').length} paiements
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">En Retard</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{totalOverdue.toLocaleString()} DT</div>
              <p className="text-xs text-muted-foreground">
                {paiements.filter(p => p.status === 'overdue').length} paiements
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par bien ou locataire..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Suivi des Paiements ({filteredPaiements.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bien</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Mois</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Échéance</TableHead>
                  <TableHead>Date Paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPaiements.map((paiement) => {
                  const StatusIcon = statusConfig[paiement.status].icon;
                  return (
                    <TableRow key={paiement.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{paiement.bienName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{paiement.locataire}</TableCell>
                      <TableCell>{paiement.month}</TableCell>
                      <TableCell className="font-medium">{paiement.amount} DT</TableCell>
                      <TableCell>{paiement.dueDate}</TableCell>
                      <TableCell>{paiement.paidDate || '-'}</TableCell>
                      <TableCell>
                        <Badge className={statusConfig[paiement.status].color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[paiement.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {paiement.status !== 'paid' && (
                          <Button 
                            size="sm" 
                            onClick={() => handleMarkAsPaid(paiement.id)}
                          >
                            Confirmer
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
