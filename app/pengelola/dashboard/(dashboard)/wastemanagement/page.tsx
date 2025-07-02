"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarDays, Camera, MapPin, Scale, Trash2, Plus, Save, X, Clock, User, AlertCircle, BarChart3 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Form Schema - Fixed default values
const wasteInputSchema = z.object({
  wasteType: z.string().min(1, 'Jenis sampah harus dipilih'),
  category: z.string().min(1, 'Kategori harus dipilih'),
  weight: z.coerce.number().min(0.1, 'Berat minimal 0.1 kg'),
  volume: z.coerce.number().optional().nullable(),
  source: z.string().min(1, 'Sumber sampah harus diisi'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  collectionDate: z.date(),
  collectionTime: z.string().min(1, 'Waktu pengumpulan harus diisi'),
  condition: z.string().min(1, 'Kondisi sampah harus dipilih'),
  price: z.coerce.number().optional().nullable(),
  collector: z.string().min(1, 'Petugas pengumpul harus diisi'),
  notes: z.string().optional(),
  photos: z.array(z.string()).optional(),
  isContaminated: z.boolean(),
  needsSorting: z.boolean(),
});

type WasteInputForm = z.infer<typeof wasteInputSchema>;

// Constants
const WASTE_CATEGORIES = [
  { value: 'organic', label: 'Organik', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'plastic', label: 'Plastik', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'paper', label: 'Kertas', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'metal', label: 'Logam', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'glass', label: 'Kaca', color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { value: 'electronic', label: 'Elektronik', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
  { value: 'hazardous', label: 'B3 (Berbahaya)', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  { value: 'mixed', label: 'Campuran', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
];

const WASTE_CONDITIONS = [
  { value: 'excellent', label: 'Sangat Baik', description: 'Bersih, tidak terkontaminasi' },
  { value: 'good', label: 'Baik', description: 'Sedikit kotor, mudah dibersihkan' },
  { value: 'fair', label: 'Cukup', description: 'Kotor sedang, perlu pembersihan' },
  { value: 'poor', label: 'Buruk', description: 'Sangat kotor, sulit dibersihkan' },
];

const COLLECTORS = [
  'Ahmad Wijaya',
  'Siti Nurhaliza',
  'Budi Santoso',
  'Rina Kartika',
  'Joko Susilo',
];

interface PhotoPreviewProps {
  photos: string[];
  onRemove: (index: number) => void;
}

function PhotoPreview({ photos, onRemove }: PhotoPreviewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
      {photos.map((photo, index) => (
        <div key={index} className="relative group">
          <img
            src={photo}
            alt={`Foto sampah ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onRemove(index)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
}

interface QuickStatsProps {
  totalWeight: number;
  todayEntries: number;
  averageWeight: number;
}

function QuickStats({ totalWeight, todayEntries, averageWeight }: QuickStatsProps) {
  const stats = [
    { label: 'Total Hari Ini', value: `${totalWeight} kg`, icon: Scale },
    { label: 'Jumlah Entry', value: todayEntries.toString(), icon: Trash2 },
    { label: 'Rata-rata Berat', value: `${averageWeight} kg`, icon: BarChart3 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <IconComponent className="h-8 w-8 text-green-600 dark:text-green-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function WasteInputForm() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const form = useForm<WasteInputForm>({
    resolver: zodResolver(wasteInputSchema),
    defaultValues: {
      collectionDate: new Date(),
      collectionTime: format(new Date(), 'HH:mm'),
      condition: 'good',
      isContaminated: false,
      needsSorting: false,
      wasteType: '',
      category: '',
      weight: 0,
      source: '',
      location: '',
      collector: '',
      notes: '',
      photos: [],
    },
  });

  const onSubmit = async (data: WasteInputForm) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Form submitted:', { ...data, photos });
      
      // Reset form after successful submission
      form.reset();
      setPhotos([]);
      
      // Show success message or redirect
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoAdd = () => {
    // In real implementation, this would open camera or file picker
    const mockPhoto = `https://via.placeholder.com/200x150?text=Photo+${photos.length + 1}`;
    setPhotos(prev => [...prev, mockPhoto]);
  };

  const handlePhotoRemove = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  // Mock data for stats
  const quickStatsData = {
    totalWeight: 245.5,
    todayEntries: 12,
    averageWeight: 20.4,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Input Sampah Masuk
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Pencatatan sampah yang masuk ke fasilitas
            </p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Clock className="w-3 h-3 mr-1" />
            {format(new Date(), 'dd/MM/yyyy HH:mm')}
          </Badge>
        </div>

        {/* Quick Stats */}
        <QuickStats {...quickStatsData} />

        {/* Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Pastikan data yang diinput akurat dan lengkap. Data ini akan digunakan untuk pelaporan dan analisis.
          </AlertDescription>
        </Alert>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trash2 className="w-5 h-5" />
              <span>Form Input Sampah</span>
            </CardTitle>
            <CardDescription>
              Isi semua informasi yang diperlukan untuk pencatatan sampah masuk
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 lg:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 h-12">
                    <TabsTrigger value="basic">Info Dasar</TabsTrigger>
                    <TabsTrigger value="details">Detail & Kondisi</TabsTrigger>
                    <TabsTrigger value="documentation">Dokumentasi</TabsTrigger>
                  </TabsList>

                  {/* Basic Information Tab */}
                  <TabsContent value="basic" className="space-y-8 mt-6">
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
                                  <SelectValue placeholder="Pilih kategori sampah" />
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

                      {/* Waste Type */}
                      <FormField
                        control={form.control}
                        name="wasteType"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Jenis Sampah Spesifik</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Botol plastik PET" className="h-11" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              Sebutkan jenis sampah secara spesifik
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Weight */}
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
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              {/* Placeholder untuk konsistensi tinggi */}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2: Volume, Sumber, Lokasi */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Volume */}
                      <FormField
                        control={form.control}
                        name="volume"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Volume (m³) - Opsional</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="0.00"
                                className="h-11"
                                {...field}
                                value={field.value || ''}
                                onChange={(e) => field.onChange(e.target.value || null)}
                              />
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              Isi jika diketahui volumenya
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Source */}
                      <FormField
                        control={form.control}
                        name="source"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Sumber Sampah</FormLabel>
                            <FormControl>
                              <Input placeholder="Contoh: Rumah tangga, Perkantoran" className="h-11" {...field} />
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              Asal sampah dikumpulkan
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Location */}
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Lokasi Pengumpulan</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input placeholder="Alamat atau koordinat" className="h-11 pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              Lokasi tempat sampah dikumpulkan
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 3: Tanggal, Waktu, Petugas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Collection Date */}
                      <FormField
                        control={form.control}
                        name="collectionDate"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Tanggal Pengumpulan</FormLabel>
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
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() || date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              {/* Placeholder untuk konsistensi tinggi */}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collection Time */}
                      <FormField
                        control={form.control}
                        name="collectionTime"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Waktu Pengumpulan</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input type="time" className="h-11 pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              {/* Placeholder untuk konsistensi tinggi */}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collector */}
                      <FormField
                        control={form.control}
                        name="collector"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Petugas Pengumpul</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Pilih petugas" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {COLLECTORS.map((collector) => (
                                  <SelectItem key={collector} value={collector}>
                                    <div className="flex items-center space-x-2">
                                      <User className="w-4 h-4" />
                                      <span>{collector}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs text-muted-foreground min-h-[16px]">
                              {/* Placeholder untuk konsistensi tinggi */}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Details Tab */}
                  <TabsContent value="details" className="space-y-8 mt-6">
                    {/* Condition */}
                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem className="space-y-4">
                          <FormLabel className="text-base font-medium">Kondisi Sampah</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                            >
                              {WASTE_CONDITIONS.map((condition) => (
                                <div key={condition.value} className="flex items-start space-x-3">
                                  <RadioGroupItem 
                                    value={condition.value} 
                                    id={condition.value} 
                                    className="mt-1"
                                  />
                                  <Label 
                                    htmlFor={condition.value} 
                                    className="flex-1 cursor-pointer"
                                  >
                                    <div className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                      <div className="font-medium text-sm">{condition.label}</div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {condition.description}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator className="my-8" />

                    {/* Price */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel className="text-sm font-medium">Harga per kg (Rp) - Opsional</FormLabel>
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
                                  value={field.value || ''}
                                  onChange={(e) => field.onChange(e.target.value || null)}
                                />
                              </div>
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground">
                              Isi jika ada harga pembelian sampah
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="isContaminated"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium cursor-pointer">
                                  Sampah Terkontaminasi
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Centang jika sampah tercampur dengan bahan berbahaya atau kotor
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="needsSorting"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-lg">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="mt-1"
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="text-sm font-medium cursor-pointer">
                                  Perlu Penyortiran
                                </FormLabel>
                                <FormDescription className="text-xs">
                                  Centang jika sampah masih perlu disortir lebih lanjut
                                </FormDescription>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium">Catatan Tambahan</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tambahkan catatan atau informasi khusus..."
                              className="resize-none min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs text-muted-foreground">
                            Informasi tambahan yang perlu dicatat
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/* Documentation Tab */}
                  <TabsContent value="documentation" className="space-y-8 mt-6">
                    <div className="text-center py-8">
                      <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Dokumentasi Sampah
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Tambahkan foto sampah untuk dokumentasi dan verifikasi. Minimal 1 foto direkomendasikan.
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePhotoAdd}
                        className="mb-6 h-11"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Tambah Foto
                      </Button>
                    </div>

                    {photos.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">
                            Foto yang Ditambahkan ({photos.length})
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setPhotos([])}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Hapus Semua
                          </Button>
                        </div>
                        <PhotoPreview photos={photos} onRemove={handlePhotoRemove} />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    className="flex-1 h-12"
                  >
                    Preview Data
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-12 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Simpan Data
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Preview Data Sampah</DialogTitle>
              <DialogDescription>
                Periksa kembali data sebelum menyimpan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="text-center py-8 text-gray-500">
                <Trash2 className="w-12 h-12 mx-auto mb-4" />
                <p>Preview data akan ditampilkan di sini</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}