import { useState, useCallback, useRef, useEffect } from "react";
import { 
  initiatePayment, 
  checkPaymentStatus, 
  validatePhoneNumber,
  KPayPaymentRequest,
  KPayPaymentResponse 
} from "@/lib/kpay";

export type PaymentStatus = "idle" | "initiating" | "pending" | "polling" | "success" | "failed" | "cancelled";

export interface UseKPayPaymentReturn {
  status: PaymentStatus;
  transactionId: string | null;
  error: string | null;
  
  // Actions
  startPayment: (request: Omit<KPayPaymentRequest, "reference">) => Promise<boolean>;
  checkStatus: () => Promise<KPayPaymentResponse | null>;
  cancelPayment: () => void;
  reset: () => void;
  
  // Validation
  validatePhone: (phone: string) => { valid: boolean; error?: string };
}

export function useKPayPayment(): UseKPayPaymentReturn {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const attemptRef = useRef(0);
  const maxAttempts = 30; // Max 60 seconds of polling (30 * 2s)
  
  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearTimeout(pollingRef.current);
      }
    };
  }, []);
  
  const reset = useCallback(() => {
    setStatus("idle");
    setTransactionId(null);
    setError(null);
    attemptRef.current = 0;
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);
  
  const cancelPayment = useCallback(() => {
    setStatus("cancelled");
    setError("Paiement annulé par l'utilisateur");
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);
  
  const checkStatus = useCallback(async (): Promise<KPayPaymentResponse | null> => {
    if (!transactionId) return null;
    
    const result = await checkPaymentStatus(transactionId);
    
    if (result.status === "success") {
      setStatus("success");
      setError(null);
    } else if (result.status === "failed") {
      setStatus("failed");
      setError(result.message);
    } else if (result.status === "cancelled") {
      setStatus("cancelled");
      setError(result.message);
    }
    
    return result;
  }, [transactionId]);
  
  const pollStatus = useCallback(async () => {
    if (status !== "pending" && status !== "polling") return;
    
    attemptRef.current += 1;
    
    if (attemptRef.current > maxAttempts) {
      setStatus("failed");
      setError("Délai d'attente dépassé. Veuillez réessayer.");
      return;
    }
    
    setStatus("polling");
    const result = await checkPaymentStatus(transactionId!);
    
    if (result.status === "pending") {
      // Continue polling
      pollingRef.current = setTimeout(pollStatus, 2000);
    } else if (result.status === "success") {
      setStatus("success");
      setError(null);
    } else if (result.status === "failed") {
      setStatus("failed");
      setError(result.message);
    } else if (result.status === "cancelled") {
      setStatus("cancelled");
      setError(result.message);
    }
  }, [status, transactionId]);
  
  const startPayment = useCallback(async (
    request: Omit<KPayPaymentRequest, "reference">
  ): Promise<boolean> => {
    // Validate phone number first
    const validation = validatePhoneNumber(request.phoneNumber);
    if (!validation.valid) {
      setError(validation.error || "Numéro invalide");
      setStatus("failed");
      return false;
    }
    
    // Reset state
    setStatus("initiating");
    setError(null);
    setTransactionId(null);
    attemptRef.current = 0;
    
    // Generate unique reference
    const reference = `JRD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    try {
      const result = await initiatePayment({
        ...request,
        reference,
      });
      
      if (result.success && result.transactionId) {
        setTransactionId(result.transactionId);
        setStatus("pending");
        
        // Start polling for status
        pollingRef.current = setTimeout(pollStatus, 3000);
        
        return true;
      } else {
        setStatus("failed");
        setError(result.message);
        return false;
      }
    } catch (err) {
      setStatus("failed");
      setError("Erreur lors de l'initiation du paiement");
      return false;
    }
  }, [pollStatus]);
  
  const validatePhone = useCallback((phone: string) => {
    return validatePhoneNumber(phone);
  }, []);
  
  return {
    status,
    transactionId,
    error,
    startPayment,
    checkStatus,
    cancelPayment,
    reset,
    validatePhone,
  };
}
