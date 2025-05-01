
// Type definition for Digital Products
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  category: string;
  featured: boolean;
  platform_name: string;
  data_format?: string;
  important_notice?: string;
  stock_quantity?: number;
  on_homepage?: string;
  created_at?: string;
  date_created?: string;
  homepage_position?: number;
  updated_at?: string | null;
}

// For compatibility with DigitalProductsPage component
export interface DigitalProduct {
  id?: string;
  platform_name: string;
  category: string;
  price: number | string;
  description: string;
  stock_quantity?: number;
  data_format: string;
  important_notice: string;
  files?: File[];
  on_homepage?: string;
  created_at?: string;
}

// Fetch featured products for homepage display
export const fetchFeaturedProducts = async (): Promise<Record<string, Product[]>> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const products = {
    "Instagram": [
      {
        id: "insta-1",
        name: "Instagram Premium Account",
        description: "High-quality Instagram account with 10K+ followers and engagement history.",
        price: "$99.99",
        imageUrl: "/placeholder.svg",
        category: "Instagram",
        featured: true,
        platform_name: "Instagram Premium Account"
      }
    ],
    "Twitter": [
      {
        id: "twitter-1",
        name: "Twitter Verified Account",
        description: "Established Twitter account with verification and 5K+ followers.",
        price: "$149.99",
        imageUrl: "/placeholder.svg",
        category: "Twitter",
        featured: true,
        platform_name: "Twitter Verified Account"
      }
    ],
    "Facebook": [
      {
        id: "fb-1",
        name: "Facebook Page",
        description: "Facebook business page with 15K likes and active audience.",
        price: "$129.99",
        imageUrl: "/placeholder.svg",
        category: "Facebook",
        featured: true,
        platform_name: "Facebook Page"
      }
    ]
  };
  
  return products;
};

// Mock implementation of product data
const mockDigitalProducts: Product[] = [
  {
    id: "dp-1",
    name: "Instagram Premium Account",
    platform_name: "Instagram Premium Account",
    description: "High-quality Instagram account with 10K+ followers.",
    price: 99.99,
    category: "Instagram",
    featured: true,
    data_format: "PDF with login credentials",
    important_notice: "Access provided within 24 hours",
    stock_quantity: 5,
    on_homepage: "true",
    created_at: new Date().toISOString()
  },
  {
    id: "dp-2",
    name: "Twitter Verified Account",
    platform_name: "Twitter Verified Account",
    description: "Established Twitter account with verification.",
    price: 149.99,
    category: "Twitter",
    featured: true,
    data_format: "PDF with login credentials",
    important_notice: "Access provided within 24 hours",
    stock_quantity: 3,
    on_homepage: "false",
    created_at: new Date().toISOString()
  }
];

// Get all digital products
export const getDigitalProducts = async (): Promise<Product[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return [...mockDigitalProducts];
};

// Create a new digital product
export const createDigitalProduct = async (formData: FormData): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, you would send this formData to your backend
  const files = formData.getAll('files');
  
  // Create a new product with the form data
  const newProduct: Product = {
    id: `dp-${Date.now()}`,
    name: formData.get('platform_name') as string,
    platform_name: formData.get('platform_name') as string,
    description: formData.get('description') as string,
    price: parseFloat(formData.get('price') as string),
    category: formData.get('category') as string,
    featured: false,
    data_format: formData.get('data_format') as string,
    important_notice: formData.get('important_notice') as string,
    stock_quantity: files.length,
    on_homepage: "false",
    created_at: new Date().toISOString()
  };
  
  // Add to mock data
  mockDigitalProducts.push(newProduct);
  
  return newProduct;
};

// Update an existing digital product
export const updateDigitalProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const productIndex = mockDigitalProducts.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new Error("Product not found");
  }
  
  // Update product
  mockDigitalProducts[productIndex] = {
    ...mockDigitalProducts[productIndex],
    ...productData
  };
  
  return mockDigitalProducts[productIndex];
};

// Delete a digital product
export const deleteDigitalProduct = async (id: string): Promise<{ success: boolean }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const productIndex = mockDigitalProducts.findIndex(product => product.id === id);
  
  if (productIndex === -1) {
    throw new Error("Product not found");
  }
  
  // Remove from mock data
  mockDigitalProducts.splice(productIndex, 1);
  
  return { success: true };
};

// Fetch product details by ID
export const fetchProductDetails = async (id: string): Promise<Product> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Look for the product in our mock data first
  const product = mockDigitalProducts.find(p => p.id === id);
  
  if (product) {
    return product;
  }
  
  // If not found in mock data, return a default product
  return {
    id,
    name: "Premium Social Media Account",
    platform_name: "Premium Social Media Account",
    description: "High-quality account with verified status and active followers. Perfect for businesses or influencers looking to establish presence quickly.",
    price: "$129.99",
    imageUrl: "/placeholder.svg",
    category: "Instagram",
    featured: true,
    data_format: "PDF with login credentials",
    important_notice: "Access provided within 24 hours",
    stock_quantity: 3
  };
};

// Export the service object for backward compatibility
export const digitalProductsService = {
  fetchFeaturedProducts,
  fetchProductDetails,
  getDigitalProducts,
  createDigitalProduct,
  updateDigitalProduct,
  deleteDigitalProduct
};
