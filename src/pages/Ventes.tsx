import { useState } from 'react';
import { Plus, Search, Edit, Trash2, ShoppingCart } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { mockVentes, mockBiens } from '@/data/mockData';
import { Vente } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Ventes() {
  const [ventes, setVentes] = useState<Vente[]>(mockVentes);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVente, setEditingVente] = useState<Vente | null>(null);
  const { toast } = useToast();

  const availableBiens = mockBiens.filter(b => b.status === 'disponible');

  const [formData, setFormData] = useState({
    bienId: '',
    buyerName: '',
    buyerPhone: '',
    buyerEmail: '',
    salePrice: '',
    saleDate: '',
  });

  const filteredVentes = ventes.filter(vente =>
    vente.bienName.toLowerCase().includes(search.toLowerCase()) ||
    vente.buyerName.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      bienId: '',
      buyerName: '',
      buyerPhone: '',
      buyerEmail: '',
      salePrice: '',
      saleDate: '',
    });
    setEditingVente(null);
  };

  const handleOpenDialog = (vente?: Vente) => {
    if (vente) {
      setEditingVente(vente);
      setFormData({
        bienId: vente.bienId,
        buyerName: vente.buyerName,
        buyerPhone: vente.buyerPhone,
        buyerEmail: vente.buyerEmail,
        salePrice: vente.salePrice.toString(),
        saleDate: vente.saleDate,
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedBien = mockBiens.find(b => b.id === formData.bienId);
    
    if (editingVente) {
      setVentes(ventes.map(v => 
        v.id === editingVente.id 
          ? { ...v, ...formData, bienName: selectedBien?.name || '', salePrice: parseFloat(formData.salePrice) }
          : v
      ));
      toast({ title: 'Vente modifiée', description: 'La vente a été mise à jour avec succès' });
    } else {
      const newVente: Vente = {
        id: Date.now().toString(),
        ...formData,
        bienName: selectedBien?.name || '',
        salePrice: parseFloat(formData.salePrice),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setVentes([...ventes, newVente]);
      toast({ title: 'Vente enregistrée', description: 'La nouvelle vente a été enregistrée' });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    setVentes(ventes.filter(v => v.id !== id));
    toast({ title: 'Vente supprimée', description: 'La vente a été supprimée avec succès' });
  };

  const totalVentes = ventes.reduce((sum, v) => sum + v.salePrice, 0);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Ventes</h1>
            <p className="text-muted-foreground">Gérez les ventes de biens municipaux</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Vente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingVente ? 'Modifier la Vente' : 'Enregistrer une Vente'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Bien à vendre</Label>
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
                  <Label htmlFor="buyerName">Nom de l'Acheteur</Label>
                  <Input
                    id="buyerName"
                    value={formData.buyerName}
                    onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyerPhone">Téléphone</Label>
                    <Input
                      id="buyerPhone"
                      value={formData.buyerPhone}
                      onChange={(e) => setFormData({ ...formData, buyerPhone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyerEmail">Email</Label>
                    <Input
                      id="buyerEmail"
                      type="email"
                      value={formData.buyerEmail}
                      onChange={(e) => setFormData({ ...formData, buyerEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Prix de Vente (DT)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="saleDate">Date de Vente</Label>
                    <Input
                      id="saleDate"
                      type="date"
                      value={formData.saleDate}
                      onChange={(e) => setFormData({ ...formData, saleDate: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingVente ? 'Mettre à jour' : 'Enregistrer la vente'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Nombre de Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ventes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total des Ventes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVentes.toLocaleString()} DT</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par bien ou acheteur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des Ventes ({filteredVentes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bien</TableHead>
                  <TableHead>Acheteur</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVentes.map((vente) => (
                  <TableRow key={vente.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <ShoppingCart className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{vente.bienName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{vente.buyerName}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{vente.buyerPhone}</p>
                        <p className="text-sm text-muted-foreground">{vente.buyerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{vente.salePrice.toLocaleString()} DT</TableCell>
                    <TableCell>{vente.saleDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(vente)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(vente.id)}>
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
      </div>
    </MainLayout>
  );
}
