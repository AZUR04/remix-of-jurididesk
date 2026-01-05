// K-Pay API Integration - Official Esicia K-Pay
// Documentation: https://pay.esicia.com/

export interface KPayConfig {
  apiKey: string;
  username: string;
  password: string;
  retailerId: number;
  isProduction: boolean;
}

export interface KPayPaymentRequest {
  amount: number;
  phoneNumber: string;
  email?: string;
  description: string;
  orderId: string;
  callbackUrl: string;
  returnUrl: string;
}

export interface KPayPaymentResponse {
  success: boolean;
  transactionId?: string;
  paymentUrl?: string;
  status: "pending" | "success" | "failed" | "cancelled";
  message: string;
  errorCode?: string;
}

export interface KPayTransaction {
  id: string;
  orderId: string;
  amount: number;
  phoneNumber: string;
  status: "pending" | "success" | "failed" | "cancelled";
  createdAt: string;
  completedAt?: string;
}

// K-Pay API Configuration - Using provided credentials
const KPAY_CONFIG: KPayConfig = {
  apiKey: "test_90e8085509d9a9258ce492409a7caa84",
  username: "juridi",
  password: "9c43ac75ae1124fe",
  retailerId: 31,
  isProduction: false, // Switch to true for production
};

// K-Pay Official API endpoint
const KPAY_API_URL = "https://pay.esicia.com";

function getAuthHeaders(): HeadersInit {
  // Basic Auth: username:password encoded in base64
  const basicAuth = btoa(`${KPAY_CONFIG.username}:${KPAY_CONFIG.password}`);
  return {
    "Content-Type": "application/json",
    "Authorization": `Basic ${basicAuth}`,
    "Kpay-Key": KPAY_CONFIG.apiKey,
  };
}

// Format phone number for K-Pay (ensure correct format)
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
  const validPrefixes = ["81", "82", "83", "84", "85", "89", "97", "98", "99", "90"];
  const prefix = cleaned.startsWith("243") ? cleaned.substring(3, 5) : cleaned.substring(0, 2);
  
  if (!validPrefixes.includes(prefix)) {
    return { valid: false, error: "Opérateur non reconnu (Vodacom, Airtel, Orange, Africell)" };
  }
  
  return { valid: true };
}

// Generate unique order ID
export function generateOrderId(): string {
  return `JRD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

// Initiate a K-Pay payment - Official API structure
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
    
    // In sandbox mode, simulate API call for testing
    if (!KPAY_CONFIG.isProduction) {
      console.log("🧪 K-Pay Sandbox Mode - Simulating payment");
      return simulateKPayPayment(request, formattedPhone);
    }
    
    // Production API call with official K-Pay structure
    const payload = {
      amount: Number(request.amount), // Ensure it's a number
      currency: "CDF",
      description: request.description,
      order_id: request.orderId,
      retailer_id: KPAY_CONFIG.retailerId,
      customer: {
        phone: formattedPhone,
        email: request.email || "",
      },
      callback_url: request.callbackUrl,
      return_url: request.returnUrl,
    };
    
    console.log("📤 K-Pay Payment Request:", JSON.stringify(payload, null, 2));
    
    const response = await fetch(`${KPAY_API_URL}/api/v1/payments`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    console.log("📥 K-Pay Response:", JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      return {
        success: false,
        status: "failed",
        message: data.message || data.error || "Erreur lors de l'initiation du paiement",
        errorCode: data.code || response.status.toString(),
      };
    }
    
    return {
      success: true,
      transactionId: data.transaction_id || data.id,
      paymentUrl: data.payment_url,
      status: "pending",
      message: "Veuillez confirmer le paiement sur votre téléphone",
    };
  } catch (error) {
    console.error("❌ K-Pay payment error:", error);
    return {
      success: false,
      status: "failed",
      message: "Erreur de connexion au serveur de paiement K-Pay",
      errorCode: "CONNECTION_ERROR",
    };
  }
}

// Check payment status - Official API
export async function checkPaymentStatus(transactionId: string): Promise<KPayPaymentResponse> {
  try {
    // In sandbox mode, simulate status check
    if (!KPAY_CONFIG.isProduction) {
      return simulatePaymentStatusCheck(transactionId);
    }
    
    const response = await fetch(`${KPAY_API_URL}/api/v1/payments/${transactionId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    const data = await response.json();
    console.log("📥 K-Pay Status Response:", JSON.stringify(data, null, 2));
    
    if (!response.ok) {
      return {
        success: false,
        status: "failed",
        message: data.message || "Erreur lors de la vérification du statut",
        errorCode: data.code,
      };
    }
    
    const status = mapKPayStatus(data.status);
    
    return {
      success: status === "success",
      transactionId,
      status,
      message: getStatusMessage(status),
    };
  } catch (error) {
    console.error("❌ K-Pay status check error:", error);
    return {
      success: false,
      status: "failed",
      message: "Erreur de connexion au serveur de paiement",
      errorCode: "CONNECTION_ERROR",
    };
  }
}

