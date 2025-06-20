"use client"

import React, { useState, useRef } from 'react'

// Types
interface WasteType {
  id: number
  nama: string
  kategori: string
  harga_per_kg: number
  deskripsi: string
  icon: string
  status: 'Aktif' | 'Nonaktif'
  created_at: string
  updated_at: string
}

interface FormData {
  nama: string
  kategori: string
  harga_per_kg: string
  deskripsi: string
  status: 'Aktif' | 'Nonaktif'
}
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Eye,
  Filter,
  Download,
  RefreshCw
} from "lucide-react"

// Mock data untuk demo
const initialWasteTypes: WasteType[] = [
  {
    id: 1,
    nama: "Botol Plastik",
    kategori: "Anorganik",
    harga_per_kg: 3000,
    deskripsi: "Botol plastik bekas minuman, kondisi bersih",
    icon: "🍼",
    status: "Aktif",
    created_at: "2024-01-15",
    updated_at: "2024-01-15"
  },
  {
    id: 2,
    nama: "Kertas Kardus",
    kategori: "Anorganik",
    harga_per_kg: 2500,
    deskripsi: "Kardus bekas kemasan, kondisi kering",
    icon: "📦",
    status: "Aktif",
    created_at: "2024-01-16",
    updated_at: "2024-01-16"
  },
  {
    id: 3,
    nama: "Kaleng Aluminium",
    kategori: "Logam",
    harga_per_kg: 15000,
    deskripsi: "Kaleng minuman aluminium, bersih dari label",
    icon: "🥫",
    status: "Aktif",
    created_at: "2024-01-17",
    updated_at: "2024-01-17"
  },
  {
    id: 4,
    nama: "Sisa Makanan",
    kategori: "Organik",
    harga_per_kg: 500,
    deskripsi: "Sampah organik untuk kompos",
    icon: "🍃",
    status: "Nonaktif",
    created_at: "2024-01-18",
    updated_at: "2024-01-18"
  }
]

const kategoriOptions = [
  "Organik",
  "Anorganik", 
  "Logam",
  "Elektronik",
  "B3 (Bahan Berbahaya Beracun)",
  "Tekstil"
]

