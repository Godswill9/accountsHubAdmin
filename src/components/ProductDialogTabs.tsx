import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog"; // Example import, depending on your UI library

interface ProductDetailsDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  product: any;
}

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({
  isDialogOpen,
  setIsDialogOpen,
  product,
}) => {
  // Handle opening/closing the dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false); // Close dialog when triggered
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-3xl">
        etr
        {/* Add your content, tabs, and data here */}
        <button onClick={handleDialogClose}>Close</button>{" "}
        {/* Close button to trigger onClose */}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
