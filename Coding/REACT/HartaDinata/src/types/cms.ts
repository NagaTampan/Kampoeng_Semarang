export interface Article {
    id: string;
    title: string;
    content: string; // HTML from RichTextEditor
    author: string;
    category: string;
    imageUrl: string;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Video {
    id: string; // UUID from DB
    videoId: string; // YouTube ID
    title: string;
    description: string;
    duration: string;
    views: number;
    category: string;
    thumbnail: string;
    isFeatured: boolean;
    createdAt: string;
}
