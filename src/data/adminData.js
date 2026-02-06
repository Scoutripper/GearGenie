// Mock data for Admin Dashboard

// Dashboard Stats
export const dashboardStats = {
    totalRevenue: {
        value: 'â‚¹4,52,890',
        change: '+12.5%',
        trend: 'up',
        period: 'vs last month'
    },
    totalOrders: {
        value: '1,247',
        change: '+8.2%',
        trend: 'up',
        period: 'vs last month'
    },
    totalUsers: {
        value: '3,892',
        change: '+15.3%',
        trend: 'up',
        period: 'vs last month'
    },
    totalProducts: {
        value: '156',
        change: '+3',
        trend: 'up',
        period: 'new this month'
    }
};

// Revenue data for chart (last 7 days)
export const revenueData = [
    { day: 'Mon', value: 45000 },
    { day: 'Tue', value: 52000 },
    { day: 'Wed', value: 38000 },
    { day: 'Thu', value: 65000 },
    { day: 'Fri', value: 71000 },
    { day: 'Sat', value: 82000 },
    { day: 'Sun', value: 58000 }
];

// Monthly revenue data
export const monthlyRevenueData = [
    { month: 'Jan', value: 320000 },
    { month: 'Feb', value: 285000 },
    { month: 'Mar', value: 410000 },
    { month: 'Apr', value: 380000 },
    { month: 'May', value: 450000 },
    { month: 'Jun', value: 520000 }
];

// Order status breakdown
export const orderStatusData = [
    { status: 'Delivered', count: 845, color: '#10b981' },
    { status: 'Processing', count: 234, color: '#f59e0b' },
    { status: 'Shipped', count: 128, color: '#3b82f6' },
    { status: 'Pending', count: 32, color: '#6b7280' },
    { status: 'Cancelled', count: 8, color: '#ef4444' }
];

// Sample Products
export const adminProducts = [
    {
        id: 1,
        name: 'Quechua MH100 Camping Tent',
        image: 'https://images.pexels.com/photos/2422265/pexels-photo-2422265.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Tents',
        price: 2499,
        rentPrice: 299,
        stock: 45,
        status: 'active',
        sales: 128
    },
    {
        id: 2,
        name: 'Wildcraft Rucksack 45L',
        image: 'https://images.pexels.com/photos/1230302/pexels-photo-1230302.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Backpacks',
        price: 1899,
        rentPrice: 199,
        stock: 32,
        status: 'active',
        sales: 95
    },
    {
        id: 3,
        name: 'Trek 500 Hiking Boots',
        image: 'https://images.pexels.com/photos/2562325/pexels-photo-2562325.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Footwear',
        price: 3499,
        rentPrice: 399,
        stock: 28,
        status: 'active',
        sales: 76
    },
    {
        id: 4,
        name: 'Forclaz Trek 900 Sleeping Bag',
        image: 'https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Sleeping Gear',
        price: 4299,
        rentPrice: 449,
        stock: 18,
        status: 'active',
        sales: 64
    },
    {
        id: 5,
        name: 'Hiking Pole Set (Pair)',
        image: 'https://images.pexels.com/photos/9312638/pexels-photo-9312638.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Accessories',
        price: 1299,
        rentPrice: 149,
        stock: 52,
        status: 'active',
        sales: 112
    },
    {
        id: 6,
        name: 'Waterproof Rain Jacket',
        image: 'https://images.pexels.com/photos/6153354/pexels-photo-6153354.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Clothing',
        price: 2199,
        rentPrice: 249,
        stock: 0,
        status: 'out_of_stock',
        sales: 89
    },
    {
        id: 7,
        name: 'LED Headlamp 200 Lumens',
        image: 'https://images.pexels.com/photos/5063539/pexels-photo-5063539.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Accessories',
        price: 899,
        rentPrice: 99,
        stock: 67,
        status: 'active',
        sales: 143
    },
    {
        id: 8,
        name: 'Thermal Base Layer Set',
        image: 'https://images.pexels.com/photos/6311652/pexels-photo-6311652.jpeg?auto=compress&cs=tinysrgb&w=100',
        category: 'Clothing',
        price: 1599,
        rentPrice: 179,
        stock: 5,
        status: 'low_stock',
        sales: 58
    }
];

