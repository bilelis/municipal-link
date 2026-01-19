import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, Clock } from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { Location, ContractStatus, Bien } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { differenceInMonths, differenceInDays, parseISO } from 'date-fns';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  expired: 'bg-red-100 text-red-800',
  terminated: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  active: 'Actif',
  expired: 'Expiré',
  terminated: 'Résilié',
};

function calculateRemainingTime(endDate: string): string {
  if (!endDate) return '-';
  const end = parseISO(endDate);
  const now = new Date();

  if (end < now) return 'Expiré';

  const months = differenceInMonths(end, now);
  const days = differenceInDays(end, now) % 30;

  if (months > 0) {
    return `${months} mois ${days} jours`;
  }
  return `${days} jours`;
}

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [biens, setBiens] = useState<Bien[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      const [locationsData, biensData] = await Promise.all([
        api.locations.getAll(),
        api.biens.getAll()
      ]);
      setLocations(locationsData);
      setBiens(biensData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast({ title: 'Erreur', description: 'Impossible de charger les données', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const availableBiens = biens.filter(b => b.status === 'disponible' || b.status === 'loue');

  const [formData, setFormData] = useState({
    bienId: '',
    locataire: '',
    locatairePhone: '',
    locataireEmail: '',
    startDate: '',
    endDate: '',
    monthlyRent: '',
  });

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.bienName.toLowerCase().includes(search.toLowerCase()) ||
      location.locataire.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      bienId: '',
      locataire: '',
      locatairePhone: '',
      locataireEmail: '',
      startDate: '',
      endDate: '',
      monthlyRent: '',
    });
    setEditingLocation(null);
  };

  const handleOpenDialog = (location?: Location) => {
    if (location) {
      setEditingLocation(location);
      setFormData({
        bienId: location.bienId,
        locataire: location.locataire,
        locatairePhone: location.locatairePhone,
        locataireEmail: location.locataireEmail,
        startDate: location.startDate,
        endDate: location.endDate,
        monthlyRent: location.monthlyRent.toString(),
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLocation) {
        await api.locations.update({
          ...editingLocation,
          ...formData,
          monthlyRent: parseFloat(formData.monthlyRent),
          status: editingLocation.status
        });
        toast({ title: 'Contrat modifié', description: 'Le contrat a été mis à jour avec succès' });
      } else {
        await api.locations.create({
          ...formData,
          monthlyRent: parseFloat(formData.monthlyRent),
          status: 'active'
        });
        toast({ title: 'Contrat créé', description: 'Le nouveau contrat de location a été créé' });
      }
      fetchData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({ title: 'Erreur', description: 'Une erreur est survenue', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      try {
        await api.locations.delete(id);
        toast({ title: 'Contrat supprimé', description: 'Le contrat a été supprimé avec succès' });
        fetchData();
      } catch (error) {
        toast({ title: 'Erreur', description: 'Impossible de supprimer le contrat', variant: 'destructive' });
      }
    }
  };

  const totalRevenue = locations
    .filter(l => l.status === 'active')
    .reduce((sum, l) => sum + l.monthlyRent, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Locations</h1>
            <p className="text-muted-foreground">Gérez les contrats de location</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau Contrat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingLocation ? 'Modifier le Contrat' : 'Nouveau Contrat de Location'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Bien à louer</Label>
                  <Select value={formData.bienId} onValueChange={(v) => setFormData({ ...formData, bienId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un bien" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBiens.map(bien => (
                        <SelectItem key={bien.id} value={bien.id}>{bien.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locataire">Nom du Locataire</Label>
                  <Input
                    id="locataire"
                    value={formData.locataire}
                    onChange={(e) => setFormData({ ...formData, locataire: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.locatairePhone}
                      onChange={(e) => setFormData({ ...formData, locatairePhone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.locataireEmail}
                      onChange={(e) => setFormData({ ...formData, locataireEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRent">Loyer mensuel (DT)</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingLocation ? 'Mettre à jour' : 'Créer le contrat'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">Chargement...</div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Contrats Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {locations.filter(l => l.status === 'active').length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Revenus Mensuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRevenue.toLocaleString()} DT</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Contrats Expirés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {locations.filter(l => l.status === 'expired').length}
                  </div>
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
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="expired">Expiré</SelectItem>
                      <SelectItem value="terminated">Résilié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card>
              <CardHeader>
                <CardTitle>Contrats de Location ({filteredLocations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bien</TableHead>
                      <TableHead>Locataire</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Durée Restante</TableHead>
                      <TableHead>Loyer</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLocations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell className="font-medium">{location.bienName}</TableCell>
                        <TableCell>
                          <div>
                            <p>{location.locataire}</p>
                            <p className="text-sm text-muted-foreground">{location.locatairePhone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {location.startDate} - {location.endDate}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{calculateRemainingTime(location.endDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{location.monthlyRent} DT/mois</TableCell>
                        <TableCell>
                          <Badge className={statusColors[location.status]}>
                            {statusLabels[location.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(location)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(location.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
}
