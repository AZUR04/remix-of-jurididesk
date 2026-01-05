// K-Pay API Integration
// Documentation: https://kpay.com/docs

export interface KPayConfig {
  apiKey: string;
  username: string;
  isProduction: boolean;
}

export interface KPayPaymentRequest {
  amount: number;
  phoneNumber: string;
  description: string;
  reference: string;
  callbackUrl?: string;
}

export interface KPayPaymentResponse {
  success: boolean;
  transactionId?: string;
  status: "pending" | "success" | "failed" | "cancelled";
  message: string;
  errorCode?: string;
}

export interface KPayTransaction {
  id: string;
  reference: string;
  amount: number;
  phoneNumber: string;
  status: "pending" | "success" | "failed" | "cancelled";
  createdAt: string;
  completedAt?: string;
}

// K-Pay API Configuration
const KPAY_CONFIG: KPayConfig = {
  apiKey: "test_90e8085509d9a9258ce492409a7caa84",
  username: "juridi",
  isProduction: false, // Switch to true for production
};

// K-Pay API endpoints
const KPAY_ENDPOINTS = {
  sandbox: "https://api.kpay.com/sandbox/v1",
  production: "https://api.kpay.com/v1",
};

function getBaseUrl(): string {
  return KPAY_CONFIG.isProduction ? KPAY_ENDPOINTS.production : KPAY_ENDPOINTS.sandbox;
}

function getAuthHeaders(): HeadersInit {
  const credentials = btoa(`${KPAY_CONFIG.username}:${KPAY_CONFIG.apiKey}`);
  return {
    "Authorization": `Basic ${credentials}`,
    "Content-Type": "application/json",
  };
}

// Format phone number for K-Pay (remove spaces, add country code if needed)
function formatPhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  let cleaned = phone.replace(/\D/g, "");
  
  // Add country code for RDC if not present
  if (cleaned.startsWith("0")) {
    cleaned = "243" + cleaned.substring(1);
  } else if (!cleaned.startsWith("243")) {
    cleaned = "243" + cleaned;
  }
  
  return cleaned;
}

// Validate phone number format
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  const cleaned = phone.replace(/\D/g, "");
  
  if (cleaned.length < 9) {
    return { valid: false, error: "Le numéro doit contenir au moins 9 chiffres" };
  }
  
  if (cleaned.length > 12) {
    return { valid: false, error: "Le numéro est trop long" };
  }
  
  // Check for valid RDC operators (Vodacom, Airtel, Orange, Africell)
  const validPrefixes = ["081", "082", "083", "084", "085", "089", "097", "098", "099", "090"];
  const prefix = cleaned.startsWith("243") ? cleaned.substring(3, 6) : cleaned.substring(0, 3);
  
  if (!validPrefixes.some(p => prefix.startsWith(p.substring(1)))) {
    return { valid: false, error: "Opérateur non reconnu (Vodacom, Airtel, Orange, Africell)" };
  }
  
  return { valid: true };
}

