import { useEffect, useMemo, useState } from "react";
import * as products from "@/services/productService";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import ProductDetailsDialog from "@/components/ProductDialogTabs"; // Adjust path as needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Upload,
  FileText,
  Home,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/lib/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Product {
  id: string;
  category: string;
  platform_name: string;
  description: string;
  price: string;
  stock_quantity: number;
  imageUrl?: string;
  important_notice: string;
  data_format: string; // 👈 Required here
  on_homepage?: string;
  date_created?: string;
  homepage_position?: string;
  status: string;
    seen?:string
}

interface Seller {
  seller_id: string;
  email: string;
  fullName: string;
  avatar?: string;
  created_at: Date;
  country?: string;
  phoneNumber?: string;
  preferred_currency?: string;
  verification_status?: string;
  preferred_language?: string;
  acc_status: string;
  wallet_balance: Number;
}

export interface DigitalProduct {
  id: string;
  platform_name: string;
  category: string;
  price: string;
  description: string;
  data_format: string;
  important_notice: string;
  status: string;
  stock_quantity: number;
  on_homepage?: string;
  date_created?: string; // ✅ use this field for filtering
  homepage_position?: string; // ✅ use this field for filtering
}

const updateDigitalProduct = async (id: string, product: Product) => {
  const response = await axios.put(
    `${API_BASE_URL}/digital-products/${id}`,
    product
  );
  return response.data;
};