// Map K-Pay status to our internal status
function mapKPayStatus(kpayStatus: string): "pending" | "success" | "failed" | "cancelled" {
  const statusMap: Record<string, "pending" | "success" | "failed" | "cancelled"> = {
    "pending": "pending",
    "processing": "pending",
    "completed": "success",
    "success": "success",
    "paid": "success",
    "failed": "failed",
    "error": "failed",
    "cancelled": "cancelled",
    "canceled": "cancelled",
    "expired": "failed",
  };
  return statusMap[kpayStatus?.toLowerCase()] || "pending";
}

// Sandbox simulation functions for testing
function simulateKPayPayment(request: KPayPaymentRequest, formattedPhone: string): Promise<KPayPaymentResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const transactionId = `KPAY-TEST-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Store pending transaction in sessionStorage for status checking
      const pendingTransactions = JSON.parse(sessionStorage.getItem("kpay_pending") || "{}");
      pendingTransactions[transactionId] = {
        orderId: request.orderId,
        amount: request.amount,
        phone: formattedPhone,
        description: request.description,
        createdAt: new Date().toISOString(),
        status: "pending",
        checkAttempts: 0,
      };
      sessionStorage.setItem("kpay_pending", JSON.stringify(pendingTransactions));
      
      console.log("✅ K-Pay Sandbox: Payment initiated", { transactionId, amount: request.amount });
      
      resolve({
        success: true,
        transactionId,
        status: "pending",
        message: "🧪 Mode Test: Veuillez confirmer le paiement sur votre téléphone",
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
      
      // Simulate 90% success rate after 2 checks
      const attempts = transaction.checkAttempts || 0;
      transaction.checkAttempts = attempts + 1;
      
      if (attempts >= 2) {
        // After 2 checks, determine final status (90% success)
        const isSuccess = Math.random() > 0.1;
        const finalStatus = isSuccess ? "success" : "failed";
        
        transaction.status = finalStatus;
        transaction.completedAt = new Date().toISOString();
        pendingTransactions[transactionId] = transaction;
        sessionStorage.setItem("kpay_pending", JSON.stringify(pendingTransactions));
        
        console.log(`${isSuccess ? "✅" : "❌"} K-Pay Sandbox: Payment ${finalStatus}`, { transactionId });
        
        resolve({
          success: isSuccess,
          transactionId,
          status: finalStatus,
          message: isSuccess 
            ? "🧪 Mode Test: Paiement confirmé avec succès" 
            : "🧪 Mode Test: Le paiement a été refusé",
        });
      } else {
        // Still pending
        pendingTransactions[transactionId] = transaction;
        sessionStorage.setItem("kpay_pending", JSON.stringify(pendingTransactions));
        
        resolve({
          success: false,
          transactionId,
          status: "pending",
          message: "🧪 Mode Test: En attente de confirmation...",
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
  console.log(`🔄 K-Pay mode switched to: ${isProduction ? "PRODUCTION" : "SANDBOX"}`);
}

// Verify webhook signature (for callback validation)
export function verifyWebhookSignature(payload: unknown, signature: string): boolean {
  // In production, implement proper signature verification
  // For now, basic validation
  if (!KPAY_CONFIG.isProduction) {
    return true; // Skip verification in sandbox
  }
  // TODO: Implement HMAC signature verification when K-Pay provides webhook secret
  return !!signature && !!payload;
}