export default function DataSampahPage() {
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>(initialWasteTypes)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [selectedWasteType, setSelectedWasteType] = useState<WasteType | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filterKategori, setFilterKategori] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [uploadedIcon, setUploadedIcon] = useState<File | null>(null)
  const [previewIcon, setPreviewIcon] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    nama: "",
    kategori: "",
    harga_per_kg: "",
    deskripsi: "",
    status: "Aktif"
  })

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB')
        return
      }

      setUploadedIcon(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewIcon(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      nama: "",
      kategori: "",
      harga_per_kg: "",
      deskripsi: "",
      status: "Aktif"
    })
    setUploadedIcon(null)
    setPreviewIcon(null)
    setSelectedWasteType(null)
  }

  // Handle add new waste type
  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  // Handle edit waste type
  const handleEdit = (wasteType: WasteType) => {
    setSelectedWasteType(wasteType)
    setFormData({
      nama: wasteType.nama,
      kategori: wasteType.kategori,
      harga_per_kg: wasteType.harga_per_kg.toString(),
      deskripsi: wasteType.deskripsi,
      status: wasteType.status
    })
    setPreviewIcon(wasteType.icon)
    setIsDialogOpen(true)
  }

  // Handle save (add or update)
  const handleSave = () => {
    // Validation
    if (!formData.nama || !formData.kategori || !formData.harga_per_kg) {
      alert('Nama, kategori, dan harga harus diisi')
      return
    }

    const newWasteType: Partial<WasteType> = {
      ...formData,
      harga_per_kg: parseInt(formData.harga_per_kg),
      icon: previewIcon || "📦",
      updated_at: new Date().toISOString().split('T')[0]
    }

    if (selectedWasteType) {
      // Update existing
      setWasteTypes(prev => prev.map(item => 
        item.id === selectedWasteType.id 
          ? { ...item, ...newWasteType }
          : item
      ))
    } else {
      // Add new
      const newItem: WasteType = {
        ...newWasteType,
        id: Math.max(...wasteTypes.map((item: WasteType) => item.id)) + 1,
        created_at: new Date().toISOString().split('T')[0]
      } as WasteType

      setWasteTypes(prev => [...prev, newItem])
    }

    setIsDialogOpen(false)
    resetForm()
  }

  // Handle delete
  const handleDelete = (wasteType: WasteType) => {
    setSelectedWasteType(wasteType)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedWasteType) {
      setWasteTypes(prev => prev.filter(item => item.id !== selectedWasteType.id))
      setIsDeleteDialogOpen(false)
      setSelectedWasteType(null)
    }
  }

  // Filter data
  const filteredData = wasteTypes.filter((item: WasteType) => {
    const matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.kategori.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesKategori = filterKategori === "all" || item.kategori === filterKategori
    const matchesStatus = filterStatus === "all" || item.status === filterStatus
    
    return matchesSearch && matchesKategori && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Data Jenis Sampah
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola jenis-jenis sampah dan harga yang berlaku di platform
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Jenis Sampah
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari jenis sampah..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterKategori} onValueChange={setFilterKategori}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {kategoriOptions.map(kategori => (
                    <SelectItem key={kategori} value={kategori}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="text-2xl">📦</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Jenis</p>
                <p className="text-2xl font-bold">{wasteTypes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-green-600">
                  {wasteTypes.filter((item: WasteType) => item.status === 'Aktif').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <div className="text-2xl">⏸️</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nonaktif</p>
                <p className="text-2xl font-bold text-orange-600">
                  {wasteTypes.filter((item: WasteType) => item.status === 'Nonaktif').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <div className="text-2xl">💰</div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Harga</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(wasteTypes.reduce((sum: number, item: WasteType) => sum + item.harga_per_kg, 0) / wasteTypes.length).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Jenis Sampah</CardTitle>
          <CardDescription>
            {filteredData.length} dari {wasteTypes.length} jenis sampah ditampilkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Icon</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga/kg</TableHead>
                  <TableHead className="hidden md:table-cell">Deskripsi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Terakhir Update</TableHead>
                  <TableHead className="w-16">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item: WasteType) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {item.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      Rp {item.harga_per_kg.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {item.deskripsi}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.status === 'Aktif' ? 'default' : 'secondary'}
                        className={item.status === 'Aktif' ? 'bg-green-100 text-green-700' : ''}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                      {item.updated_at}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDelete(item)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📭</div>
              <p className="text-gray-500">Tidak ada data jenis sampah yang ditemukan</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedWasteType ? 'Edit Jenis Sampah' : 'Tambah Jenis Sampah Baru'}
            </DialogTitle>
            <DialogDescription>
              {selectedWasteType 
                ? 'Ubah informasi jenis sampah yang sudah ada' 
                : 'Masukkan informasi jenis sampah baru yang akan ditambahkan ke sistem'
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            {/* Icon Upload */}
            <div className="space-y-4">
              <Label>Icon Jenis Sampah</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  {previewIcon ? (
                    typeof previewIcon === 'string' && previewIcon.startsWith('data:') ? (
                      <img 
                        src={previewIcon} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="text-2xl">{previewIcon}</div>
                    )
                  ) : (
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Icon
                  </Button>
                  <p className="text-xs text-gray-500">
                    Format: JPG, PNG, SVG. Max: 2MB
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Jenis Sampah *</Label>
                <Input
                  id="nama"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  placeholder="Contoh: Botol Plastik"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori *</Label>
                <Select 
                  value={formData.kategori} 
                  onValueChange={(value) => handleInputChange('kategori', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriOptions.map((kategori: string) => (
                      <SelectItem key={kategori} value={kategori}>
                        {kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="harga">Harga per Kg (Rp) *</Label>
                <Input
                  id="harga"
                  type="number"
                  value={formData.harga_per_kg}
                  onChange={(e) => handleInputChange('harga_per_kg', e.target.value)}
                  placeholder="Contoh: 3000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                value={formData.deskripsi}
                onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                placeholder="Jelaskan karakteristik, syarat, atau keterangan tambahan mengenai jenis sampah ini..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>
              {selectedWasteType ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Jenis Sampah</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus jenis sampah "{selectedWasteType?.nama}"? 
              Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi data transaksi yang terkait.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}