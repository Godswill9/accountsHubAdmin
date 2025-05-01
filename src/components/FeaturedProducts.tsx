
import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFeaturedProducts,
  Product,
} from "@/services/digitalProductsService";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExternalLink, ShoppingCart } from "lucide-react";

const FeaturedProducts = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeaturedProducts,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden border border-border">
            <div className="relative">
              <Skeleton className="h-48 w-full" />
            </div>
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
            <CardFooter className="border-t border-border pt-4 flex justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          Unable to load featured products. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {products &&
        Object.entries(products).flatMap(
          ([platform, productArray]) =>
            Array.isArray(productArray)
              ? productArray.map((product: Product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden border border-border h-full flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <div className="h-48 bg-muted flex items-center justify-center">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
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
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Category: {platform}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3">
                        {product.description}
                      </p>
                    </CardContent>
                    <CardFooter className="border-t border-border pt-4 flex justify-between items-center">
                      <span className="font-semibold text-lg">
                        {product.price}
                      </span>
                      <div className="flex gap-2">
                        <Link
                          to={`/digital-products/${product.id}`}
                          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Details
                        </Link>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              : [] // Ensure we only process arrays
        )}
    </div>
  );
};

export default FeaturedProducts;
