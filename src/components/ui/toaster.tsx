
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster 
      position="bottom-right"
      closeButton
      richColors
      expand={false}
      duration={4000}
    />
  );
}
