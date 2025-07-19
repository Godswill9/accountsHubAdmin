import { useEffect, useMemo, useState } from "react";
import * as products from "@/services/productService";
import { getSellerById } from "@/services/sellersServices";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Add this to your global CSS
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
  seller_id?: string;
  homepage_position?: string;
  images?: string[]; // Array of image URLs
    seen?:string
}

export interface DigitalProduct {
  id: string;
  platform_name: string;
  category: string;
  price: string;
  description: string;
  data_format: string;
  important_notice: string;
  stock_quantity: number;
  on_homepage?: string;
  date_created?: string; // ✅ use this field for filtering
  homepage_position?: string; // ✅ use this field for filtering
}

// Internal API functions
const createDigitalProduct = async (formData: FormData) => {
  const response = await axios.post(
    `${API_BASE_URL}/create-digital-products`,
    formData
  );
  return response.data;
};

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
import { getPlatformImage } from "@/lib/platformImages";

const DigitalProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTextFiles, setSelectedTextFiles] = useState<File[]>([]);
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  // const [files, setFiles] = useState<any[]>([]);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    platform: "",
    category: "",
    stock: "",
    priceMin: "",
    priceMax: "",
    sortByDate: "newest", // ✅ default is 'newest'
  });

  const [currentProduct, setCurrentProduct] = useState<Product>({
    id: "",
    category: "",
    platform_name: "",
    description: "",
    price: "",
    stock_quantity: 0,
    imageUrl: "",
    important_notice: "",
    data_format: "",
    seller_id: "",
  });
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

  const handleQuillChange = (value: string) => {
  setCurrentProduct((prev) => ({
    ...prev,
    description: value,
  }));
};


  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProducts = await products.fetchAllProducts();
        fetchedProducts.forEach((item, i)=>{
          // console.log(item)
          updateProductSeen(item.id)
        })
        const validProducts = fetchedProducts.filter(
          (product) => product.status === "approved"
        );
        setData(validProducts);
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentProduct?.id) {
      // fetchFiles(currentProduct.id);
      // fetchImages(currentProduct.id);
    }
  }, [currentProduct]);

//  const fetchFiles = async (arr) => {
//   setLoading(true);
//   try {
//     const filePromises = arr.map(async (item) => {
//       const response = await fetch(
//         `https://aitool.asoroautomotive.com/api/digital-product-file/${item.id}`,
//         {
//           method: "GET",
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const blob = await response.blob();
//       const content = await blob.text();

//       return {
//         id: item.id,
//         name: item.file_path,
//         type: item.file_type,
//         content,
//       };
//     });

