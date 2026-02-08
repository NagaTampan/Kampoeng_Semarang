import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
    Package,
    Plus,
    Search,
    Edit2,
    Trash2,
    Star,
    TrendingDown,
    Gift,
    Loader2,
    Image as ImageIcon,
    Upload,
    X,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from 'sonner';
import { Product } from '@/types/product';
import Sidebar from '@/components/Sidebar';
import RichTextEditor from '@/components/RichTextEditor';
import { sanitizeHtml } from '@/utils/sanitize';

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');

    const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        category: 'Emas Batangan',
        imageUrl: '',
        stock: 0,
        isFeatured: false,
        isPromo: false,
        isBundle: false,
        bundleItems: [],
        badge: '',
        certification: 'LBMA Certified',
    });
    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData: Product[] = (data || []).map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                originalPrice: item.original_price,
                category: item.category,
                imageUrl: item.image_url,
                stock: item.stock,
                isFeatured: item.is_featured,
                isPromo: item.is_promo,
                isBundle: item.is_bundle || false,
                bundleItems: item.bundle_items || [],
                badge: item.badge,
                certification: item.certification,
                rating: item.rating,
                reviews: item.reviews,
                createdAt: item.created_at,
            }));

            setProducts(formattedData);
        } catch (error: any) {
            toast.error('Gagal mengambil data produk: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) navigate('/admin/login');
        };
        checkUser();
        fetchProducts();
    }, [navigate]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        return publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        try {
            let finalImageUrl = currentProduct.imageUrl;

            if (selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const payload = {
                name: currentProduct.name,
                description: currentProduct.description,
                price: Number(currentProduct.price),
                original_price: Number(currentProduct.originalPrice),
                category: currentProduct.category,
                image_url: finalImageUrl,
                stock: Number(currentProduct.stock),
                is_featured: currentProduct.isFeatured,
                is_promo: currentProduct.isPromo,
                is_bundle: currentProduct.isBundle,
                bundle_items: currentProduct.bundleItems,
                badge: currentProduct.badge,
                certification: currentProduct.certification,
            };

            if (currentProduct.id) {
                const { error } = await supabase
                    .from('products')
                    .update(payload)
                    .eq('id', currentProduct.id);
                if (error) throw error;
                toast.success('Produk berhasil diperbarui');
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([payload]);
                if (error) throw error;
                toast.success('Produk berhasil ditambahkan');
            }

            setIsDialogOpen(false);
            fetchProducts();
            resetForm();
        } catch (error: any) {
            toast.error('Gagal menyimpan produk: ' + (error.message || 'Error occurred'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            toast.success('Produk berhasil dihapus');
            fetchProducts();
        } catch (error: any) {
            toast.error('Gagal menghapus produk: ' + error.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const resetForm = () => {
        setCurrentProduct({
            name: '',
            description: '',
            price: 0,
            originalPrice: 0,
            category: 'Emas Batangan',
            imageUrl: '',
            stock: 0,
            isFeatured: false,
            isPromo: false,
            isBundle: false,
            bundleItems: [],
            badge: '',
            certification: 'LBMA Certified',
        });
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const toggleBundleItem = (productId: string) => {
        const currentItems = currentProduct.bundleItems || [];
        if (currentItems.includes(productId)) {
            setCurrentProduct({
                ...currentProduct,
                bundleItems: currentItems.filter(id => id !== productId)
            });
        } else {
            setCurrentProduct({
                ...currentProduct,
                bundleItems: [...currentItems, productId]
            });
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />

            <div className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold font-cinzel tracking-wider">Katalog Produk</h1>
                        <p className="text-white/40 text-sm mt-1">Kelola ekosistem produk emas dan perhiasan Hartadinata.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative group sm:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Cari produk..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white/5 border-white/10 h-12 pl-12 rounded-2xl focus:border-primary/50 focus:ring-primary/20 transition-all text-white"
                            />
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={(open) => {
                            setIsDialogOpen(open);
                            if (!open) resetForm();
                        }}>
                            <DialogTrigger asChild>
                                <Button className="btn-luxury h-12 rounded-xl px-6 font-bold shadow-gold">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Tambah Produk
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0A0A0A] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto p-8 rounded-[2.5rem]">
                                <DialogHeader className="mb-6">
                                    <DialogTitle className="text-2xl font-display font-bold font-cinzel">
                                        {currentProduct.id ? 'Edit Produk' : 'Tambah Produk Baru'}
                                    </DialogTitle>
                                    <DialogDescription className="text-white/40">
                                        Lengkapi detail produk dengan fitur promo dan bundling terbaru.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Image Upload Area */}
                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-widest text-white/40">Foto Produk</Label>
                                        <div className="relative group cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            <div className="w-full aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary/40 group-hover:bg-primary/5">
                                                {previewUrl || currentProduct.imageUrl ? (
                                                    <div className="relative w-full h-full">
                                                        <img src={previewUrl || currentProduct.imageUrl} alt="Preview" className="w-full h-full object-contain p-4" />
                                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <Upload className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                            <ImageIcon className="w-8 h-8 text-white/20" />
                                                        </div>
                                                        <p className="text-sm font-bold">Klik untuk unggah gambar</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Nama Produk</Label>
                                            <Input
                                                value={currentProduct.name}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                                                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/50"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Kategori</Label>
                                            <Select
                                                value={currentProduct.category}
                                                onValueChange={(val) => setCurrentProduct({ ...currentProduct, category: val })}
                                            >
                                                <SelectTrigger className="bg-white/5 border-white/10 h-14 rounded-2xl">
                                                    <SelectValue placeholder="Pilih Kategori" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#111] border-white/10 text-white rounded-2xl">
                                                    <SelectItem value="Emas Batangan">Emas Batangan</SelectItem>
                                                    <SelectItem value="Cincin Perhiasan">Cincin Perhiasan</SelectItem>
                                                    <SelectItem value="Kalung Perhiasan">Kalung Perhiasan</SelectItem>
                                                    <SelectItem value="Gelang Perhiasan">Gelang Perhiasan</SelectItem>
                                                    <SelectItem value="Anting Perhiasan">Anting Perhiasan</SelectItem>
                                                    <SelectItem value="Liontin">Liontin</SelectItem>
                                                    <SelectItem value="Bundling">Bundling Special</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-widest text-white/40">Deskripsi Produk (Rich Text)</Label>
                                        <RichTextEditor
                                            content={currentProduct.description || ''}
                                            onChange={(html) => setCurrentProduct({ ...currentProduct, description: html })}
                                        />
                                        <p className="text-[10px] text-white/20 italic">Highlight teks untuk memunculkan menu format (Notion-style).</p>
                                    </div>

                                    {/* Conditional Price Rendering */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {currentProduct.isPromo ? (
                                            <>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40">Harga Flash Sale (IDR)</Label>
                                                    <Input
                                                        type="number"
                                                        value={currentProduct.price}
                                                        onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number(e.target.value) })}
                                                        className="bg-white/5 border-primary/20 h-14 rounded-2xl focus:border-primary/50 text-primary font-bold"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40">Harga Normal (Coret)</Label>
                                                    <Input
                                                        type="number"
                                                        value={currentProduct.originalPrice}
                                                        onChange={(e) => setCurrentProduct({ ...currentProduct, originalPrice: Number(e.target.value) })}
                                                        className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/50 font-mono"
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <div className="space-y-2 md:col-span-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/40">Harga Normal (IDR)</Label>
                                                <Input
                                                    type="number"
                                                    value={currentProduct.price}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value);
                                                        setCurrentProduct({ ...currentProduct, price: val, originalPrice: val });
                                                    }}
                                                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/50"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Sertifikasi</Label>
                                            <Input
                                                value={currentProduct.certification}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, certification: e.target.value })}
                                                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Stok Tersedia</Label>
                                            <Input
                                                type="number"
                                                value={currentProduct.stock}
                                                onChange={(e) => setCurrentProduct({ ...currentProduct, stock: Number(e.target.value) })}
                                                className="bg-white/5 border-white/10 h-14 rounded-2xl focus:border-primary/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/5">
                                        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                                            <Checkbox
                                                id="featured"
                                                checked={currentProduct.isFeatured}
                                                onCheckedChange={(val) => setCurrentProduct({ ...currentProduct, isFeatured: !!val })}
                                            />
                                            <Label htmlFor="featured" className="text-xs font-bold flex items-center gap-2 cursor-pointer uppercase tracking-widest">
                                                <Star className="w-4 h-4 text-primary fill-primary" />
                                                Featured
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-success/20 transition-all cursor-pointer">
                                            <Checkbox
                                                id="promo"
                                                checked={currentProduct.isPromo}
                                                onCheckedChange={(val) => setCurrentProduct({ ...currentProduct, isPromo: !!val })}
                                            />
                                            <Label htmlFor="promo" className="text-xs font-bold flex items-center gap-2 cursor-pointer uppercase tracking-widest">
                                                <TrendingDown className="w-4 h-4 text-success" />
                                                Flash Sale
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/5 hover:border-secondary/20 transition-all cursor-pointer">
                                            <Checkbox
                                                id="bundle"
                                                checked={currentProduct.isBundle}
                                                onCheckedChange={(val) => setCurrentProduct({ ...currentProduct, isBundle: !!val })}
                                            />
                                            <Label htmlFor="bundle" className="text-xs font-bold flex items-center gap-2 cursor-pointer uppercase tracking-widest">
                                                <Gift className="w-4 h-4 text-secondary" />
                                                Bundle
                                            </Label>
                                        </div>
                                    </div>

                                    {/* Bundle Selection UI */}
                                    {currentProduct.isBundle && (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Daftar Produk Bundling</Label>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className="w-full h-14 rounded-2xl bg-white/5 border-white/10 text-left justify-start px-4 font-normal hover:bg-white/10">
                                                        {currentProduct.bundleItems?.length ? `${currentProduct.bundleItems.length} Produk Terpilih` : 'Pilih produk untuk bundling...'}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[500px] p-0 bg-[#111] border-white/10 text-white rounded-2xl shadow-2xl" align="start">
                                                    <div className="p-4 border-b border-white/5">
                                                        <p className="text-xs font-black uppercase tracking-widest text-white/40">Katalog Produk</p>
                                                    </div>
                                                    <div className="max-h-[300px] overflow-y-auto p-2 space-y-1">
                                                        {products.filter(p => p.id !== currentProduct.id).map(prod => (
                                                            <div
                                                                key={prod.id}
                                                                onClick={() => toggleBundleItem(prod.id)}
                                                                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${currentProduct.bundleItems?.includes(prod.id) ? 'bg-primary/10 border border-primary/20' : 'hover:bg-white/5 border border-transparent'}`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden border border-white/5">
                                                                        {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : <Package className="w-4 h-4 text-white/20" />}
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-bold">{prod.name}</p>
                                                                        <p className="text-[10px] text-white/40 uppercase tracking-widest">{prod.category}</p>
                                                                    </div>
                                                                </div>
                                                                {currentProduct.bundleItems?.includes(prod.id) && (
                                                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                                                        <Check className="w-3 h-3 text-black font-black" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}

                                    <DialogFooter className="pt-8">
                                        <Button
                                            type="submit"
                                            disabled={isUploading}
                                            className="w-full btn-luxury h-16 rounded-2xl text-base font-bold shadow-gold group"
                                        >
                                            {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Terbitkan Produk'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </header>

                {/* Table implementation same as before... */}
                <div className="glass-card rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-white/[0.03] h-20">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[100px] text-center">Preview</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Detail Produk</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Kategori</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Harga</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Stock</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-white/40">Action</TableHead>
                                <TableHead className="text-right pr-12 text-[10px] font-black uppercase tracking-widest text-white/40">Kelola</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-80 text-center">
                                        <div className="flex flex-col items-center justify-center gap-6">
                                            <Loader2 className="w-16 h-16 text-primary animate-spin" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20">Sinkronisasi Data...</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProducts.map((product) => (
                                    <TableRow key={product.id} className="border-white/5 hover:bg-white/[0.02] transition-all h-28 group">
                                        <TableCell>
                                            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-primary/30 transition-colors shadow-lg">
                                                {product.imageUrl ? <img src={product.imageUrl} alt="" className="w-full h-full object-contain p-2" /> : <ImageIcon className="w-8 h-8 text-white/10" />}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col max-w-xs">
                                                <span className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{product.name}</span>
                                                <span className="text-[10px] text-white/20 font-mono tracking-tighter uppercase line-clamp-1" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description || '').substring(0, 50) + '...' }} />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-white/40">{product.category}</span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-mono-price font-bold text-primary text-lg text-gold-gradient">Rp {product.price.toLocaleString('id-ID')}</span>
                                                {product.isPromo && <span className="text-[10px] text-white/20 line-through italic">Mulai Rp {product.originalPrice?.toLocaleString('id-ID')}</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-destructive animate-pulse' : 'bg-success shadow-[0_0_10px_rgba(34,197,94,0.3)]'}`} />
                                                <span className="text-sm font-bold text-white/60">{product.stock} Unit</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-3">
                                                {product.isFeatured && <Star className="w-5 h-5 text-primary fill-primary" />}
                                                {product.isPromo && <TrendingDown className="w-5 h-5 text-success" />}
                                                {product.isBundle && (
                                                    <div className="relative group/bundle">
                                                        <Gift className="w-5 h-5 text-secondary transition-transform group-hover/bundle:scale-110" />
                                                        {product.bundleItems && product.bundleItems.length > 0 && (
                                                            <span className="absolute -top-2 -right-2 bg-secondary text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{product.bundleItems.length}</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setCurrentProduct({
                                                            ...product,
                                                            bundleItems: product.bundleItems || []
                                                        });
                                                        setPreviewUrl(product.imageUrl || '');
                                                        setIsDialogOpen(true);
                                                    }}
                                                    className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white border border-white/5"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleDelete(product.id)}
                                                    className="w-12 h-12 rounded-2xl bg-destructive/10 hover:bg-destructive/20 text-white/40 hover:text-destructive border border-destructive/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;
