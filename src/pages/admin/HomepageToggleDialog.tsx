import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HomepageToggleDialogProps {
  triggerElement: React.ReactNode;
  productName: string;
  isOnHomepage: boolean;
  position: number; // Adding position here to handle it
  onSubmit: (checked: boolean, position: number) => void; // Handling position in onSubmit
}

export function HomepageToggleDialog({
  triggerElement,
  productName,
  isOnHomepage,
  position,
  onSubmit,
}: HomepageToggleDialogProps) {
  const [checked, setChecked] = useState(isOnHomepage);

  return (
    <Dialog>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Homepage Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm">
            Add or remove <strong>{productName}</strong> from the homepage.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="homepage-checkbox"
              checked={checked}
              onCheckedChange={(value) => setChecked(!!value)}
            />
            <label htmlFor="homepage-checkbox" className="text-sm">
              Show on Homepage
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onSubmit(checked, position)}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
