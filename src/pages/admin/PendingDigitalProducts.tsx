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

const PendingDigitalProduct = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);

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

  const fetchFiles = async (productId: string) => {
    // try {
    //   const res = await fetch(`/api/files/${productId}`);
    //   const blobs = await res.json();
    //   setFiles(blobs);
    // } catch (error) {
    //   console.error("Failed to fetch files", error);
    // }
  };

  const fetchImages = async (productId: string) => {
    // try {
    //   const res = await fetch(`/api/images/${productId}`);
    //   const imageBlobs = await res.json();
    //   setImages(imageBlobs);
    // } catch (error) {
    //   console.error("Failed to fetch images", error);
    // }
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

  const handleOpenDialog = (product: any) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
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
      <PlatformFilter
        platforms={platforms}
        selectedPlatform={selectedPlatform}
        onChange={(value) => setSelectedPlatform(value)}
      />
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Platform */}
        <select
          value={filters.platform}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, platform: e.target.value }))
          }
        >
          <option value="">All Platforms</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, category: e.target.value }))
          }
        >
          <option value="">All Categories</option>
          {Array.from(new Set(data?.map((p) => p.category))).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Range */}
        <input
          type="number"
          placeholder="Min Price"
          value={filters.priceMin}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceMin: e.target.value }))
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.priceMax}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, priceMax: e.target.value }))
          }
        />

        {/* Stock */}
        <input
          type="number"
          placeholder="Min Stock"
          value={filters.stock}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, stockMin: e.target.value }))
          }
        />
        <div className="space-y-2">
          <Label htmlFor="sortByDate">Sort by Date</Label>
          <Select
            value={filters.sortByDate}
            onValueChange={(value) =>
              setFilters({ ...filters, sortByDate: value })
            }
          >
            <SelectTrigger id="sortByDate">
              <SelectValue placeholder="Sort by date" />
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
            <CardTitle>All Digital Products</CardTitle>
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
                    <TableCell colSpan={6} className="text-center py-10">
                      No digital products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: Product) => (
                    <TableRow key={product.id}>
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

                      <TableCell className="font-medium">
                        {product.platform_name}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        ${parseFloat(product.price.toString()).toFixed(2)}
                      </TableCell>
                      <TableCell>{product.data_format}</TableCell>
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
              <TabsTrigger value="files">Files</TabsTrigger>
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
                        {selectedProduct.platform_name}
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
              <div className="space-y-2 mt-4">
                {files.length > 0 ? (
                  files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <p className="truncate">File {index + 1}</p>
                      <a
                        href={URL.createObjectURL(new Blob([file.data]))}
                        download={`file-${index + 1}`}
                        className="text-blue-600 underline text-sm"
                      >
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No files available.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="images">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(new Blob([image.data]))}
                      alt={`Product Image ${index + 1}`}
                      className="rounded border shadow object-cover w-full max-h-60"
                    />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No images found.
                  </p>
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