//     const result = await Promise.all(filePromises); // wait for all files to finish
//     setLoading(false);
//     return result;
//   } catch (error) {
//     setLoading(false);
//     console.error("Error fetching files:", error);
//     return [];
//   }
// };

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

    const imageBlobs = await Promise.all(imagePromises); // wait before turning off loader
    setLoading(false);
    return imageBlobs;
  } catch (error) {
    setLoading(false);
    console.error("Error fetching images:", error);
    return [];
  }
};

  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => createDigitalProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digitalProducts"] });
      toast.success("Digital product created successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create product");
    },
  });

  const handleProductOpenDialogDetails = async (product: any) => {
    setCurrentProduct(product);
    setIsProductDialogOpen(true);
    showSellerDetails(product.seller_id);

    const fetchedProduct = await products.fetchProductDetails(product.id);
    console.log(fetchedProduct);
    const imageBlobs = await fetchImages(fetchedProduct.images);
    // const fileBlobs = await fetchFiles(fetchedProduct.files);
    console.log(imageBlobs);
    // console.log(fileBlobs);
    setImages(imageBlobs);
    // setFiles(fileBlobs);
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

     const updateProductSeen = async (ProductId: string) => {
    try {
      const response = await axios.put(
        `https://aitool.asoroautomotive.com/api/product-seen/${ProductId}`
      );
      console.log("Product marked as seen:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error marking Product as seen:", error);
    }
  };

  const handleHomepageChange = async (
    productId: string,
    checked: boolean,
    position: number
  ) => {
    if (checked) {
      // If the product should be added to the homepage
      try {
        const response = await axios.post(
          "https://aitool.asoroautomotive.com/api/post-product-to-homepage",
          {
            product_id: productId,
            position: position,
          }
        );

        if (response.status === 201) {
          // Successfully added to homepage
          alert("Product added to the homepage successfully");
          window.location.reload();
        }
      } catch (error) {
        console.error("Error adding product to homepage", error);
      }
    } else {
      // If the product should be removed from the homepage
      try {
        const response = await axios.put(
          `https://aitool.asoroautomotive.com/api/remove-product-from-homepage/${productId}`
        );

        if (response.status === 200) {
          // Successfully removed from homepage
          alert("Product removed from homepage successfully");
          window.location.reload(); // Reload the page to reflect changes
        }
      } catch (error) {
        console.error("Error removing product from homepage", error);
      }
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

  const uploadFilesMutation = useMutation({
    mutationFn: async (formData: FormData) => createDigitalProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digitalProducts"] });
      toast.success("Files uploaded successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload files");
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

  const handleOpenDialogDetails = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        id: "",
        category: "",
        platform_name: "",
        description: "",
        price: "",
        stock_quantity: 0,
        important_notice: "",
        data_format: "",
      });
      setIsEditing(false);
    }
    setSelectedTextFiles(null);
    setSelectedImageFiles(null);
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === "price" || name === "stock_quantity"? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  const handleTextFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];

      const filteredFiles = Array.from(files).filter((file) =>
        allowedTypes.includes(file.type)
      );

      if (filteredFiles.length === 0) {
        toast.error("Only PDF, Word, or TXT files are allowed.");
        setSelectedTextFiles(null);
        return;
      } else {
        setSelectedTextFiles(Array.from(files));
        setCurrentProduct((prev) => ({
          ...prev,
          stock_quantity: files.length,
        })); // Update stock quantity based on number of files
      }
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedImageFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("platform_name", currentProduct.platform_name || "");
    formData.append("category", currentProduct.category || "");
    formData.append("price", currentProduct.price.toString() || "0");
    formData.append("stock_quantity", currentProduct.stock_quantity.toString() || "0");
    formData.append("description", currentProduct.description || "");
    formData.append("data_format", currentProduct.data_format || "");
    formData.append("important_notice", currentProduct.important_notice || "");

    // if (selectedTextFiles.length > 0) {
    //   for (let i = 0; i < selectedTextFiles.length; i++) {
    //     formData.append("text_files", selectedTextFiles[i]);
    //   }
    // }

    if (selectedImageFiles.length > 0) {
      for (let i = 0; i < selectedImageFiles.length; i++) {
        formData.append("image_files", selectedImageFiles[i]);
      }
    }

    createProductMutation.mutate(formData);
  };

  const handleDeleteProduct = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      deleteProductMutation.mutate(id);
    }
  };

  const isMutating =
    createProductMutation.isPending ||
    updateProductMutation.isPending ||
    uploadFilesMutation.isPending;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Digital Products
          </h1>
          <p className="text-muted-foreground">
            Manage digital products and downloadable content
          </p>
        </div>
        {/* <Button onClick={() => handleOpenDialogDetails()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Digital Product
        </Button> */}
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
      value={filters.stock}
      onChange={(e) =>
        setFilters((prev) => ({ ...prev, stock: e.target.value }))
      }
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
              <TableCell colSpan={7} className="text-center py-10">
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
                    onClick={() => handleProductOpenDialogDetails(product)}
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
                  <HomepageToggleDialog
                    productName={product.platform_name}
                    isOnHomepage={product.on_homepage === "true"}
                    position={parseInt(product.homepage_position)}
                    onSubmit={(checked, position) =>
                      handleHomepageChange(product.id!, checked, position)
                    }
                    triggerElement={
                      <Button variant="ghost" size="icon">
                        <Home className="w-4 h-4" />
                      </Button>
                    }
                  />
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
        <DialogContent className="max-w-2xl w-full mx-auto overflow-y-auto max-h-[90vh] p-6">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Digital Product" : "Add New Digital Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Make changes to the digital product below"
                : "Fill in the details for the new digital product"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {/* <div className="space-y-2 md:col-span-2">
                <Label htmlFor="platform_name">Product Name</Label>
                <Input
                  id="platform_name"
                  name="platform_name"
                  value={currentProduct.platform_name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="platform_name">Platform Name</Label>
                <Select
                  value={currentProduct.platform_name}
                  onValueChange={(value) =>
                    handleSelectChange("platform_name", value)
                  }
                >
                  <SelectTrigger id="platformName">
                    <SelectValue placeholder="Select platform name" />
                  </SelectTrigger>
                  <SelectContent>
                    {platformNameOptions.map((platformName) => (
                      <SelectItem key={platformName} value={platformName}>
                        {platformName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={currentProduct.category}
                  onValueChange={(value) =>
                    handleSelectChange("category", value)
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={currentProduct.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Quantity</Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  step="1"
                  min="0"
                  value={currentProduct.stock_quantity}
                  onChange={handleInputChange}
                  placeholder="Enter quantity"
                  required
                />
              </div>
              {/* <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={currentProduct.description}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </div> */}
            <div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <ReactQuill
    theme="snow"
    value={currentProduct.description}
    onChange={handleQuillChange}
    placeholder="Enter product description"
    className="min-h-[200px] bg-white"
  />
