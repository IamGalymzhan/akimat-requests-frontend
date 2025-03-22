/**
 * EDS (Electronic Digital Signature) authentication utilities
 * Implements the authentication flow using NCALayer
 */

import api from "./api";
import {
  initializeNCALayer,
  signXml,
  createNCALayerPromise,
  cleanupNCALayer,
} from "./ncalayer";

// Track if authentication is in progress to prevent multiple attempts
let isAuthenticating = false;

/**
 * Authenticate using EDS (Electronic Digital Signature)
 * @returns {Promise} Resolves with user data on successful authentication
 */
export const authenticateWithEDS = async () => {
  // Prevent multiple simultaneous authentication attempts
  if (isAuthenticating) {
    console.log("⚠️ [EDS] Authentication already in progress");
    return Promise.reject(new Error("Authentication already in progress"));
  }

  try {
    isAuthenticating = true;
    console.log("🔑 [EDS] Starting authentication process...");

    // 1. Initialize connection to NCALayer
    console.log("🔄 [EDS] Step 1: Initializing connection to NCALayer");
    await initializeNCALayer();
    console.log("✅ [EDS] NCALayer connection established");

    // 2. Prepare authentication data to be signed
    console.log("🔄 [EDS] Step 2: Preparing authentication data");
    // Create authentication challenge with timestamp to make it unique
    const authData = {
      timestamp: new Date().toISOString(),
      action: "authenticate",
    };
    const xmlToSign = generateAuthXml(authData);
    console.log("✅ [EDS] Generated auth XML for signing:", xmlToSign);

    // 3. Sign the authentication data
    console.log("🔄 [EDS] Step 3: Signing authentication data");
    const signedXml = await createNCALayerPromise(
      signXml,
      "PKCS12", // Use default storage
      "AUTHENTICATION", // Use authentication key
      xmlToSign
    );
    console.log("✅ [EDS] XML successfully signed");
    console.log(
      "📋 [EDS] Signed XML (first 100 chars):",
      signedXml.substring(0, 100) + "..."
    );

    // 4. Send the signed XML to the backend for verification
    console.log("🔄 [EDS] Step 4: Sending signed XML to backend");
    const authResponse = await api.post("/auth/eds/login", {
      signed_xml: signedXml,
    });

    console.log("✅ [EDS] Backend authentication successful");
    console.log("📋 [EDS] Auth response:", authResponse.data);
    return authResponse.data;
  } catch (error) {
    console.error("❌ [EDS] Authentication failed:", error);
    throw new Error(error.message || "EDS authentication failed");
  } finally {
    isAuthenticating = false;
    console.log("🔄 [EDS] Authentication process completed");
  }
};

/**
 * Generate XML for authentication
 * @param {Object} authData Data to include in the authentication XML
 * @returns {string} XML string to be signed
 */
const generateAuthXml = (authData) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<auth>
  <timestamp>${authData.timestamp}</timestamp>
  <action>${authData.action}</action>
</auth>`;
  console.log("📝 [EDS] Generated XML for authentication");
  return xml;
};

/**
 * Check if NCALayer is available
 * @returns {Promise<boolean>} Promise that resolves to true if NCALayer is available
 */
export const checkNCALayerAvailability = async () => {
  let connection = false;
  try {
    console.log("🔍 [EDS] Checking NCALayer availability");
    // We won't immediately clean up the connection here
    await initializeNCALayer();

    // If we reach this point, the connection was successful
    connection = true;
    console.log("✅ [EDS] NCALayer is available");

    return true;
  } catch (error) {
    console.error("❌ [EDS] NCALayer is not available:", error);
    return false;
  }
  // Deliberately not calling cleanupNCALayer() here
  // The connection will be cleaned up when authentication is complete
  // or explicitly by the component when needed
};

// Re-export cleanupNCALayer for component cleanup
export { cleanupNCALayer };