// Sample Orders
export const adminOrders = [
    {
        id: 'ORD-2024-1247',
        customer: {
            name: 'Anshul Singh',
            email: 'anshul@gmail.com',
            profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        items: [
            { name: 'Quechua MH100 Camping Tent', qty: 1, price: 2499 },
            { name: 'Hiking Pole Set', qty: 1, price: 1299 }
        ],
        total: 3798,
        status: 'delivered',
        paymentMethod: 'Online',
        date: '2024-01-20',
        address: 'Manali, Himachal Pradesh'
    },
    {
        id: 'ORD-2024-1246',
        customer: {
            name: 'Priya Sharma',
            email: 'priya.sharma@email.com',
            profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        items: [
            { name: 'Trek 500 Hiking Boots', qty: 1, price: 3499 }
        ],
        total: 3499,
        status: 'shipped',
        paymentMethod: 'COD',
        date: '2024-01-19',
        address: 'Dehradun, Uttarakhand'
    },
    {
        id: 'ORD-2024-1245',
        customer: {
            name: 'Rahul Verma',
            email: 'rahul.v@email.com',
            profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        items: [
            { name: 'Forclaz Trek 900 Sleeping Bag', qty: 1, price: 4299 },
            { name: 'LED Headlamp 200 Lumens', qty: 2, price: 1798 }
        ],
        total: 6097,
        status: 'processing',
        paymentMethod: 'Online',
        date: '2024-01-18',
        address: 'Shimla, Himachal Pradesh'
    },
    {
        id: 'ORD-2024-1244',
        customer: {
            name: 'Neha Gupta',
            email: 'neha.g@email.com',
            profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        items: [
            { name: 'Wildcraft Rucksack 45L', qty: 1, price: 1899 }
        ],
        total: 1899,
        status: 'pending',
        paymentMethod: 'Online',
        date: '2024-01-18',
        address: 'Rishikesh, Uttarakhand'
    },
    {
        id: 'ORD-2024-1243',
        customer: {
            name: 'Amit Patel',
            email: 'amit.p@email.com',
            profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        items: [
            { name: 'Waterproof Rain Jacket', qty: 1, price: 2199 },
            { name: 'Thermal Base Layer Set', qty: 1, price: 1599 }
        ],
        total: 3798,
        status: 'delivered',
        paymentMethod: 'Online',
        date: '2024-01-17',
        address: 'Leh, Ladakh'
    },
    {
        id: 'ORD-2024-1242',
        customer: {
            name: 'Kavya Menon',
            email: 'kavya.m@email.com',
            profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'
        },
        items: [
            { name: 'Quechua MH100 Camping Tent', qty: 2, price: 4998 }
        ],
        total: 4998,
        status: 'cancelled',
        paymentMethod: 'Online',
        date: '2024-01-16',
        address: 'Bangalore, Karnataka'
    }
];

// Sample Users
export const adminUsers = [
    {
        id: 1,
        firstName: 'Anshul',
        lastName: 'Singh',
        email: 'anshul@gmail.com',
        phone: '+91 98151 81405',
        profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        joinedDate: 'Jan 2024',
        ordersCount: 12,
        totalSpent: 45890,
        status: 'active',
        lastActive: '2 hours ago'
    },
    {
        id: 2,
        firstName: 'Priya',
        lastName: 'Sharma',
        email: 'priya.sharma@email.com',
        phone: '+91 87654 32109',
        profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        joinedDate: 'Dec 2023',
        ordersCount: 8,
        totalSpent: 32450,
        status: 'active',
        lastActive: '1 day ago'
    },
    {
        id: 3,
        firstName: 'Rahul',
        lastName: 'Verma',
        email: 'rahul.v@email.com',
        phone: '+91 76543 21098',
        profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        joinedDate: 'Nov 2023',
        ordersCount: 15,
        totalSpent: 67230,
        status: 'active',
        lastActive: '5 hours ago'
    },
    {
        id: 4,
        firstName: 'Neha',
        lastName: 'Gupta',
        email: 'neha.g@email.com',
        phone: '+91 65432 10987',
        profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        joinedDate: 'Jan 2024',
        ordersCount: 3,
        totalSpent: 8790,
        status: 'active',
        lastActive: '3 days ago'
    },
    {
        id: 5,
        firstName: 'Amit',
        lastName: 'Patel',
        email: 'amit.p@email.com',
        phone: '+91 54321 09876',
        profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        joinedDate: 'Oct 2023',
        ordersCount: 22,
        totalSpent: 89450,
        status: 'active',
        lastActive: '1 hour ago'
    },
    {
        id: 6,
        firstName: 'Kavya',
        lastName: 'Menon',
        email: 'kavya.m@email.com',
        phone: '+91 43210 98765',
        profilePic: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
        joinedDate: 'Dec 2023',
        ordersCount: 5,
        totalSpent: 15670,
        status: 'inactive',
        lastActive: '2 weeks ago'
    }
];

// Recent Activity Feed
export const recentActivity = [
    {
        id: 1,
        type: 'order',
        message: 'New order #ORD-2024-1247 placed',
        user: 'Anshul Singh',
        time: '2 hours ago',
        icon: 'ShoppingCart'
    },
    {
        id: 2,
        type: 'user',
        message: 'New user registered',
        user: 'Vikram Reddy',
        time: '4 hours ago',
        icon: 'UserPlus'
    },
    {
        id: 3,
        type: 'order',
        message: 'Order #ORD-2024-1243 delivered',
        user: 'Amit Patel',
        time: '6 hours ago',
        icon: 'Package'
    },
    {
        id: 4,
        type: 'product',
        message: 'Product stock low: Waterproof Rain Jacket',
        user: 'System',
        time: '8 hours ago',
        icon: 'AlertTriangle'
    },
    {
        id: 5,
        type: 'order',
        message: 'Order #ORD-2024-1242 cancelled',
        user: 'Kavya Menon',
        time: '1 day ago',
        icon: 'XCircle'
    }
];

// Top selling products
export const topProducts = [
    { id: 7, name: 'LED Headlamp 200 Lumens', sales: 143, revenue: 128557 },
    { id: 1, name: 'Quechua MH100 Camping Tent', sales: 128, revenue: 319872 },
    { id: 5, name: 'Hiking Pole Set (Pair)', sales: 112, revenue: 145488 },
    { id: 2, name: 'Wildcraft Rucksack 45L', sales: 95, revenue: 180405 },
    { id: 6, name: 'Waterproof Rain Jacket', sales: 89, revenue: 195711 }
];

// Category breakdown
export const categoryData = [
    { name: 'Accessories', products: 42, revenue: 185000 },
    { name: 'Tents', products: 28, revenue: 320000 },
    { name: 'Backpacks', products: 35, revenue: 245000 },
    { name: 'Footwear', products: 22, revenue: 198000 },
    { name: 'Clothing', products: 18, revenue: 156000 },
    { name: 'Sleeping Gear', products: 11, revenue: 124000 }
];
