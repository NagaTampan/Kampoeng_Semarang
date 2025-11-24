export interface Product {
    id: string
    name: string
    description?: string
    price: number
    category: string
    image_url?: string
    is_featured: boolean
    created_at: string
}

export interface Outlet {
    id: string
    name: string
    address: string
    phone?: string
    operating_hours?: string
    map_url?: string
    image_url?: string
    created_at: string
}

export interface Event {
    id: string
    title: string
    description?: string
    start_date: string
    end_date: string
    image_url?: string
    status: 'active' | 'inactive'
    category?: string
    location?: string
    start_time?: string
    is_featured?: boolean
    created_at: string
}
