
import { useEffect, useState } from "react";
import {
  getDigitalProducts,
  createDigitalProduct,
  updateDigitalProduct,
  deleteDigitalProduct,
  Product,
  DigitalProduct,
} from "@/services/digitalProductsService";
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
import { Search, Plus, Edit, Trash2, Upload, FileText } from "lucide-react";
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

const categoryOptions = [
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

const DigitalProductsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<DigitalProduct>({
    platform_name: "",
    category: "",
    price: 0,
    description: "",
    data_format: "",
    important_notice: "",
    stock_quantity: 0,
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ["digitalProducts"],
    queryFn: getDigitalProducts,
  });

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

  const updateProductMutation = useMutation({
    mutationFn: (productData: DigitalProduct) =>
      updateDigitalProduct(productData.id!, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digitalProducts"] });
      toast.success("Digital product updated successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
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
    mutationFn: async (formData: FormData) => {
      return await createDigitalProduct(formData);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["digitalProducts"] });
      toast.success("Files uploaded successfully");
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload files");
    },
  });

  // Convert Product[] to DigitalProduct[] for type compatibility
  const filteredProducts = data 
    ? data
        .filter(
          (product) =>
            product.platform_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((product): DigitalProduct => ({
          id: product.id,
          platform_name: product.platform_name,
          category: product.category,
          price: product.price,
          description: product.description,
          data_format: product.data_format || "",
          important_notice: product.important_notice || "",
          stock_quantity: product.stock_quantity,
          on_homepage: product.on_homepage,
          created_at: product.created_at,
        }))
    : [];

  const handleOpenDialog = (product?: DigitalProduct) => {
    if (product) {
      setCurrentProduct(product);
      setIsEditing(true);
    } else {
      setCurrentProduct({
        platform_name: "",
        category: "",
        price: 0,
        description: "",
        data_format: "",
        important_notice: "",
        stock_quantity: 0,
      });
      setIsEditing(false);
    }
    setSelectedFiles(null);
    setIsDialogOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setCurrentProduct({
      ...currentProduct,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setSelectedFiles(null);
        setCurrentProduct((prev) => ({
          ...prev,
          stock_quantity: 0,
        }));
        return;
      }

      setSelectedFiles(files);

      setCurrentProduct((prev) => ({
        ...prev,
        stock_quantity: filteredFiles.length,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("platform_name", currentProduct.platform_name || "");
    formData.append("category", currentProduct.category || "");
    formData.append("price", currentProduct.price.toString() || "0");
    formData.append("description", currentProduct.description || "");
    formData.append("data_format", currentProduct.data_format || "");
    formData.append("important_notice", currentProduct.important_notice || "");

    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
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
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Digital Product
        </Button>
      </div>

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
                    <TableCell colSpan={6} className="text-center py-10">
                      No digital products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product: DigitalProduct) => (
                    <TableRow key={product.id}>
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
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
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
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="platform_name">Product Name</Label>
                <Input
                  id="platform_name"
                  name="platform_name"
                  value={currentProduct.platform_name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
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
              <div className="space-y-2 md:col-span-2">
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
              <div className="space-y-2 md:col-span-2">
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
                          onChange={handleFileChange}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_quantity">Stock quantity</Label>:
                <span> {currentProduct.stock_quantity} items selected</span>
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
    </div>
  );
};

export default DigitalProductsPage;
