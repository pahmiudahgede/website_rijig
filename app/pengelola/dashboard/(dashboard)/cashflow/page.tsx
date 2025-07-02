"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  User, 
  Package, 
  Plus, 
  Save, 
  Filter, 
  Download, 
  Search,
  Eye,
  Edit,
  Trash2,
  CalendarDays,
  Scale,
  Receipt,
  Banknote,
  PieChart,
  BarChart3,
  FileText,
  Clock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Types
interface Transaction {
  id: string;
  date: string;
  supplierName: string;
  supplierContact: string;
  wasteType: string;
  category: string;
  weight: number;
  pricePerKg: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'paid' | 'pending' | 'partial';
  receiptNumber: string;
  notes?: string;
  createdAt: string;
}

// Form Schema
const transactionSchema = z.object({
  date: z.date(),
  supplierName: z.string().min(1, 'Nama pengepul harus diisi'),
  supplierContact: z.string().min(1, 'Kontak pengepul harus diisi'),
  wasteType: z.string().min(1, 'Jenis sampah harus diisi'),
  category: z.string().min(1, 'Kategori harus dipilih'),
  weight: z.coerce.number().min(0.1, 'Berat minimal 0.1 kg'),
  pricePerKg: z.coerce.number().min(1, 'Harga per kg harus diisi'),
  paymentMethod: z.string().min(1, 'Metode pembayaran harus dipilih'),
  paymentStatus: z.enum(['paid', 'pending', 'partial'], {
    required_error: 'Status pembayaran harus dipilih',
  }),
  receiptNumber: z.string().min(1, 'Nomor nota harus diisi'),
  notes: z.string().optional(),
});

type TransactionForm = z.infer<typeof transactionSchema>;

