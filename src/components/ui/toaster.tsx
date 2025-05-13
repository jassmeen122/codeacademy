
import { Toaster as SonnerToaster } from "sonner";

// Create a simple wrapper component for Sonner's Toaster
export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      closeButton
      richColors
    />
  );
}