</div>

              <div className="space-y-2">
                <Label htmlFor="data_format">Data Format</Label>
                <Textarea
                  id="data_format"
                  name="data_format"
                  value={currentProduct.data_format}
                  onChange={handleInputChange}
                  placeholder="Enter data format"
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="important_notice">Important Notice</Label>
                <Input
                  id="important_notice"
                  name="important_notice"
                  value={currentProduct.important_notice}
                  onChange={handleInputChange}
                  placeholder="Any important information"
                  required
                />
              </div>
              {/* <div className="space-y-2 md:col-span-2">
                <Label htmlFor="files">Upload Files</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="files"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <Input
                          id="files"
                          name="files"
                          type="file"
                          multiple
                          onChange={handleTextFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, WORD or TXT files
                    </p>
                  </div>
                </div>
                {selectedFiles && selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedFiles.length} file(s) selected
                    </p>
                    <ul className="mt-1 text-xs text-gray-500 list-disc pl-5">
                      {Array.from(selectedFiles).map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div> */}

              <div>
                <Label htmlFor="imageFiles">
                  Upload Account Images/Screenshots
                </Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="imageFiles"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                      >
                        <span>Upload Images</span>
                        <Input
                          id="imageFiles"
                          name="imageFiles"
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageFileChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      Upload up to 10mb of images
                    </p>
                  </div>
                </div>
                {selectedImageFiles && selectedImageFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {selectedImageFiles.length} file(s) selected
                    </p>
                    <ul className="mt-1 text-xs text-gray-500 list-disc pl-5">
                      {selectedImageFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock quantity</Label>:
                <span> {currentProduct.stock_quantity} accounts available</span>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isMutating}>
                {isMutating
                  ? "Processing..."
                  : isEditing
                  ? "Update Product"
                  : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
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
              {currentProduct && (
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        ID
                      </Label>
                      <p className="font-medium break-all">
                        {currentProduct.id}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Platform
                      </Label>
                      <p className="font-medium">
                        {currentProduct.platform_name}{" "}
                        <img
                          src={getPlatformImage(currentProduct.platform_name)}
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
                        {currentProduct.category}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Price
                      </Label>
                      <p className="font-medium">
                        ${Number(currentProduct.price).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Stock
                      </Label>
                      <p className="font-medium">
                        {currentProduct.stock_quantity}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Date
                      </Label>
                      <p className="font-medium">
                        {new Date(
                          currentProduct.date_created
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    {/* <div>
                            <Label className="text-sm text-muted-foreground">
                              Status
                            </Label>
                            <p className="font-medium capitalize">
                              {currentProduct.status}
                            </p>
                          </div> */}
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
                        {currentProduct.seller_id}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Description
                    </Label>
                     <p className="font-medium"
                      dangerouslySetInnerHTML={{ __html: currentProduct.description }}
                    ></p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Data Format
                    </Label>
                    <p className="font-medium">{currentProduct.data_format}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Important Notice
                    </Label>
                    <p className="font-medium">
                      {currentProduct.important_notice}
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

    {/* {files.length > 0 ? (
      <div className="space-y-2 mt-4">
        {files.map((file, index) => (
          <div key={index} className="flex justify-between items-center">
            <p className="truncate">{file.name}</p>
            <a
              href={file.content}
              download={file.name}
              className="text-sm text-blue-600 underline"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    ) : (
      !loading && (
        <p className="text-sm text-muted-foreground mt-4">No files available.</p>
      )
    )} */}
  </div>
</TabsContent>


          <TabsContent value="images">
  <div className="relative p-2 min-h-[200px]">
    {loading && (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )}

    {images.length > 0 ? (
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
    ) : (
      !loading && (
        <p className="text-sm text-muted-foreground mt-4">No images found.</p>
      )
    )}
  </div>
</TabsContent>

          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DigitalProductsPage;
