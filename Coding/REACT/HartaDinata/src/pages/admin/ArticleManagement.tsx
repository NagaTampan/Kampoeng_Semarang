import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
    FileText,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Eye,
    Globe,
    User,
    Calendar,
    ArrowLeft,
    Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import RichTextEditor from '@/components/RichTextEditor';
import { Article } from '@/types/cms';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const ArticleManagement = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({
        title: '',
        content: '',
        author: '',
        category: 'Emas',
        imageUrl: '',
        isPublished: true
    });
    const [isEditing, setIsEditing] = useState(false);

    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedArticles, setSelectedArticles] = useState<Set<string>>(new Set());

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    // Debounce Logic & Reset Page
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching articles:', error);
            toast.error('Gagal mengambil data artikel.');
        } else {
            setArticles(data.map(item => ({
                id: item.id,
                title: item.title,
                content: item.content,
                author: item.author,
                category: item.category,
                imageUrl: item.image_url,
                isPublished: item.is_published,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            })));
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            title: currentArticle.title,
            content: currentArticle.content,
            author: currentArticle.author,
            category: currentArticle.category,
            image_url: currentArticle.imageUrl,
            is_published: currentArticle.isPublished,
            updated_at: new Date().toISOString()
        };

        if (isEditing && currentArticle.id) {
            const { error } = await supabase
                .from('articles')
                .update(payload)
                .eq('id', currentArticle.id);

            if (error) {
                toast.error('Gagal memperbarui artikel.');
            } else {
                toast.success('Artikel berhasil diperbarui!');
                fetchArticles();
                setIsDialogOpen(false);
            }
        } else {
            const { error } = await supabase
                .from('articles')
                .insert([{ ...payload, created_at: new Date().toISOString() }]);

            if (error) {
                toast.error('Gagal menambahkan artikel.');
            } else {
                toast.success('Artikel baru berhasil ditambahkan!');
                fetchArticles();
                setIsDialogOpen(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus artikel ini?')) return;

        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Gagal menghapus artikel.');
        } else {
            toast.success('Artikel berhasil dihapus.');
            fetchArticles();
            setSelectedArticles(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedArticles.size} artikel terpilih?`)) return;

        const { error } = await supabase
            .from('articles')
            .delete()
            .in('id', Array.from(selectedArticles));

        if (error) {
            toast.error('Gagal menghapus artikel terpilih.');
        } else {
            toast.success(`${selectedArticles.size} artikel berhasil dihapus.`);
            setSelectedArticles(new Set());
            fetchArticles();
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedArticles(new Set(filteredArticles.map(a => a.id)));
        } else {
            setSelectedArticles(new Set());
        }
    };

    const handleSelectArticle = (id: string, checked: boolean) => {
        setSelectedArticles(prev => {
            const newSet = new Set(prev);
            if (checked) newSet.add(id);
            else newSet.delete(id);
            return newSet;
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validasi ukuran (contoh: 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Ukuran file terlalu besar (Maks. 2MB)');
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const toastId = toast.loading('Mengunggah gambar...');

        try {
            const { error: uploadError } = await supabase.storage
                .from('articles')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('articles')
                .getPublicUrl(filePath);

            setCurrentArticle(prev => ({ ...prev, imageUrl: data.publicUrl }));
            toast.success('Gambar berhasil diunggah', { id: toastId });
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Gagal mengunggah gambar', { id: toastId });
        }
    };

    const openEditDialog = (article: Article) => {
        setCurrentArticle(article);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setCurrentArticle({
            title: '',
            content: '',
            author: '',
            category: 'Emas',
            imageUrl: '',
            isPublished: true
        });
        setIsEditing(false);
    };

    const categories = ['Emas', 'Edukasi', 'Bisnis', 'Mitra', 'Promo'];

    const filteredArticles = articles.filter(art =>
        art.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        art.author.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    // Pagination Calculation
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const paginatedArticles = filteredArticles.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex">
            <Sidebar />

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl font-display font-bold font-cinzel tracking-widest">Manajemen Artikel</h1>
                        <p className="text-white/40 text-sm">Kelola berita, edukasi, dan pengumuman untuk mitra.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input
                                placeholder="Cari judul atau penulis..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50"
                            />
                        </div>

                        {selectedArticles.size > 0 ? (
                            <Button
                                onClick={handleBulkDelete}
                                className="h-14 px-6 rounded-2xl font-bold bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/20"
                            >
                                <Trash2 className="w-5 h-5 mr-2" />
                                Hapus ({selectedArticles.size})
                            </Button>
                        ) : (
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) resetForm();
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="btn-luxury h-14 px-8 rounded-2xl font-bold shadow-gold group">
                                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                                        Tulis Artikel
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl bg-[#0A0A0A] border-white/10 text-white rounded-[2rem] overflow-hidden max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-cinzel font-bold">{isEditing ? 'Edit Artikel' : 'Tambah Artikel Baru'}</DialogTitle>
                                        <DialogDescription className="text-white/40">Isi detail lengkap artikel di bawah ini.</DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit} className="space-y-8 py-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40">Judul Artikel</Label>
                                                    <Input
                                                        required
                                                        value={currentArticle.title}
                                                        onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                                        placeholder="Contoh: Tips Memulai Investasi Emas"
                                                        className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40">Penulis</Label>
                                                    <Input
                                                        required
                                                        value={currentArticle.author}
                                                        onChange={(e) => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                                                        placeholder="Nama Author"
                                                        className="h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40">Kategori</Label>
                                                    <Select
                                                        value={currentArticle.category}
                                                        onValueChange={(val) => setCurrentArticle({ ...currentArticle, category: val })}
                                                    >
                                                        <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl">
                                                            <SelectValue placeholder="Pilih Kategori" />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-[#111] border-white/10 text-white">
                                                            {categories.map(cat => (
                                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase tracking-widest text-white/40">Gambar Cover</Label>
                                                    <div className="flex flex-col gap-4">
                                                        {currentArticle.imageUrl && (
                                                            <div className="relative w-full h-48 rounded-2xl bg-white/5 overflow-hidden border border-white/10 group">
                                                                <img
                                                                    src={currentArticle.imageUrl}
                                                                    alt="Preview"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setCurrentArticle({ ...currentArticle, imageUrl: '' })}
                                                                    className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        <div className="relative">
                                                            <Upload className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                                            <Input
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleImageUpload}
                                                                className="pl-12 h-14 pt-3 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                                                            />
                                                        </div>
                                                        <p className="text-[10px] text-white/40">Format: JPG, PNG, WEBP. Maks: 2MB.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Konten Artikel (Rich Text)</Label>
                                            <RichTextEditor
                                                content={currentArticle.content || ''}
                                                onChange={(html) => setCurrentArticle({ ...currentArticle, content: html })}
                                            />
                                            <p className="text-[10px] text-white/20 italic">Highlight teks untuk memformat (Heading, Bold, Italic, Link, dsb).</p>
                                        </div>

                                        <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <Globe className="w-5 h-5 text-primary" />
                                                <div>
                                                    <p className="text-sm font-bold">Publikasikan Langsung</p>
                                                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Hanya artikel terbit yang muncul di landing page</p>
                                                </div>
                                            </div>
                                            <Switch
                                                checked={currentArticle.isPublished}
                                                onCheckedChange={(checked) => setCurrentArticle({ ...currentArticle, isPublished: checked })}
                                            />
                                        </div>

                                        <DialogFooter className="gap-4">
                                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 rounded-2xl font-bold">Batal</Button>
                                            <Button type="submit" className="btn-luxury h-14 px-12 rounded-2xl font-bold">
                                                {isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </header>

                <div className="glass-card rounded-[2.5rem] border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-white/5">
                            <TableRow className="border-white/5 hover:bg-transparent">
                                <TableHead className="w-[50px] pl-8">
                                    <input
                                        type="checkbox"
                                        checked={filteredArticles.length > 0 && selectedArticles.size === filteredArticles.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 accent-primary"
                                    />
                                </TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest py-6">Artikel</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Kategori</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Penulis</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Status</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest text-right px-8">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedArticles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="py-20 text-center text-white/20">
                                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                        <p>Belum ada artikel yang ditemukan.</p>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedArticles.map((art) => (
                                <TableRow key={art.id} className={`border-white/5 hover:bg-white/[0.02] group ${selectedArticles.has(art.id) ? 'bg-white/[0.03]' : ''}`}>
                                    <TableCell className="pl-8">
                                        <input
                                            type="checkbox"
                                            checked={selectedArticles.has(art.id)}
                                            onChange={(e) => handleSelectArticle(art.id, e.target.checked)}
                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 accent-primary"
                                        />
                                    </TableCell>
                                    <TableCell className="py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/10">
                                                {art.imageUrl && <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="max-w-xs">
                                                <p className="font-bold text-sm line-clamp-1">{art.title}</p>
                                                <p className="text-[10px] text-white/20 uppercase tracking-widest flex items-center gap-2 mt-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(art.createdAt).toLocaleDateString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-white/60">
                                            {art.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-primary" />
                                            <span className="text-xs text-white/60 font-bold">{art.author}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {art.isPublished ? (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-success">
                                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                                Terbit
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                                                Draft
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right px-8">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="w-10 h-10 p-0 rounded-xl hover:bg-white/5">
                                                    <MoreVertical className="w-5 h-5 text-white/40" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-[#111] border-white/10 text-white p-2 min-w-[160px] rounded-xl">
                                                <DropdownMenuItem onClick={() => openEditDialog(art)} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors">
                                                    <Edit className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors opacity-50">
                                                    <Eye className="w-4 h-4 text-primary" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Pratinjau</span>
                                                </DropdownMenuItem>
                                                <div className="h-px bg-white/5 my-1" />
                                                <DropdownMenuItem onClick={() => handleDelete(art.id)} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">Hapus</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {!loading && filteredArticles.length > 0 && (
                        <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-white/40">
                                Menampilkan {paginatedArticles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} hingga {Math.min(currentPage * itemsPerPage, filteredArticles.length)} dari {filteredArticles.length} artikel
                            </p>

                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <PaginationItem key={page}>
                                            <PaginationLink
                                                onClick={() => handlePageChange(page)}
                                                isActive={currentPage === page}
                                                className="cursor-pointer"
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ArticleManagement;
