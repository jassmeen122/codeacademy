
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface PayPalButtonProps {
  amount: number;
  courseId: string;
  courseTitle: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
}

export const PayPalButton = ({ 
  amount, 
  courseId, 
  courseTitle, 
  onSuccess, 
  onError 
}: PayPalButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would redirect to PayPal or load the PayPal SDK
      // For this demo, we'll simulate a successful payment
      toast.success("PayPal payment successful!");
      console.log(`Payment of $${amount} for course "${courseTitle}" (${courseId}) processed`);
      
      // Mock payment details object
      const paymentDetails = {
        id: `PAY-${Math.random().toString(36).substr(2, 9)}`,
        status: "COMPLETED",
        purchase_units: [{
          reference_id: courseId,
          description: courseTitle,
          amount: {
            value: amount.toString(),
            currency_code: "USD"
          }
        }],
        payer: {
          email_address: "student@example.com"
        },
        create_time: new Date().toISOString()
      };
      
      // Call the success callback if provided
      if (onSuccess) {
        onSuccess(paymentDetails);
      }
    } catch (error) {
      console.error("PayPal payment error:", error);
      toast.error("Payment failed. Please try again.");
      
      // Call the error callback if provided
      if (onError) {
        onError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {loading ? "Processing..." : `Pay $${amount} with PayPal`}
    </Button>
  );
};
