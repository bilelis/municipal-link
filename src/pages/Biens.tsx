import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Building2, TreePine, Store, Map } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { mockBiens } from '@/data/mockData';
import { Bien, BienType, BienStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const typeIcons = {
  cafe: Building2,
  jardin: TreePine,
  local: Store,
  terrain: Map,
};

const typeLabels = {
  cafe: 'Café',
  jardin: 'Jardin d\'Enfants',
  local: 'Local Commercial',
  terrain: 'Terrain',
};

const statusColors = {
  disponible: 'bg-green-100 text-green-800',
  loue: 'bg-blue-100 text-blue-800',
  vendu: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  disponible: 'Disponible',
  loue: 'Loué',
  vendu: 'Vendu',
};

export default function Biens() {
  const [biens, setBiens] = useState<Bien[]>(mockBiens);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBien, setEditingBien] = useState<Bien | null>(null);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'cafe' as BienType,
    status: 'disponible' as BienStatus,
    address: '',
    surface: '',
    description: '',
    monthlyRent: '',
  });

  const filteredBiens = biens.filter(bien => {
    const matchesSearch = bien.name.toLowerCase().includes(search.toLowerCase()) ||
                         bien.address.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || bien.type === filterType;
    const matchesStatus = filterStatus === 'all' || bien.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'cafe',
      status: 'disponible',
      address: '',
      surface: '',
      description: '',
      monthlyRent: '',
    });
    setEditingBien(null);
  };

  const handleOpenDialog = (bien?: Bien) => {
    if (bien) {
      setEditingBien(bien);
      setFormData({
        name: bien.name,
        type: bien.type,
        status: bien.status,
        address: bien.address,
        surface: bien.surface.toString(),
        description: bien.description,
        monthlyRent: bien.monthlyRent?.toString() || '',
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBien) {
      setBiens(biens.map(b => 
        b.id === editingBien.id 
          ? { ...b, ...formData, surface: parseFloat(formData.surface), monthlyRent: parseFloat(formData.monthlyRent) || undefined }
          : b
      ));
      toast({ title: 'Bien modifié', description: 'Le bien a été mis à jour avec succès' });
    } else {
      const newBien: Bien = {
        id: Date.now().toString(),
        ...formData,
        surface: parseFloat(formData.surface),
        monthlyRent: parseFloat(formData.monthlyRent) || undefined,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setBiens([...biens, newBien]);
      toast({ title: 'Bien ajouté', description: 'Le nouveau bien a été créé avec succès' });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setBiens(biens.filter(b => b.id !== id));
    toast({ title: 'Bien supprimé', description: 'Le bien a été supprimé avec succès' });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Biens</h1>
            <p className="text-muted-foreground">Gérez le patrimoine immobilier de la commune</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un Bien
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBien ? 'Modifier le Bien' : 'Nouveau Bien'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du bien</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={formData.type} onValueChange={(v: BienType) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cafe">Café</SelectItem>
                        <SelectItem value="jardin">Jardin d'Enfants</SelectItem>
                        <SelectItem value="local">Local Commercial</SelectItem>
                        <SelectItem value="terrain">Terrain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select value={formData.status} onValueChange={(v: BienStatus) => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="loue">Loué</SelectItem>
                        <SelectItem value="vendu">Vendu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface (m²)</Label>
                    <Input
                      id="surface"
                      type="number"
                      value={formData.surface}
                      onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">Loyer mensuel (DT)</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingBien ? 'Mettre à jour' : 'Créer le bien'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou adresse..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="jardin">Jardin d'Enfants</SelectItem>
                  <SelectItem value="local">Local Commercial</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="disponible">Disponible</SelectItem>
                  <SelectItem value="loue">Loué</SelectItem>
                  <SelectItem value="vendu">Vendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Biens ({filteredBiens.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bien</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Surface</TableHead>
                  <TableHead>Loyer</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBiens.map((bien) => {
                  const Icon = typeIcons[bien.type];
                  return (
                    <TableRow key={bien.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium">{bien.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{typeLabels[bien.type]}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{bien.address}</TableCell>
                      <TableCell>{bien.surface} m²</TableCell>
                      <TableCell>{bien.monthlyRent ? `${bien.monthlyRent} DT` : '-'}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[bien.status]}>
                          {statusLabels[bien.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(bien)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(bien.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
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
