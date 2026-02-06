// Sample trekking gear products with UUIDs to match Supabase requirements
export const products = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', // Real UUID format
    name: 'Quechua Trek 100 Trekking Shoes',
    category: 'Footwear',
    rentPrice: 150,
    buyPrice: 3999,
    originalPrice: 5499,
    rating: 4.5,
    reviewCount: 128,
    images: [
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
    ],
    description: 'Waterproof trekking shoes designed for mountain trails.',
    highlights: ['Waterproof design', 'Anti-slip sole', 'Ankle support'],
    difficulty: ['Easy', 'Moderate'],
    weather: ['Rain', 'Dry'],
    sizes: ['7', '8', '9', '10', '11'],
    inStock: true,
    specifications: {
      weight: '680g per pair',
      material: 'Full-grain leather',
      waterproof: 'Yes',
      warranty: '2 years',
    },
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Wildcraft Packable Down Jacket',
    category: 'Jackets',
    rentPrice: 250,
    buyPrice: 6999,
    originalPrice: 9999,
    rating: 4.7,
    reviewCount: 95,
    images: [
      'https://images.unsplash.com/photo-1544923246-77307c1b56fd?w=800&q=80',
    ],
    description: 'Lightweight packable down jacket perfect for high-altitude treks.',
    highlights: ['800 fill down', 'Packable design'],
    difficulty: ['Moderate', 'Difficult'],
    weather: ['Snow', 'Cold'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    specifications: {
      weight: '320g',
      material: '700-fill duck down',
    },
  },
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Decathlon Forclaz 50L Backpack',
    category: 'Backpacks',
    rentPrice: 200,
    buyPrice: 4999,
    originalPrice: 6499,
    rating: 4.6,
    reviewCount: 210,
    images: [
      'https://images.unsplash.com/photo-1622260614927-3abf2cfa295c?w=800&q=80',
    ],
    description: '50L trekking backpack with adjustable harness and rain cover.',
    highlights: ['50L capacity', 'Rain cover included'],
    difficulty: ['Easy', 'Moderate', 'Difficult'],
    weather: ['Rain', 'Dry', 'Cold'],
    inStock: true,
    specifications: {
      weight: '1.8kg',
      material: 'Recycled nylon',
    },
  }
];

export default products;