// Initiate a K-Pay payment
export async function initiatePayment(request: KPayPaymentRequest): Promise<KPayPaymentResponse> {
  try {
    const formattedPhone = formatPhoneNumber(request.phoneNumber);
    
    // Validate phone number first
    const validation = validatePhoneNumber(request.phoneNumber);
    if (!validation.valid) {
      return {
        success: false,
        status: "failed",
        message: validation.error || "Numéro de téléphone invalide",
        errorCode: "INVALID_PHONE",
      };
    }
    
    // In sandbox mode, simulate API call
    if (!KPAY_CONFIG.isProduction) {
      return simulateKPayPayment(request, formattedPhone);
    }
    
    // Production API call
    const response = await fetch(`${getBaseUrl()}/payments/initiate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        amount: request.amount,
        phone: formattedPhone,
        description: request.description,
        reference: request.reference,
        callback_url: request.callbackUrl || `${window.location.origin}/api/kpay/callback`,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        status: "failed",
        message: error.message || "Erreur lors de l'initiation du paiement",
        errorCode: error.code,
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      transactionId: data.transaction_id,
      status: "pending",
      message: "Veuillez confirmer le paiement sur votre téléphone",
    };
  } catch (error) {
    console.error("K-Pay payment error:", error);
    return {
      success: false,
      status: "failed",
      message: "Erreur de connexion au serveur de paiement",
      errorCode: "CONNECTION_ERROR",
    };
  }
}

// Check payment status
export async function checkPaymentStatus(transactionId: string): Promise<KPayPaymentResponse> {
  try {
    // In sandbox mode, simulate status check
    if (!KPAY_CONFIG.isProduction) {
      return simulatePaymentStatusCheck(transactionId);
    }
    
    const response = await fetch(`${getBaseUrl()}/payments/${transactionId}/status`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        status: "failed",
        message: error.message || "Erreur lors de la vérification du statut",
        errorCode: error.code,
      };
    }
    
    const data = await response.json();
    
    return {
      success: data.status === "success",
      transactionId,
      status: data.status,
      message: getStatusMessage(data.status),
    };
  } catch (error) {
    console.error("K-Pay status check error:", error);
    return {
      success: false,
      status: "failed",
      message: "Erreur de connexion au serveur de paiement",
      errorCode: "CONNECTION_ERROR",
    };
  }
}

// Sandbox simulation functions
function simulateKPayPayment(request: KPayPaymentRequest, formattedPhone: string): Promise<KPayPaymentResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Store transaction in session for status checking
      const transactionId = `KPAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store pending transaction
      const pendingTransactions = JSON.parse(sessionStorage.getItem("kpay_pending") || "{}");
      pendingTransactions[transactionId] = {
        ...request,
        phone: formattedPhone,
        createdAt: new Date().toISOString(),
        status: "pending",
      };
      sessionStorage.setItem("kpay_pending", JSON.stringify(pendingTransactions));
      
      resolve({
        success: true,
        transactionId,
        status: "pending",
        message: "Veuillez confirmer le paiement sur votre téléphone",
      });
    }, 1500);
  });
}

function simulatePaymentStatusCheck(transactionId: string): Promise<KPayPaymentResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pendingTransactions = JSON.parse(sessionStorage.getItem("kpay_pending") || "{}");
      const transaction = pendingTransactions[transactionId];
      
      if (!transaction) {
        resolve({
          success: false,
          status: "failed",
          message: "Transaction non trouvée",
          errorCode: "NOT_FOUND",
        });
        return;
      }
      
      // Simulate 85% success rate after first check
      const attempts = transaction.checkAttempts || 0;
      transaction.checkAttempts = attempts + 1;
      
      if (attempts >= 1) {
        // After first check, determine final status
        const isSuccess = Math.random() > 0.15;
        const finalStatus = isSuccess ? "success" : "failed";
        
        // Update stored transaction
        transaction.status = finalStatus;
        transaction.completedAt = new Date().toISOString();
        pendingTransactions[transactionId] = transaction;
        sessionStorage.setItem("kpay_pending", JSON.stringify(pendingTransactions));
        
        resolve({
          success: isSuccess,
          transactionId,
          status: finalStatus,
          message: isSuccess 
            ? "Paiement confirmé avec succès" 
            : "Le paiement a été refusé. Vérifiez votre solde.",
        });
      } else {
        // First check, still pending
        pendingTransactions[transactionId] = transaction;
        sessionStorage.setItem("kpay_pending", JSON.stringify(pendingTransactions));
        
        resolve({
          success: false,
          transactionId,
          status: "pending",
          message: "En attente de confirmation...",
        });
      }
    }, 2000);
  });
}

function getStatusMessage(status: string): string {
  switch (status) {
    case "pending":
      return "En attente de confirmation...";
    case "success":
      return "Paiement confirmé avec succès";
    case "failed":
      return "Le paiement a échoué";
    case "cancelled":
      return "Le paiement a été annulé";
    default:
      return "Statut inconnu";
  }
}

// Get K-Pay config for display purposes
export function getKPayMode(): "sandbox" | "production" {
  return KPAY_CONFIG.isProduction ? "production" : "sandbox";
}

// Switch K-Pay mode (for admin use)
export function setKPayProductionMode(isProduction: boolean): void {
  KPAY_CONFIG.isProduction = isProduction;
}
