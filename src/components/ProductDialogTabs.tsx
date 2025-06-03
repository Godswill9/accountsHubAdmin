import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

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

interface ProductDetailsDialogProps {
  isDialogOpen: boolean; // Change prop name here
  setIsDialogOpen: (open: boolean) => void; // Change prop name here
  product: any;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  product,
}) => {
  const [files, setFiles] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log(isDialogOpen);
    if (product?.id) {
      fetchFiles(product.id);
      fetchImages(product.id);
    }
  }, [product]);

  const fetchFiles = async (productId) => {
    console.log(productId);
    // try {
    //   const res = await fetch(`/api/files/${productId}`);
    //   const blobs = await res.json();
    //   setFiles(blobs);
    // } catch (error) {
    //   console.error("Failed to fetch files", error);
    // }
  };

  const fetchImages = async (productId) => {
    console.log(productId);
    // try {
    //   const res = await fetch(`/api/images/${productId}`);
    //   const imageBlobs = await res.json();
    //   setImages(imageBlobs);
    // } catch (error) {
    //   console.error("Failed to fetch images", error);
    // }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
          <DialogDescription>
            View product details, files, and images.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full mt-4">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            {product && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>ID</Label>
                    <p className="font-medium break-all">{product.id}</p>
                  </div>
                  <div>
                    <Label>Platform</Label>
                    <p className="font-medium">{product.platform_name}</p>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p className="font-medium capitalize">{product.category}</p>
                  </div>
                  <div>
                    <Label>Price</Label>
                    <p className="font-medium">
                      ${Number(product.price).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label>Stock</Label>
                    <p className="font-medium">{product.stock_quantity}</p>
                  </div>
                  <div>
                    <Label>Date</Label>
                    <p className="font-medium">
                      {new Date(product.date_created).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <p className="font-medium capitalize">{product.status}</p>
                  </div>
                  <div>
                    <Label>Seller ID</Label>
                    <p className="font-medium break-all">{product.seller_id}</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="font-medium">{product.description}</p>
                </div>
                <div>
                  <Label>Data Format</Label>
                  <p className="font-medium">{product.data_format}</p>
                </div>
                <div>
                  <Label>Important Notice</Label>
                  <p className="font-medium">{product.important_notice}</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="files">
            <div className="space-y-2">
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
            <div className="grid grid-cols-2 gap-4">
              {images.length > 0 ? (
                images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(new Blob([image.data]))}
                    alt={`Product Image ${index + 1}`}
                    className="rounded border shadow"
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
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
