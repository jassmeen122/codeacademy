
// Re-exporting toast from Sonner directly
import { toast } from "sonner";

export { toast };

export const useToast = () => {
  return {
    toast
  };
};