const deleteDigitalProduct = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/digital-products/${id}`);
  return response.data;
};

const categoryOptions = [
  "Aged Accounts",
  "New Accounts",
  "Verified Accounts",
  "Unverified Accounts",
  "High Activity Accounts",
  "Low Activity Accounts",
];

const platformNameOptions = [
  "Facebook",
  "Instagram",
  "Twitter",
  "TikTok",
  "Snapchat",
  "LinkedIn",
  "Pinterest",
  "YouTube",
  "Reddit",
  "Tumblr",
  "Threads",
  "Discord",
  "Telegram",
  "WhatsApp",
  "WeChat",
  "Clubhouse",
  "BeReal",
  "Mastodon",
  "Vimeo",
  "Quora",
];

const dataFormatOptions = [
  "PDF",
  "ZIP",
  "MP4",
  "MP3",
  "DOCX",
  "EPUB",
  "JPG",
  "PNG",
];

import PlatformFilter from "@/components/PlatformFilter";
import { HomepageToggleDialog } from "./HomepageToggleDialog";
import {
  postProductToHomepage,
  removeProductFromHomepage,
} from "@/services/homepageService";
import { DialogClose } from "@radix-ui/react-dialog";
import { getSellerById } from "@/services/sellersServices";
import { getPlatformImage } from "@/lib/platformImages";

const PendingDigitalProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
   const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    platform: "",
    category: "",
    stock: "",
    priceMin: "",
    priceMax: "",
    sortByDate: "newest", // ✅ default is 'newest'
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const queryClient = useQueryClient();

  const [data, setData] = useState<Product[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedPlatform, setSelectedPlatform] = useState("");

  // Get all unique platforms from data
  const platforms = useMemo(() => {
    const platformSet = new Set(data?.map((p) => p.platform_name));
    return Array.from(platformSet);
  }, [data]);

  useEffect(() => {
    if (selectedProduct?.id) {
      fetchFiles(selectedProduct.id);
      fetchImages(selectedProduct.id);
    }
  }, [selectedProduct]);

 const fetchFiles = async (arr) => {
  setLoading(true);
  try {
    const filePromises = arr.map(async (item) => {
      const response = await fetch(
        `https://aitool.asoroautomotive.com/api/digital-product-file/${item.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const blob = await response.blob();
      const content = await blob.text();
      return {
        id: item.id,
        name: item.file_path,
        type: item.file_type,
        content,
      };
    });

    const result = await Promise.all(filePromises);
    setLoading(false);
    return result;
  } catch (error) {
    setLoading(false);
    console.error("Error fetching files:", error);
    return [];
  }
};
const fetchImages = async (arr) => {
  setLoading(true);
  try {
    const imagePromises = arr.map(async (item) => {
      const response = await fetch(
        `https://aitool.asoroautomotive.com/api/get-product-image/${item.id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const imageSrc = await response.text();
      return imageSrc;
    });

    const imageBlobs = await Promise.all(imagePromises);
    setLoading(false);
    return imageBlobs;
  } catch (error) {
    setLoading(false);
    console.error("Error fetching images:", error);
    return [];
  }
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await products.fetchAllProducts();
        const pendingProducts = fetchedProducts.filter(
          (product) => product.status === "pending"
        );
        setData(pendingProducts);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenDialog = async (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
    showSellerDetails(product.seller_id);

    const fetchedProduct = await products.fetchProductDetails(product.id);
    console.log(fetchedProduct);
    const imageBlobs = await fetchImages(fetchedProduct.images);
    const fileBlobs = await fetchFiles(fetchedProduct.files);
    console.log(imageBlobs);
    console.log(fileBlobs);
    setImages(imageBlobs);
    setFiles(fileBlobs);
  };

  const showSellerDetails = async (sellerId: string) => {
    try {
      if (sellerId === null || sellerId === "admin") {
        setSeller(null);
        return;
      } else {
        const response = await getSellerById(sellerId);
        // console.log(response.seller);
        setSeller(response.seller);
      }
    } catch (error) {
      console.error("Error fetching seller details", error);
    }
  };

  const updateProductMutation = useMutation({
    mutationFn: (productData: Product) =>
      updateDigitalProduct(productData.id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digitalProducts"] });
      toast.success("Digital product updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error("Failed to update product. Ensure to reselect files.");
      // toast.error(error.message || "Failed to update product");
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => deleteDigitalProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digitalProducts"] });
      toast.success("Digital product deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  // Convert Product[] to DigitalProduct[] for type compatibility
  const filteredProducts =
    data
      ?.filter((product) => {
        // ...existing filtering logic
        return (
          product.platform_name
            .toLowerCase()
            .includes(filters.platform.toLowerCase()) &&
          product.category
            .toLowerCase()
            .includes(filters.category.toLowerCase()) &&
          (filters.stock
            ? product.stock_quantity >= parseInt(filters.stock)
            : true) &&
          (filters.priceMin
            ? parseFloat(product.price) >= parseFloat(filters.priceMin)
            : true) &&
          (filters.priceMax
            ? parseFloat(product.price) <= parseFloat(filters.priceMax)
            : true)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.date_created || "").getTime();
        const dateB = new Date(b.date_created || "").getTime();

        return filters.sortByDate === "newest" ? dateB - dateA : dateA - dateB;
      }) || [];

  const handleDeleteProduct = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      deleteProductMutation.mutate(id);
    }
  };

  //   const isMutating =updateProductMutation.isPending

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pending Digital Products
          </h1>
          <p className="text-muted-foreground">
            Manage pending digital products
          </p>
        </div>
      </div>
      {/* <PlatformFilter
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        onChange={(value) => setSelectedPlatform(value)}
      /> */}
    <div className="flex flex-wrap gap-6 mb-6 items-end">
  {/* Platform */}
  <div className="flex flex-col">
    <label htmlFor="platform" className="mb-1 text-sm font-medium text-gray-700">
      Platform
    </label>
    <select
      id="platform"
      value={filters.platform}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, platform: e.target.value }))
      }
      className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">All Platforms</option>
      {platforms.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  </div>

  {/* Category */}
  <div className="flex flex-col min-w-[160px]">
    <label htmlFor="category" className="mb-1 text-sm font-medium text-gray-700">
      Category
    </label>
    <select
      id="category"
      value={filters.category}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, category: e.target.value }))
      }
      className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
    >
      <option value="">All Categories</option>
      {Array.from(new Set(data?.map((p) => p.category))).map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  </div>

  {/* Price Range */}
  <div className="flex gap-3 items-center">
    <div className="flex flex-col">
      <label htmlFor="priceMin" className="mb-1 text-sm font-medium text-gray-700">
        Min Price
      </label>
      <input
        id="priceMin"
        type="number"
        min={0}
        placeholder="Min"
        value={filters.priceMin}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
        }
        className="border rounded-md px-3 py-2 w-20 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>

    <div className="flex flex-col">
      <label htmlFor="priceMax" className="mb-1 text-sm font-medium text-gray-700">
        Max Price
      </label>
      <input
        id="priceMax"
        type="number"
        min={0}
        placeholder="Max"
        value={filters.priceMax}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
        }
        className="border rounded-md px-3 py-2 w-20 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  </div>

 {/* Stock */}
<div className="flex flex-col min-w-[120px]">
  <label htmlFor="stockMin" className="mb-1 text-sm font-medium text-gray-700">
    Min Stock
  </label>
  <input
    id="stockMin"
    type="number"
    min={0}
    placeholder="Stock"
    value={filters.stock || ""}
    onChange={(e) => {
      setFilters((prev) => ({ ...prev, stock: e.target.value }));
    }}
    className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
  />
</div>


  {/* Sort by Date */}
  <div className="flex flex-col min-w-[140px]">
    <label htmlFor="sortByDate" className="mb-1 text-sm font-medium text-gray-700">
      Sort by Date
    </label>
    <Select
      value={filters.sortByDate}
      onValueChange={(value) =>
        setFilters({ ...filters, sortByDate: value })
      }
    >
      <SelectTrigger id="sortByDate" className="w-full">
        <SelectValue placeholder="Newest" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="oldest">Oldest</SelectItem>
      </SelectContent>
    </Select>
  </div>
</div>

      <p className="text-sm text-muted-foreground mb-2">
        Showing <strong>{filteredProducts.length}</strong> of{" "}
        {data?.length ?? 0} product{(data?.length ?? 0) !== 1 ? "s" : ""}
      </p>
<Card className="glass-card">
  <CardHeader className="pb-3">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <CardTitle>All Pending Products</CardTitle>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 md:w-[240px] lg:w-[320px]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  </CardHeader>
  <CardContent>
    {isLoading ? (
      <div className="flex items-center justify-center h-60">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    ) : (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Format</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>On homepage</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-10">
                No digital products found
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product: Product) => (
              <TableRow
                key={product.id}
                className={
                  product.seen === null
                    ? "bg-blue-50 border-l-4 border-blue-600"
                    : ""
                }
              >
                <TableCell className="font-medium">
                  {product.status === "pending" ? (
                    <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                      Pending
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Approved
                    </span>
                  )}
                </TableCell>

                <TableCell className="font-medium flex items-center">
                  <img
                    src={getPlatformImage(product.platform_name)}
                    alt=""
                    className="inline-block h-8 w-8 mr-2"
                  />
                </TableCell>

                <TableCell>{product.category}</TableCell>
                <TableCell>
                  ${parseFloat(product.price.toString()).toFixed(2)}
                </TableCell>

                <TableCell>
                  <span className="truncate max-w-[80px] block text-xs text-gray-800">
                    {product.data_format.length > 10
                      ? `${product.data_format.slice(0, 10)}...`
                      : product.data_format}
                  </span>
                </TableCell>

                <TableCell>{product.stock_quantity || "N/A"}</TableCell>

                <TableCell>
                  {product.on_homepage === "true" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      True
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      False
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(product)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    )}
  </CardContent>
</Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
            <DialogDescription>
              View product details, files, and images.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" className="w-full mt-4">
            <TabsList className="flex flex-wrap gap-2 justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              {/* <TabsTrigger value="files">Files</TabsTrigger> */}
              <TabsTrigger value="images">Images</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              {selectedProduct && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        ID
                      </Label>
                      <p className="font-medium break-all">
                        {selectedProduct.id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Platform
                      </Label>
                      <p className="font-medium">
                        {selectedProduct.platform_name}{" "}
                        <img
                          src={getPlatformImage(selectedProduct.platform_name)}
                          alt=""
                          className="inline-block h-8 w-8 mr-2"
                        />
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Category
                      </Label>
                      <p className="font-medium capitalize">
                        {selectedProduct.category}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Price
                      </Label>
                      <p className="font-medium">
                        ${Number(selectedProduct.price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Stock
                      </Label>
                      <p className="font-medium">
                        {selectedProduct.stock_quantity}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Date
                      </Label>
                      <p className="font-medium">
                        {new Date(
                          selectedProduct.date_created
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Status
                      </Label>
                      <p className="font-medium capitalize">
                        {selectedProduct.status}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Seller Name
                      </Label>
                      <p className="font-medium break-all">
                        {seller ? seller.fullName : "admin"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Seller ID
                      </Label>
                      <p className="font-medium break-all">
                        {selectedProduct.seller_id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Description
                    </Label>
                    <p className="font-medium">{selectedProduct.description}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Data Format
                    </Label>
                    <p className="font-medium">{selectedProduct.data_format}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Important Notice
                    </Label>
                    <p className="font-medium">
                      {selectedProduct.important_notice}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

           <TabsContent value="files">
  <div className="relative p-2 min-h-[200px]">
    {loading && (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )}

    {!loading && files.length === 0 ? (
      <p className="text-sm text-muted-foreground mt-4">No files available.</p>
    ) : (
      <div className="space-y-2 mt-4">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex justify-between items-center"
          >
            <p className="truncate">{file.name}</p>
            <a
              href={file.content}
              download={file.name}
              className="text-blue-600 underline text-sm"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    )}
  </div>
</TabsContent>

<TabsContent value="images">
  <div className="relative p-2 min-h-[200px]">
    {loading && (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )}

    {!loading && images.length === 0 ? (
      <p className="text-sm text-muted-foreground mt-4">No images found.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Product Image ${index + 1}`}
            className="rounded border shadow object-cover w-full h-auto"
          />
        ))}
      </div>
    )}
  </div>
</TabsContent>

          </Tabs>
          {/* Approve Button */}
          {selectedProduct && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch(
                    `https://aitool.asoroautomotive.com/api/products/${selectedProduct.id}/approve`,
                    {
                      method: "PATCH",
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );

                  if (!res.ok) throw new Error("Failed to approve product");

                  alert("Product approved!");
                  setTimeout(() => {
                    window.location.reload()
                  }, 200);
                  setIsDialogOpen(false); // optionally close dialog
                } catch (err) {
                  alert("Error approving product");
                  console.error(err);
                }
              }}
              className="mt-6 w-full py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Approve Product
            </button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingDigitalProduct;