// Constants
const WASTE_CATEGORIES = [
  { value: 'plastic', label: 'Plastik', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'paper', label: 'Kertas', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'metal', label: 'Logam', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'glass', label: 'Kaca', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { value: 'electronic', label: 'Elektronik', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'organic', label: 'Organik', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Tunai' },
  { value: 'transfer', label: 'Transfer Bank' },
  { value: 'e-wallet', label: 'E-Wallet' },
  { value: 'check', label: 'Cek' },
];

const PAYMENT_STATUS = [
  { value: 'paid', label: 'Sudah Dibayar', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'pending', label: 'Belum Dibayar', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'partial', label: 'Dibayar Sebagian', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
];

// Mock Data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: '2025-06-26',
    supplierName: 'CV Maju Jaya',
    supplierContact: '081234567890',
    wasteType: 'Botol Plastik PET',
    category: 'plastic',
    weight: 150.5,
    pricePerKg: 3500,
    totalAmount: 526750,
    paymentMethod: 'transfer',
    paymentStatus: 'paid',
    receiptNumber: 'INV-2025-001',
    notes: 'Kualitas bagus, sudah dicuci bersih',
    createdAt: '2025-06-26T10:30:00Z',
  },
  {
    id: '2',
    date: '2025-06-25',
    supplierName: 'UD Berkah Sampah',
    supplierContact: '081987654321',
    wasteType: 'Kertas Kardus',
    category: 'paper',
    weight: 200.0,
    pricePerKg: 2000,
    totalAmount: 400000,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    receiptNumber: 'INV-2025-002',
    createdAt: '2025-06-25T14:15:00Z',
  },
  {
    id: '3',
    date: '2025-06-24',
    supplierName: 'Pak Rudi Pengepul',
    supplierContact: '082111222333',
    wasteType: 'Kaleng Aluminium',
    category: 'metal',
    weight: 75.2,
    pricePerKg: 8000,
    totalAmount: 601600,
    paymentMethod: 'e-wallet',
    paymentStatus: 'pending',
    receiptNumber: 'INV-2025-003',
    notes: 'Pembayaran ditunda sampai akhir bulan',
    createdAt: '2025-06-24T09:45:00Z',
  },
];

// Components
interface FinancialSummaryProps {
  transactions: Transaction[];
}

function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const summary = useMemo(() => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    // This month data
    const thisMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= thisMonth
    );
    
    // Last month data  
    const lastMonthTransactions = transactions.filter(t => 
      new Date(t.date) >= lastMonth && new Date(t.date) < thisMonth
    );

    const thisMonthTotal = thisMonthTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const lastMonthTotal = lastMonthTransactions.reduce((sum, t) => sum + t.totalAmount, 0);
    
    const totalWeight = thisMonthTransactions.reduce((sum, t) => sum + t.weight, 0);
    const totalTransactions = thisMonthTransactions.length;
    const pendingAmount = transactions
      .filter(t => t.paymentStatus === 'pending')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const monthlyGrowth = lastMonthTotal > 0 
      ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 
      : 0;

    return {
      thisMonthTotal,
      totalWeight,
      totalTransactions,
      pendingAmount,
      monthlyGrowth,
    };
  }, [transactions]);

  const summaryCards = [
    {
      title: 'Total Pengeluaran Bulan Ini',
      value: `Rp ${summary.thisMonthTotal.toLocaleString()}`,
      icon: DollarSign,
      change: summary.monthlyGrowth,
      changeType: summary.monthlyGrowth >= 0 ? 'increase' : 'decrease',
      description: 'Pengeluaran untuk beli sampah',
    },
    {
      title: 'Total Berat Sampah Dibeli',
      value: `${summary.totalWeight.toFixed(1)} kg`,
      icon: Scale,
      description: 'Volume pembelian bulan ini',
    },
    {
      title: 'Jumlah Transaksi Pembelian',
      value: summary.totalTransactions.toString(),
      icon: Receipt,
      description: 'Transaksi pembelian bulan ini',
    },
    {
      title: 'Tagihan Belum Dibayar',
      value: `Rp ${summary.pendingAmount.toLocaleString()}`,
      icon: Clock,
      description: 'Hutang ke pengepul',
      urgent: summary.pendingAmount > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {summaryCards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className={cn(card.urgent && "border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-900/10")}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold">
                    {card.value}
                  </p>
                  {card.change !== undefined && (
                    <div className={cn(
                      "flex items-center text-sm",
                      card.changeType === 'increase' ? "text-green-600" : "text-red-600"
                    )}>
                      {card.changeType === 'increase' ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(card.change).toFixed(1)}% dari bulan lalu
                      <span className="text-xs text-muted-foreground ml-1">
                        ({card.changeType === 'increase' ? 'Pengeluaran naik' : 'Pengeluaran turun'})
                      </span>
                    </div>
                  )}
                  {card.description && (
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                  )}
                </div>
                <IconComponent className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface TransactionFormProps {
  onSubmit: (data: TransactionForm) => void;
  isSubmitting: boolean;
}

function TransactionForm({ onSubmit, isSubmitting }: TransactionFormProps) {
  const form = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date(),
      supplierName: '',
      supplierContact: '',
      wasteType: '',
      category: '',
      weight: 0,
      pricePerKg: 0,
      paymentMethod: '',
      paymentStatus: 'paid',
      receiptNumber: '',
      notes: '',
    },
  });

  const weight = form.watch('weight');
  const pricePerKg = form.watch('pricePerKg');
  const totalAmount = weight && pricePerKg ? weight * pricePerKg : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Catat Pembelian Sampah Baru
        </CardTitle>
        <CardDescription>
          Input data pembelian sampah dari pengepul
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Date, Supplier Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Tanggal Transaksi</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "h-11 w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy")
                            ) : (
                              <span>Pilih tanggal</span>
                            )}
                            <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("2020-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Nama Pengepul</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama pengepul/supplier" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierContact"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Kontak Pengepul</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor HP/telepon" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Waste Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Kategori Sampah</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {WASTE_CATEGORIES.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={cn("text-xs", category.color)}>
                                {category.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wasteType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Jenis Sampah Spesifik</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Botol plastik PET" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Berat (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0"
                        className="h-11"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="pricePerKg"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Harga per Kg (Rp)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                          Rp
                        </span>
                        <Input 
                          type="number" 
                          placeholder="0"
                          className="h-11 pl-8"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Total Harga Beli</Label>
                <div className="h-11 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-800 flex items-center">
                  <span className="text-lg font-semibold text-red-600">
                    Rp {totalAmount.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Total pengeluaran untuk pembelian ini
                </p>
              </div>

              <FormField
                control={form.control}
                name="receiptNumber"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Nomor Nota/Invoice</FormLabel>
                    <FormControl>
                      <Input placeholder="INV-2025-001" className="h-11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: Payment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Metode Pembayaran</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih metode pembayaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_METHODS.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-medium">Status Pembayaran</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Pilih status pembayaran" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_STATUS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className={cn("text-xs", status.color)}>
                                {status.label}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-medium">Catatan (Opsional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Catatan tambahan tentang transaksi..."
                      className="resize-none min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                className="flex-1"
              >
                Reset Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Transaksi
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

interface TransactionTableProps {
  transactions: Transaction[];
}

function TransactionTable({ transactions }: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (searchQuery) {
      result = result.filter(t =>
        t.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.wasteType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(t => t.paymentStatus === filterStatus);
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchQuery, filterStatus]);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Riwayat Pembelian Sampah</CardTitle>
            <CardDescription>Daftar semua transaksi pembelian sampah dari pengepul</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Laporan
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan pengepul, jenis sampah, atau nomor nota..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {PAYMENT_STATUS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Pengepul</TableHead>
                <TableHead>Jenis Sampah</TableHead>
                <TableHead className="text-right">Berat</TableHead>
                <TableHead className="text-right">Harga Beli/kg</TableHead>
                <TableHead className="text-right">Total Pengeluaran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Receipt className="h-8 w-8 text-gray-400" />
                      <p className="text-gray-500">Tidak ada data pembelian ditemukan</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => {
                  const categoryConfig = WASTE_CATEGORIES.find(c => c.value === transaction.category);
                  const statusConfig = PAYMENT_STATUS.find(s => s.value === transaction.paymentStatus);
                  
                  return (
                    <TableRow key={transaction.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(transaction.date), 'dd/MM/yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {transaction.receiptNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{transaction.supplierName}</span>
                          <span className="text-xs text-muted-foreground">
                            {transaction.supplierContact}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">{transaction.wasteType}</span>
                          {categoryConfig && (
                            <Badge variant="secondary" className={cn("text-xs w-fit", categoryConfig.color)}>
                              {categoryConfig.label}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {transaction.weight} kg
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {transaction.pricePerKg.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        Rp {transaction.totalAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {statusConfig && (
                          <Badge variant="secondary" className={cn("text-xs", statusConfig.color)}>
                            {statusConfig.label}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detail Pembelian Sampah</DialogTitle>
                                <DialogDescription>
                                  Informasi lengkap pembelian {transaction.receiptNumber}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Tanggal</Label>
                                    <p className="text-sm">{format(new Date(transaction.date), 'dd MMMM yyyy')}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Nomor Nota</Label>
                                    <p className="text-sm">{transaction.receiptNumber}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Pengepul</Label>
                                    <p className="text-sm">{transaction.supplierName}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Kontak</Label>
                                    <p className="text-sm">{transaction.supplierContact}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Jenis Sampah</Label>
                                    <p className="text-sm">{transaction.wasteType}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Kategori</Label>
                                    <p className="text-sm">{categoryConfig?.label}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Berat</Label>
                                    <p className="text-sm">{transaction.weight} kg</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Harga Beli per kg</Label>
                                    <p className="text-sm">Rp {transaction.pricePerKg.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Total Pengeluaran</Label>
                                    <p className="text-lg font-semibold text-red-600">
                                      Rp {transaction.totalAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Metode Pembayaran</Label>
                                    <p className="text-sm">{PAYMENT_METHODS.find(m => m.value === transaction.paymentMethod)?.label}</p>
                                  </div>
                                </div>
                                {transaction.notes && (
                                  <div>
                                    <Label className="text-sm font-medium">Catatan</Label>
                                    <p className="text-sm text-muted-foreground mt-1">{transaction.notes}</p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination would go here */}
        <div className="mt-4 text-sm text-muted-foreground">
          Menampilkan {filteredTransactions.length} dari {transactions.length} pembelian
        </div>
      </CardContent>
    </Card>
  );
}

export default function FinancialRecordsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const handleSubmit = async (data: TransactionForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        ...data,
        date: format(data.date, 'yyyy-MM-dd'),
        totalAmount: data.weight * data.pricePerKg,
        createdAt: new Date().toISOString(),
      };

      setTransactions(prev => [newTransaction, ...prev]);
      console.log('Transaction submitted:', newTransaction);
      
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 lg:p-6">
      <div className="w-full max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Pencatatan Keuangan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Kelola dan pantau pengeluaran untuk pembelian sampah dari pengepul
          </p>
        </div>

        {/* Financial Summary */}
        <FinancialSummary transactions={transactions} />

        {/* Main Content */}
        <Tabs defaultValue="new-transaction" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="new-transaction" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Pembelian Baru
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Riwayat Pembelian
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new-transaction" className="mt-6">
            <TransactionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <TransactionTable transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}