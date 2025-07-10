import React, { useEffect, useState } from 'react';
import { AuthProvider } from './AuthProvider';
import { useAuth } from './useAuth';
import { db } from './firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box } from '@mui/material';

interface Waybill {
  id: string;
  waybillNumber: string;
  date: string;
  sellerTin: string;
  buyerTin: string;
  status: string;
  vat: string;
  product: string;
  barcode: string;
}
type WaybillForm = Omit<Waybill, 'id'>;

const columns: GridColDef[] = [
  { field: 'waybillNumber', headerName: 'Waybill #', width: 120 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'sellerTin', headerName: 'Seller TIN', width: 120 },
  { field: 'buyerTin', headerName: 'Buyer TIN', width: 120 },
  { field: 'status', headerName: 'Status', width: 100 },
  { field: 'vat', headerName: 'VAT', width: 80 },
  { field: 'product', headerName: 'Product', width: 120 },
  { field: 'barcode', headerName: 'Barcode', width: 120 },
];

function WaybillTable() {
  const [rows, setRows] = useState<Waybill[]>([]);
  const [filters, setFilters] = useState({
    dateStart: '',
    dateEnd: '',
    sellerTin: '',
    buyerTin: '',
    status: '',
    vat: '',
    product: '',
    barcode: '',
  });

  useEffect(() => {
    async function fetchWaybills() {
      const q = query(collection(db, 'waybills'));
      // TODO: Add where clauses for filters
      const snapshot = await getDocs(q);
      setRows(snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Waybill, 'id'>) })));
    }
    fetchWaybills();
  }, [filters]);

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField label="Date Start" type="date" size="small" InputLabelProps={{ shrink: true }} value={filters.dateStart} onChange={e => setFilters(f => ({ ...f, dateStart: e.target.value }))} />
        <TextField label="Date End" type="date" size="small" InputLabelProps={{ shrink: true }} value={filters.dateEnd} onChange={e => setFilters(f => ({ ...f, dateEnd: e.target.value }))} />
        <TextField label="Seller TIN" size="small" value={filters.sellerTin} onChange={e => setFilters(f => ({ ...f, sellerTin: e.target.value }))} />
        <TextField label="Buyer TIN" size="small" value={filters.buyerTin} onChange={e => setFilters(f => ({ ...f, buyerTin: e.target.value }))} />
        <TextField label="Status" size="small" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} />
        <TextField label="VAT" size="small" value={filters.vat} onChange={e => setFilters(f => ({ ...f, vat: e.target.value }))} />
        <TextField label="Product" size="small" value={filters.product} onChange={e => setFilters(f => ({ ...f, product: e.target.value }))} />
        <TextField label="Barcode" size="small" value={filters.barcode} onChange={e => setFilters(f => ({ ...f, barcode: e.target.value }))} />
      </Box>
      <DataGrid autoHeight rows={rows} columns={columns} pageSizeOptions={[10]} />
    </Box>
  );
}

function NewWaybillDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form, setForm] = useState<WaybillForm>({
    waybillNumber: '',
    date: '',
    sellerTin: '',
    buyerTin: '',
    status: '',
    vat: '',
    product: '',
    barcode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Call the saveWaybill callable function
      const response = await fetch('/saveWaybill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('Failed to save waybill');
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Waybill</DialogTitle>
      <DialogContent>
        {Object.keys(form).map(key => (
          <TextField
            key={key}
            margin="dense"
            label={key}
            name={key}
            value={form[key as keyof WaybillForm]}
            onChange={handleChange}
            fullWidth
          />
        ))}
        {error && <Box color="red">{error}</Box>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={loading} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

function MainPage() {
  const { user, signInWithGoogle, signOutUser } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user) {
    return <Button onClick={signInWithGoogle}>Sign in with Google</Button>;
  }

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <div>Welcome, {user.email}</div>
        <Button onClick={signOutUser}>Sign Out</Button>
      </Box>
      <Button variant="contained" onClick={() => setDialogOpen(true)} sx={{ mb: 2 }}>New Waybill</Button>
      <WaybillTable />
      <NewWaybillDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </Box>
  );
}

const App: React.FC = () => (
  <AuthProvider>
    <MainPage />
  </AuthProvider>
);

export default App;
