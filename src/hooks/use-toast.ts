
// Re-exporting toast hooks and functions from sonner
import { toast } from "sonner";

// Create a wrapper to provide consistent API
export { toast };

export function useToast() {
  return {
    toast,
    // Add empty toasts array to match the expected interface
    toasts: []
  };
}
