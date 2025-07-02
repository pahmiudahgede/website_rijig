"use client";

import { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin, Calendar, Scale, User, Eye, Heart, Share2, ChevronDown, Grid3X3, List, Trash2, Package, Recycle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Types
interface WasteItem {
  id: string;
  title: string;
  category: string;
  weight: number;
  price?: number;
  location: string;
  condition: string;
  collectionDate: string;
  collector: string;
  images: string[];
  description: string;
  source: string;
  isContaminated: boolean;
  needsSorting: boolean;
  status: 'available' | 'processing' | 'sold' | 'disposed';
}

// Constants
const WASTE_CATEGORIES = [
  { value: 'all', label: 'Semua Kategori', icon: Package, count: 156 },
  { value: 'organic', label: 'Organik', icon: Recycle, count: 45, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'plastic', label: 'Plastik', icon: Package, count: 38, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  { value: 'paper', label: 'Kertas', icon: Package, count: 29, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'metal', label: 'Logam', icon: Package, count: 22, color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'glass', label: 'Kaca', icon: Package, count: 15, color: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { value: 'electronic', label: 'Elektronik', icon: Package, count: 7, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' },
];

const CONDITIONS = [
  { value: 'excellent', label: 'Sangat Baik', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { value: 'good', label: 'Baik', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  { value: 'fair', label: 'Cukup', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { value: 'poor', label: 'Buruk', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
];

const STATUS_CONFIG = {
  available: { label: 'Tersedia', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  processing: { label: 'Diproses', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  sold: { label: 'Terjual', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  disposed: { label: 'Dibuang', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

// Mock Data
const mockWasteData: WasteItem[] = [
  {
    id: '1',
    title: 'Botol Plastik PET 500ml',
    category: 'plastic',
    weight: 2.5,
    price: 3000,
    location: 'Jakarta Selatan',
    condition: 'excellent',
    collectionDate: '2025-06-25',
    collector: 'Ahmad Wijaya',
    images: ['https://images.unsplash.com/photo-1572879437644-f67f8d2b2d1c?w=400'],
    description: 'Botol plastik PET dalam kondisi bersih, sudah dicuci dan siap untuk didaur ulang.',
    source: 'Rumah tangga',
    isContaminated: false,
    needsSorting: false,
    status: 'available',
  },
  {
    id: '2',
    title: 'Kertas Koran Bekas',
    category: 'paper',
    weight: 5.0,
    price: 2000,
    location: 'Jakarta Pusat',
    condition: 'good',
    collectionDate: '2025-06-24',
    collector: 'Siti Nurhaliza',
    images: ['https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400'],
    description: 'Kumpulan koran bekas dalam kondisi kering dan rapi.',
    source: 'Perkantoran',
    isContaminated: false,
    needsSorting: true,
    status: 'available',
  },
  {
    id: '3',
    title: 'Kaleng Aluminium',
    category: 'metal',
    weight: 1.2,
    price: 8000,
    location: 'Jakarta Barat',
    condition: 'excellent',
    collectionDate: '2025-06-26',
    collector: 'Budi Santoso',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'],
    description: 'Kaleng aluminium bekas minuman dalam kondisi bersih.',
    source: 'Rumah tangga',
    isContaminated: false,
    needsSorting: false,
    status: 'processing',
  },
  {
    id: '4',
    title: 'Sampah Organik Sisa Makanan',
    category: 'organic',
    weight: 3.8,
    location: 'Jakarta Timur',
    condition: 'fair',
    collectionDate: '2025-06-26',
    collector: 'Rina Kartika',
    images: ['https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'],
    description: 'Sisa makanan organik untuk kompos.',
    source: 'Restoran',
    isContaminated: false,
    needsSorting: true,
    status: 'available',
  },
  {
    id: '5',
    title: 'Botol Kaca Bekas',
    category: 'glass',
    weight: 4.2,
    price: 1500,
    location: 'Jakarta Utara',
    condition: 'good',
    collectionDate: '2025-06-25',
    collector: 'Joko Susilo',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
    description: 'Botol kaca berbagai ukuran dalam kondisi utuh.',
    source: 'Rumah tangga',
    isContaminated: false,
    needsSorting: false,
    status: 'available',
  },
  {
    id: '6',
    title: 'Elektronik Bekas HP',
    category: 'electronic',
    weight: 0.8,
    price: 50000,
    location: 'Jakarta Selatan',
    condition: 'poor',
    collectionDate: '2025-06-23',
    collector: 'Ahmad Wijaya',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
    description: 'Handphone bekas untuk daur ulang komponen.',
    source: 'Rumah tangga',
    isContaminated: false,
    needsSorting: true,
    status: 'sold',
  },
];

// Components
interface WasteCardProps {
  item: WasteItem;
  viewMode: 'grid' | 'list';
}

function WasteCard({ item, viewMode }: WasteCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const statusConfig = STATUS_CONFIG[item.status];
  const conditionConfig = CONDITIONS.find(c => c.value === item.condition);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-shrink-0 w-full sm:w-24 lg:w-32">
              <img
                src={item.images[0]}
                alt={item.title}
                className="w-full h-48 sm:h-24 lg:h-32 object-cover rounded-lg"
              />
              <Badge 
                variant="secondary" 
                className={cn("absolute top-2 left-2 text-xs", statusConfig.color)}
              >
                {statusConfig.label}
              </Badge>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.price && (
                    <Badge variant="outline" className="text-green-600 border-green-600 text-xs lg:text-sm">
                      Rp {item.price.toLocaleString()}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorited(!isFavorited)}
                    className="h-8 w-8 p-0"
                  >
                    <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 mt-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Scale className="h-4 w-4" />
                  <span>{item.weight} kg</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate max-w-32 lg:max-w-none">{item.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(item.collectionDate), 'dd/MM/yyyy')}</span>
                </div>
                <Badge 
                  variant="secondary" 
                  className={cn("text-xs", conditionConfig?.color)}
                >
                  {conditionConfig?.label}
                </Badge>
              </div>

              <div className="flex gap-2 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{item.title}</DialogTitle>
                      <DialogDescription>
                        Detail informasi sampah yang tersedia
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Berat:</span> {item.weight} kg
                        </div>
                        <div>
                          <span className="font-medium">Lokasi:</span> {item.location}
                        </div>
                        <div>
                          <span className="font-medium">Sumber:</span> {item.source}
                        </div>
                        <div>
                          <span className="font-medium">Petugas:</span> {item.collector}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button size="sm" className="flex-1 sm:flex-none">
                  <Share2 className="h-4 w-4 mr-1" />
                  Bagikan
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 h-full flex flex-col">
      <div className="relative">
        <img
          src={item.images[0]}
          alt={item.title}
          className="w-full h-48 sm:h-52 lg:h-56 object-cover rounded-t-lg"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge 
            variant="secondary" 
            className={cn("text-xs", statusConfig.color)}
          >
            {statusConfig.label}
          </Badge>
          {conditionConfig && (
            <Badge 
              variant="secondary" 
              className={cn("text-xs", conditionConfig.color)}
            >
              {conditionConfig.label}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-3 right-3 h-8 w-8 p-0 bg-white/80 hover:bg-white shadow-sm"
        >
          <Heart className={cn("h-4 w-4", isFavorited && "fill-red-500 text-red-500")} />
        </Button>
      </div>
      
      <CardContent className="p-4 lg:p-5 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <h3 className="font-semibold text-base lg:text-lg line-clamp-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.description}
            </p>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Scale className="h-4 w-4" />
              <span>{item.weight} kg</span>
            </div>
            {item.price && (
              <Badge variant="outline" className="text-green-600 border-green-600 text-xs">
                Rp {item.price.toLocaleString()}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1 min-w-0 flex-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <span className="flex-shrink-0 ml-2">{format(new Date(item.collectionDate), 'dd/MM')}</span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Eye className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Detail</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{item.title}</DialogTitle>
                <DialogDescription>
                  Detail informasi sampah yang tersedia
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Berat:</span> {item.weight} kg
                  </div>
                  <div>
                    <span className="font-medium">Lokasi:</span> {item.location}
                  </div>
                  <div>
                    <span className="font-medium">Sumber:</span> {item.source}
                  </div>
                  <div>
                    <span className="font-medium">Petugas:</span> {item.collector}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm" className="flex-1">
            <Share2 className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Bagikan</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface FilterSidebarProps {
  selectedCategories: string[];
  selectedConditions: string[];
  selectedStatuses: string[];
  onCategoryChange: (categories: string[]) => void;
  onConditionChange: (conditions: string[]) => void;
  onStatusChange: (statuses: string[]) => void;
}

function FilterSidebar({
  selectedCategories,
  selectedConditions,
  selectedStatuses,
  onCategoryChange,
  onConditionChange,
  onStatusChange,
}: FilterSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-base mb-3">Kategori</h3>
        <div className="space-y-3">
          {WASTE_CATEGORIES.filter(cat => cat.value !== 'all').map((category) => (
            <div key={category.value} className="flex items-center space-x-3">
              <Checkbox
                id={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onCategoryChange([...selectedCategories, category.value]);
                  } else {
                    onCategoryChange(selectedCategories.filter(c => c !== category.value));
                  }
                }}
              />
              <Label htmlFor={category.value} className="flex items-center justify-between flex-1 cursor-pointer">
                <span className="text-sm">{category.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Conditions */}
      <div>
        <h3 className="font-semibold text-base mb-3">Kondisi</h3>
        <div className="space-y-3">
          {CONDITIONS.map((condition) => (
            <div key={condition.value} className="flex items-center space-x-3">
              <Checkbox
                id={condition.value}
                checked={selectedConditions.includes(condition.value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onConditionChange([...selectedConditions, condition.value]);
                  } else {
                    onConditionChange(selectedConditions.filter(c => c !== condition.value));
                  }
                }}
              />
              <Label htmlFor={condition.value} className="flex items-center space-x-2 cursor-pointer">
                <Badge variant="secondary" className={cn("text-xs", condition.color)}>
                  {condition.label}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Status */}
      <div>
        <h3 className="font-semibold text-base mb-3">Status</h3>
        <div className="space-y-3">
          {Object.entries(STATUS_CONFIG).map(([value, config]) => (
            <div key={value} className="flex items-center space-x-3">
              <Checkbox
                id={value}
                checked={selectedStatuses.includes(value)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onStatusChange([...selectedStatuses, value]);
                  } else {
                    onStatusChange(selectedStatuses.filter(s => s !== value));
                  }
                }}
              />
              <Label htmlFor={value} className="flex items-center space-x-2 cursor-pointer">
                <Badge variant="secondary" className={cn("text-xs", config.color)}>
                  {config.label}
                </Badge>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WasteExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    let result = mockWasteData;

    // Search filter
    if (searchQuery) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory);
    }

    // Advanced filters
    if (selectedCategories.length > 0) {
      result = result.filter(item => selectedCategories.includes(item.category));
    }

    if (selectedConditions.length > 0) {
      result = result.filter(item => selectedConditions.includes(item.condition));
    }

    if (selectedStatuses.length > 0) {
      result = result.filter(item => selectedStatuses.includes(item.status));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.collectionDate).getTime() - new Date(a.collectionDate).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.collectionDate).getTime() - new Date(b.collectionDate).getTime());
        break;
      case 'weight-high':
        result.sort((a, b) => b.weight - a.weight);
        break;
      case 'weight-low':
        result.sort((a, b) => a.weight - b.weight);
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
    }

    return result;
  }, [searchQuery, activeCategory, selectedCategories, selectedConditions, selectedStatuses, sortBy]);

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedStatuses([]);
    setSearchQuery('');
  };

  const hasActiveFilters = activeCategory !== 'all' || selectedCategories.length > 0 || 
                          selectedConditions.length > 0 || selectedStatuses.length > 0 || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Explore Sampah
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Temukan dan jelajahi berbagai jenis sampah yang tersedia
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan nama, deskripsi, atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base"
              />
            </div>

            {/* Category Tabs */}
            <div className="w-full">
              <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                <TabsList className="h-12 p-1 bg-gray-100 dark:bg-gray-800 w-full justify-start overflow-x-auto">
                  {WASTE_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <TabsTrigger
                        key={category.value}
                        value={category.value}
                        className="flex items-center gap-2 px-4 py-2 whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-100"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{category.label}</span>
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {category.count}
                        </Badge>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden xl:block w-80 flex-shrink-0">
            <Card className="sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Filter</CardTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-xs"
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <FilterSidebar
                  selectedCategories={selectedCategories}
                  selectedConditions={selectedConditions}
                  selectedStatuses={selectedStatuses}
                  onCategoryChange={setSelectedCategories}
                  onConditionChange={setSelectedConditions}
                  onStatusChange={setSelectedStatuses}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="xl:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filter Sampah</SheetTitle>
                      <SheetDescription>
                        Gunakan filter untuk menemukan sampah yang sesuai
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterSidebar
                        selectedCategories={selectedCategories}
                        selectedConditions={selectedConditions}
                        selectedStatuses={selectedStatuses}
                        onCategoryChange={setSelectedCategories}
                        onConditionChange={setSelectedConditions}
                        onStatusChange={setSelectedStatuses}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="text-sm text-muted-foreground">
                  {filteredData.length} sampah ditemukan
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44 sm:w-48">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Terbaru</SelectItem>
                    <SelectItem value="oldest">Terlama</SelectItem>
                    <SelectItem value="weight-high">Berat Terberat</SelectItem>
                    <SelectItem value="weight-low">Berat Teringan</SelectItem>
                    <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                    <SelectItem value="price-low">Harga Terendah</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {filteredData.length === 0 ? (
              <Card className="p-12 text-center">
                <Trash2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Tidak ada sampah ditemukan
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Coba ubah filter atau kata kunci pencarian Anda
                </p>
                {hasActiveFilters && (
                  <Button onClick={clearAllFilters} variant="outline">
                    Reset Filter
                  </Button>
                )}
              </Card>
            ) : (
              <div className={cn(
                "grid gap-4 sm:gap-6",
                viewMode === 'grid' 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-" 
                  : "grid-cols-1"
              )}>
                {filteredData.map((item) => (
                  <WasteCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}