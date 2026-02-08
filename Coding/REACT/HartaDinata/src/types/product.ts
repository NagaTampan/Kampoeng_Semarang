export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    imageUrl: string;
    stock: number;
    isFeatured: boolean;
    isPromo: boolean;
    isBundle: boolean;
    bundleItems?: string[]; // Array of product IDs
    badge?: string;
    certification?: string;
    rating?: number;
    reviews?: number;
    createdAt: string;
}
