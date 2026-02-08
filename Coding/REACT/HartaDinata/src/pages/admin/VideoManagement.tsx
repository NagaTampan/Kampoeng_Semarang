import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
    Video,
    Plus,
    Search,
    MoreVertical,
    Edit,
    Trash2,
    Play,
    Youtube,
    Eye,
    Clock,
    BarChart,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import { Video as VideoType } from '@/types/cms';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const VideoManagement = () => {
    const [videos, setVideos] = useState<VideoType[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<Partial<VideoType>>({
        videoId: '',
        title: '',
        description: '',
        duration: '',
        category: 'Masterclass',
        thumbnail: '',
        views: 0,
        isFeatured: false
    });
    const [isEditing, setIsEditing] = useState(false);

    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Debounce Logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setCurrentPage(1); // Reset page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching videos:', error);
            toast.error('Gagal mengambil data video.');
        } else {
            setVideos(data.map(v => ({
                id: v.id,
                videoId: v.video_id,
                title: v.title,
                description: v.description,
                duration: v.duration,
                views: v.views,
                category: v.category,
                thumbnail: v.thumbnail,
                isFeatured: v.is_featured,
                createdAt: v.created_at
            })));
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If this video is featured, we need to make sure others are not
        if (currentVideo.isFeatured) {
            await supabase
                .from('videos')
                .update({ is_featured: false })
                .neq('id', 'temp-never-match'); // Reset all
        }

        const payload = {
            video_id: currentVideo.videoId,
            title: currentVideo.title,
            description: currentVideo.description,
            duration: currentVideo.duration,
            views: currentVideo.views || 0,
            category: currentVideo.category,
            is_featured: currentVideo.isFeatured,
            thumbnail: currentVideo.thumbnail || `https://img.youtube.com/vi/${currentVideo.videoId}/maxresdefault.jpg`
        };

        if (isEditing && currentVideo.id) {
            const { error } = await supabase
                .from('videos')
                .update(payload)
                .eq('id', currentVideo.id);

            if (error) {
                toast.error('Gagal memperbarui video.');
            } else {
                toast.success('Video berhasil diperbarui!');
                fetchVideos();
                setIsDialogOpen(false);
            }
        } else {
            const { error } = await supabase
                .from('videos')
                .insert([{ ...payload, created_at: new Date().toISOString() }]);

            if (error) {
                toast.error('Gagal menambahkan video.');
            } else {
                toast.success('Video baru berhasil ditambahkan!');
                fetchVideos();
                setIsDialogOpen(false);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Apakah Anda yakin ingin menghapus video ini?')) return;

        const { error } = await supabase
            .from('videos')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Gagal menghapus video.');
        } else {
            toast.success('Video berhasil dihapus.');
            fetchVideos();
            setSelectedVideos(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        }
    };

    const handleBulkDelete = async () => {
        if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedVideos.size} video terpilih?`)) return;

        const { error } = await supabase
            .from('videos')
            .delete()
            .in('id', Array.from(selectedVideos));

        if (error) {
            toast.error('Gagal menghapus video terpilih.');
        } else {
            toast.success(`${selectedVideos.size} video berhasil dihapus.`);
            setSelectedVideos(new Set());
            fetchVideos();
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedVideos(new Set(filteredVideos.map(v => v.id)));
        } else {
            setSelectedVideos(new Set());
        }
    };

    const handleSelectVideo = (id: string, checked: boolean) => {
        setSelectedVideos(prev => {
            const newSet = new Set(prev);
            if (checked) newSet.add(id);
            else newSet.delete(id);
            return newSet;
        });
    };

    const openEditDialog = (video: VideoType) => {
        setCurrentVideo(video);
        setIsEditing(true);
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setCurrentVideo({
            videoId: '',
            title: '',
            description: '',
            duration: '',
            category: 'Masterclass',
            thumbnail: '',
            views: 0
        });
        setIsEditing(false);
    };

    const categories = ['Masterclass', 'Edukasi Reseller', 'Insight Bisnis', 'Produk Knowledge', 'Tutorial', 'Company Profile'];

    const filteredVideos = videos.filter(v =>
        v.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        v.category.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
    const paginatedVideos = filteredVideos.slice(
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
                        <h1 className="text-3xl font-display font-bold font-cinzel tracking-widest">Manajemen Video</h1>
                        <p className="text-white/40 text-sm">Kelola playlist video edukasi dan panduan mitra.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <Input
                                placeholder="Cari judul video atau kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus:border-primary/50"
                            />
                        </div>

                        {selectedVideos.size > 0 ? (
                            <Button
                                onClick={handleBulkDelete}
                                className="h-14 px-6 rounded-2xl font-bold bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/20"
                            >
                                <Trash2 className="w-5 h-5 mr-2" />
                                Hapus ({selectedVideos.size})
                            </Button>
                        ) : (
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) resetForm();
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="btn-luxury h-14 px-8 rounded-2xl font-bold shadow-gold group">
                                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                                        Unggah Link Video
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-[#0A0A0A] border-white/10 text-white rounded-[2rem]">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-cinzel font-bold">{isEditing ? 'Edit Video' : 'Tambah Video Edukasi'}</DialogTitle>
                                        <DialogDescription className="text-white/40">Gunakan ID video dari YouTube untuk integrasi otomatis.</DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit} className="space-y-6 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2 col-span-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/40">Judul Video</Label>
                                                <Input
                                                    required
                                                    value={currentVideo.title}
                                                    onChange={(e) => setCurrentVideo({ ...currentVideo, title: e.target.value })}
                                                    placeholder="Contoh: Strategi Penjualan Emas Perhiasan"
                                                    className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-primary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/40">YouTube Video ID</Label>
                                                <div className="relative">
                                                    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive" />
                                                    <Input
                                                        required
                                                        value={currentVideo.videoId}
                                                        onChange={(e) => setCurrentVideo({ ...currentVideo, videoId: e.target.value })}
                                                        placeholder="e.g. dQw4w9WgXcQ"
                                                        className="h-14 bg-white/5 border-white/10 rounded-xl pl-12 focus:border-primary/50"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/40">Kategori</Label>
                                                <Select
                                                    value={currentVideo.category}
                                                    onValueChange={(val) => setCurrentVideo({ ...currentVideo, category: val })}
                                                >
                                                    <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-xl">
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
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/40">Durasi</Label>
                                                <Input
                                                    value={currentVideo.duration}
                                                    onChange={(e) => setCurrentVideo({ ...currentVideo, duration: e.target.value })}
                                                    placeholder="Contoh: 12:45"
                                                    className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-primary/50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-black uppercase tracking-widest text-white/40">Views Awal</Label>
                                                <Input
                                                    type="number"
                                                    value={currentVideo.views}
                                                    onChange={(e) => setCurrentVideo({ ...currentVideo, views: parseInt(e.target.value) })}
                                                    className="h-14 bg-white/5 border-white/10 rounded-xl focus:border-primary/50"
                                                />
                                            </div>
                                            <div className="col-span-2 py-2 flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="isFeatured"
                                                    checked={currentVideo.isFeatured}
                                                    onChange={(e) => setCurrentVideo({ ...currentVideo, isFeatured: e.target.checked })}
                                                    className="w-5 h-5 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 accent-primary"
                                                />
                                                <Label htmlFor="isFeatured" className="text-sm font-bold text-white cursor-pointer select-none">Jadikan Video Utama (Home Page)</Label>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-black uppercase tracking-widest text-white/40">Deskripsi Singkat</Label>
                                            <Textarea
                                                value={currentVideo.description}
                                                onChange={(e) => setCurrentVideo({ ...currentVideo, description: e.target.value })}
                                                className="bg-white/5 border-white/10 rounded-xl min-h-[100px] focus:border-primary/50"
                                            />
                                        </div>

                                        <DialogFooter>
                                            <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="h-14 rounded-xl font-bold">Batal</Button>
                                            <Button type="submit" className="btn-luxury h-14 px-12 rounded-xl font-bold">
                                                {isEditing ? 'Simpan Perubahan' : 'Tambahkan Video'}
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
                                        checked={filteredVideos.length > 0 && selectedVideos.size === filteredVideos.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                        className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 accent-primary"
                                    />
                                </TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest py-6 px-4">Preview Video</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Kategori</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest">Status</TableHead>
                                <TableHead className="text-white/40 uppercase text-[10px] font-black tracking-widest text-right px-8">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                                    </TableCell>
                                </TableRow>
                            ) : paginatedVideos.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-20 text-center text-white/20">
                                        <Video className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                        <p>Belum ada video edukasi.</p>
                                    </TableCell>
                                </TableRow>
                            ) : paginatedVideos.map((v) => (
                                <TableRow key={v.id} className={`border-white/5 hover:bg-white/[0.02] group ${selectedVideos.has(v.id) ? 'bg-white/[0.03]' : ''}`}>
                                    <TableCell className="pl-8">
                                        <input
                                            type="checkbox"
                                            checked={selectedVideos.has(v.id)}
                                            onChange={(e) => handleSelectVideo(v.id, e.target.checked)}
                                            className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20 accent-primary"
                                        />
                                    </TableCell>
                                    <TableCell className="py-6 px-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-24 h-14 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-primary/30 transition-colors">
                                                <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover brightness-[0.6]" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Play className="w-4 h-4 text-primary fill-current" />
                                                </div>
                                            </div>
                                            <div className="max-w-md">
                                                <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{v.title}</p>
                                                <div className="flex items-center gap-3 mt-1 opacity-40">
                                                    <span className="text-[10px] font-black tracking-widest uppercase flex items-center gap-1">
                                                        <Youtube className="w-3 h-3" />
                                                        ID: {v.videoId}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-white/60">
                                            {v.category}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {v.isFeatured ? (
                                            <div className="flex items-center gap-2 text-primary">
                                                <Sparkles className="w-3 h-3 animate-pulse" />
                                                <span className="text-[10px] font-black tracking-widest uppercase">Featured</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] font-black tracking-widest uppercase text-white/20">Regular</span>
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
                                                <DropdownMenuItem onClick={() => openEditDialog(v)} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors text-primary font-bold">
                                                    <Edit className="w-4 h-4" />
                                                    <span className="text-[10px] uppercase tracking-widest">Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-white/5 transition-colors opacity-50">
                                                    <Eye className="w-4 h-4 text-white/60" />
                                                    <span className="text-[10px] uppercase tracking-widest text-white/60">Tonton</span>
                                                </DropdownMenuItem>
                                                <div className="h-px bg-white/5 my-1" />
                                                <DropdownMenuItem onClick={() => handleDelete(v.id)} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-destructive/10 text-destructive transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="text-[10px] uppercase tracking-widest">Hapus</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {!loading && filteredVideos.length > 0 && (
                        <div className="p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-sm text-white/40">
                                Menampilkan {paginatedVideos.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} hingga {Math.min(currentPage * itemsPerPage, filteredVideos.length)} dari {filteredVideos.length} video
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

export default VideoManagement;
