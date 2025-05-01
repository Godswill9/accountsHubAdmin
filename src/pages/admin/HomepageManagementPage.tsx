import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductService } from "@/services/productService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpDown, Check, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { ProductData } from "@/types/admin";

export type HomepageProduct = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  featured: boolean;
  position: number;
};

const HomepageManagementPage = () => {
  const [products, setProducts] = useState<HomepageProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<HomepageProduct | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [heroContent, setHeroContent] = useState({
    title: "Welcome to our Digital Products Store",
    subtitle: "Find the best digital products for your needs",
    buttonText: "Shop Now",
    imageUrl: "/hero-image.jpg"
  });
  const [announcements, setAnnouncements] = useState([
    { id: "1", text: "New products added weekly!", active: true },
    { id: "2", text: "Summer sale: 20% off all products", active: true },
    { id: "3", text: "Free support for all purchases", active: false }
  ]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await ProductService.getFeaturedProducts();
        
        const featuredProducts = response.products.map((product, index) => ({
          ...product,
          position: index + 1,
          imageUrl: product.imageUrl || "/placeholder.svg",
          price: typeof product.price === 'number' ? product.price.toString() : product.price
        })) as HomepageProduct[];
        
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const handleAddProduct = () => {
    setEditingProduct({
      id: "",
      name: "",
      description: "",
      imageUrl: "",
      price: "",
      featured: true,
      position: products.length + 1
    });
    setIsModalOpen(true);
  };
  
  const handleEditProduct = (product: HomepageProduct) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  
  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    setIsSaving(true);
    try {
      if (editingProduct.id) {
        const productForApi = {
          ...editingProduct,
          price: parseFloat(editingProduct.price)
        };
        await ProductService.updateProductOnHomepage(editingProduct.id, productForApi);
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      } else {
        const productForApi = {
          ...editingProduct,
          price: parseFloat(editingProduct.price)
        };
        const response = await ProductService.postProductToHomepage(productForApi);
        const newProduct = { 
          ...response.product, 
          position: products.length + 1,
          price: typeof response.product.price === 'number' ? response.product.price.toString() : response.product.price 
        } as HomepageProduct;
        setProducts([...products, newProduct]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleRemoveProduct = async (id: string) => {
    try {
      await ProductService.removeProductFromHomepage(id);
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to remove product:", error);
    }
  };
  
  const handleMoveProduct = (id: string, direction: 'up' | 'down') => {
    const currentIndex = products.findIndex(p => p.id === id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === products.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newProducts = [...products];
    
    [newProducts[currentIndex], newProducts[newIndex]] = [newProducts[newIndex], newProducts[currentIndex]];
    
    newProducts.forEach((product, index) => {
      product.position = index + 1;
    });
    
    setProducts(newProducts);
  };
  
  const handleSaveHero = () => {
    console.log("Saving hero content:", heroContent);
  };
  
  const handleToggleAnnouncement = (id: string) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ));
  };
  
  const handleSaveAnnouncements = () => {
    console.log("Saving announcements:", announcements);
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Homepage Management</h1>
      
      <Tabs defaultValue="featured-products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="featured-products">Featured Products</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>
        
        <TabsContent value="featured-products">
          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>
                Manage the products that appear on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Button onClick={handleAddProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : products.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Position</th>
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Price</th>
                        <th className="p-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="p-2">{product.position}</td>
                          <td className="p-2">{product.name}</td>
                          <td className="p-2">{product.price}</td>
                          <td className="p-2 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMoveProduct(product.id, 'up')}
                                disabled={product.position === 1}
                              >
                                <ArrowUpDown className="h-4 w-4 rotate-90" />
                                <span className="sr-only">Move up</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleMoveProduct(product.id, 'down')}
                                disabled={product.position === products.length}
                              >
                                <ArrowUpDown className="h-4 w-4 -rotate-90" />
                                <span className="sr-only">Move down</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRemoveProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No featured products. Click "Add Product" to add one.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Configure the main hero section on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input 
                    value={heroContent.title} 
                    onChange={(e) => setHeroContent({...heroContent, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subtitle</label>
                  <Input 
                    value={heroContent.subtitle} 
                    onChange={(e) => setHeroContent({...heroContent, subtitle: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button Text</label>
                  <Input 
                    value={heroContent.buttonText} 
                    onChange={(e) => setHeroContent({...heroContent, buttonText: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <Input 
                    value={heroContent.imageUrl} 
                    onChange={(e) => setHeroContent({...heroContent, imageUrl: e.target.value})}
                  />
                </div>
                <div className="pt-4">
                  <Button onClick={handleSaveHero}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>
                Manage the announcement banners that appear on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <div key={announcement.id} className="flex items-center gap-4 p-3 border rounded-md">
                    <div className="flex-1">
                      <Input 
                        value={announcement.text} 
                        onChange={(e) => {
                          setAnnouncements(announcements.map(a => 
                            a.id === announcement.id ? { ...a, text: e.target.value } : a
                          ));
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Active</span>
                      <Button 
                        variant={announcement.active ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToggleAnnouncement(announcement.id)}
                      >
                        {announcement.active && <Check className="h-4 w-4 mr-1" />}
                        {announcement.active ? "Yes" : "No"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setAnnouncements(announcements.filter(a => a.id !== announcement.id));
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setAnnouncements([
                      ...announcements, 
                      { 
                        id: Math.random().toString(36).substring(2, 9), 
                        text: "New announcement", 
                        active: true 
                      }
                    ]);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Announcement
                </Button>
                
                <div className="pt-4">
                  <Button onClick={handleSaveAnnouncements}>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct.id ? "Edit Product" : "Add Product"}
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input 
                  value={editingProduct.name} 
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  value={editingProduct.description} 
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input 
                  value={editingProduct.price} 
                  onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <Input 
                  value={editingProduct.imageUrl} 
                  onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProduct}
                disabled={isSaving}
              >
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomepageManagementPage;
