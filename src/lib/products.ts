export interface Product {
  id: string;
  label: string;
  price: number;
  description: string;
  photoUrl: string;
  rating: number;
  category: string;
  stock: boolean;
}

export type FetchProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: "price_asc" | "price_desc";
};

export type FetchProductsResponse = {
  items: Product[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

const sampleData: Product[] = [
  {
    id: "1",
    label: "Apple iPhone 17",
    price: 1000,
    description: "A phone that will steal your soul",
    category: "Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    stock: true
  },
  {
    id: "2",
    label: "Samsung Galaxy Z Ultra Fold",
    price: 1200,
    description: "A phone that folds reality itself",
    category: "Foldable",
    photoUrl: "https://images.unsplash.com/photo-1512499617640-c2f999018b72?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: true
  },
  {
    id: "3",
    label: "Google Pixel 9 Pro",
    price: 950,
    description: "AI-powered camera that judges your photography",
    category: "Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: true
  },
  {
    id: "4",
    label: "OnePlus 12 Turbo",
    price: 800,
    description: "Fast enough to make your old phone cry",
    category: "Gaming Phone",
    photoUrl: "https://images.unsplash.com/photo-1510557880182-3d4d3e6f4ee7?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: true
  },
  {
    id: "5",
    label: "Xiaomi Mi Ultra X",
    price: 650,
    description: "Flagship power, budget chaos",
    category: "Budget Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1523475496153-3d6cc3a6d9ba?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: true
  },
  {
    id: "6",
    label: "Sony Xperia Vision Pro",
    price: 1100,
    description: "Made for cinematic addiction",
    category: "Premium Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1519666213636-6ccf1e8c91e4?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: false
  },
  {
    id: "7",
    label: "Nothing Phone 3",
    price: 700,
    description: "It literally lights up your life",
    category: "Midrange Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: true
  },
  {
    id: "8",
    label: "Motorola Edge Xtreme",
    price: 600,
    description: "Edge-to-edge performance, edge-to-edge regret",
    category: "Midrange Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
    rating: 3,
    stock: true
  },
  {
    id: "9",
    label: "Huawei P70 Pro Max",
    price: 900,
    description: "Photography from another dimension",
    category: "Camera Smartphone",
    photoUrl: "https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    stock: true
  },
  {
    id: "10",
    label: "Asus ROG Phone 9",
    price: 1050,
    description: "Built for gamers who forgot sunlight exists",
    category: "Gaming Phone",
    photoUrl: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    stock: true
  },
  {
    id: "11",
    label: "Nokia 3310 Reborn Ultra",
    price: 300,
    description: "Still unbreakable. Still judging you.",
    category: "Classic Phone",
    photoUrl: "https://images.unsplash.com/photo-1496180727794-817822f65950?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    stock: true
  }
];

export const categories = [
  "All categories",
  ...Array.from(new Set(sampleData.map((product) => product.category))).sort(),
];

export const fetchProductById = (id: string) => {
  return sampleData.find((product) => product.id === id) ?? null;
};

export const fetchProducts = async ({search, category, sort, page = 1, limit = 10}: FetchProductsParams) => {
  // simulate network delay
  await new Promise((res) => setTimeout(res, 400));

  let data = [...sampleData];

  if (search) {
    data = data.filter((p) =>
      p.label.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== "All categories") {
    data = data.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (sort === "price_asc") {
    data.sort((a, b) => a.price - b.price);
  }

  if (sort === "price_desc") {
    data.sort((a, b) => b.price - a.price);
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedItems = data.slice(start, end);

  return {
    items: paginatedItems,
    page,
    limit,
    total: data.length,
    hasMore: end < data.length,
  };
}
