
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { getDigitalProducts, Product as DigitalProductType } from "@/services/digitalProductsService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Filter, ExternalLink, ShoppingCart } from "lucide-react";

// Rename this interface to avoid conflict with the imported one
export interface ProductDisplay {
  id: string;
  category: string;
  data_format: string;
  date_created: string;
  description: string;
  homepage_position: number;
  important_notice: string;
  on_homepage: boolean | string;
  platform_name: string;
  price: number | string;
  stock_quantity: number;
  imageUrl: string;
  updated_at?: string | null;
}

const DigitalProducts = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const [filterQuery, setFilterQuery] = useState(searchQuery);
  const [activeCategory, setActiveCategory] = useState("all");

  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: getDigitalProducts,
  });

  useEffect(() => {
    document.title = "All Digital Products";
    setFilterQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Apply the filter from the input field
  };

  const filterProducts = (products: DigitalProductType[] | undefined) => {
    if (!products) return [];

    return products.filter((product) => {
      const matchesSearch =
        filterQuery.trim() === "" ||
        product.platform_name
          .toLowerCase()
          .includes(filterQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(filterQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "all" ||
        product.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  };

  const filteredProducts = filterProducts(products);

  const categories = [
    { id: "all", name: "All" },
    { id: "facebook", name: "Facebook" },
    { id: "instagram", name: "Instagram" },
    { id: "twitter", name: "Twitter" },
    { id: "tiktok", name: "TikTok" },
    { id: "snapchat", name: "Snapchat" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "pinterest", name: "Pinterest" },
    { id: "youtube", name: "YouTube" },
    { id: "reddit", name: "Reddit" },
    { id: "tumblr", name: "Tumblr" },
    { id: "threads", name: "Threads" },
    { id: "discord", name: "Discord" },
    { id: "telegram", name: "Telegram" },
    { id: "whatsapp", name: "WhatsApp" },
    { id: "wechat", name: "WeChat" },
    { id: "clubhouse", name: "Clubhouse" },
    { id: "bereal", name: "BeReal" },
    { id: "mastodon", name: "Mastodon" },
    { id: "vimeo", name: "Vimeo" },
    { id: "quora", name: "Quora" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <div className="bg-hero-pattern text-white py-8 md:py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">
              Digital Products Marketplace
            </h1>
            <p className="text-center text-white/80 mt-2 max-w-2xl mx-auto">
              Browse our collection of premium digital products for creators and
              businesses
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and filter section */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </form>

            <div className="flex items-center gap-2 overflow-x-auto py-1 md:py-0">
              <Filter className="h-5 w-5 text-gray-500 hidden md:inline" />
              <span className="text-sm text-gray-500 whitespace-nowrap hidden md:inline">
                Categories:
              </span>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`text-sm px-3 py-1 rounded-full whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products listing */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="overflow-hidden border border-border">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-24" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : error ? (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                Unable to load products. Please try again later.
              </AlertDescription>
            </Alert>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">
                No products found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search or filter to find what you're looking
                for.
              </p>
              <button
                onClick={() => {
                  setFilterQuery("");
                  setActiveCategory("all");
                }}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden border border-border h-full flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <div className="h-48 bg-muted flex items-center justify-center">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.platform_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-muted-foreground">
                          No image available
                        </div>
                      )}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {product.platform_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {product.description}
                    </p>
                  </CardContent>
                  <CardFooter className="border-t pt-4 flex justify-between items-center">
                    <span className="font-semibold">{product.price}</span>
                    <div className="flex gap-2">
                      <Link
                        to={`/digital-products/${product.id}`}
                        className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Details
                      </Link>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded-md text-xs flex items-center">
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DigitalProducts;
