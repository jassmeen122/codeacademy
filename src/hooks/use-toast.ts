
// Re-exporting toast hooks and functions from sonner
import { toast } from "sonner";

// Create a wrapper to provide consistent API with both sonner and shadcn UI toast
export { toast };

export function useToast() {
  return {
    toast
  };
}
