/**
 * NCALayer WebSocket communication utility
 * Based on the official NCALayer example
 */

// WebSocket connection
let webSocket = null;
let callback = null;
let isConnected = false;

// Connection status listeners
const connectionListeners = [];

/**
 * Initialize WebSocket connection to NCALayer
 * @returns {Promise} Resolves when connection is established, rejects on error
 */
export const initializeNCALayer = () => {
  console.log("🔄 [NCALayer] Initializing connection to NCALayer...");
  return new Promise((resolve, reject) => {
    // If already connected, resolve immediately
    if (isConnected && webSocket?.readyState === WebSocket.OPEN) {
      console.log("✅ [NCALayer] Already connected to NCALayer");
      resolve();
      return;
    }

    try {
      console.log(
        "🔄 [NCALayer] Creating WebSocket connection to wss://127.0.0.1:13579/"
      );
      webSocket = new WebSocket("wss://127.0.0.1:13579/");

      webSocket.onopen = () => {
        console.log("✅ [NCALayer] Connection established successfully");
        isConnected = true;
        notifyConnectionListeners(true);
        resolve();
      };

      webSocket.onclose = (event) => {
        isConnected = false;
        if (event.wasClean) {
          console.log(
            "🔄 [NCALayer] Connection closed cleanly",
            event.code,
            event.reason
          );
        } else {
          console.error(
            "❌ [NCALayer] Connection lost unexpectedly",
            event.code,
            event.reason
          );
        }
        notifyConnectionListeners(false);
        reject(
          new Error(`Connection closed: ${event.reason || "Unknown reason"}`)
        );
      };

      webSocket.onerror = (error) => {
        console.error("❌ [NCALayer] WebSocket error:", error);
        isConnected = false;
        notifyConnectionListeners(false);
        reject(new Error("Failed to connect to NCALayer"));
      };

      webSocket.onmessage = (event) => {
        try {
          console.log("📩 [NCALayer] Received message:", event.data);
          const result = JSON.parse(event.data);
          if (result) {
            const response = {
              code: result.code,
              message: result.message,
              responseObject: result.responseObject,
              getResult: function () {
                return this.result;
              },
              getMessage: function () {
                return this.message;
              },
              getResponseObject: function () {
                return this.responseObject;
              },
              getCode: function () {
                return this.code;
              },
            };

            if (callback && typeof window[callback] === "function") {
              console.log("🔄 [NCALayer] Calling window callback:", callback);
              window[callback](response);
            } else if (callback && typeof callback === "function") {
              console.log("🔄 [NCALayer] Calling function callback");
              callback(response);
            } else {
              console.warn("⚠️ [NCALayer] No callback defined for message");
            }
          }
        } catch (error) {
          console.error("❌ [NCALayer] Error processing response:", error);
        }
      };
    } catch (error) {
      console.error("❌ [NCALayer] Error initializing connection:", error);
      isConnected = false;
      notifyConnectionListeners(false);
      reject(error);
    }
  });
};

/**
 * Add connection status listener
 * @param {Function} listener Function to call when connection status changes
 */
export const addConnectionListener = (listener) => {
  if (
    typeof listener === "function" &&
    !connectionListeners.includes(listener)
  ) {
    console.log("🔄 [NCALayer] Adding connection listener");
    connectionListeners.push(listener);
  }
};

/**
 * Remove connection status listener
 * @param {Function} listener Function to remove from listeners
 */
export const removeConnectionListener = (listener) => {
  const index = connectionListeners.indexOf(listener);
  if (index !== -1) {
    console.log("🔄 [NCALayer] Removing connection listener");
    connectionListeners.splice(index, 1);
  }
};

/**
 * Notify all connection listeners of status change
 * @param {boolean} status Connection status
 */
const notifyConnectionListeners = (status) => {
  console.log(
    `🔄 [NCALayer] Notifying listeners of connection status: ${status}`
  );
  connectionListeners.forEach((listener) => {
    try {
      listener(status);
    } catch (error) {
      console.error("❌ [NCALayer] Error in connection listener:", error);
    }
  });
};

/**
 * Get active tokens (storage types)
 * @param {Function} callBack Callback function to handle response
 */
export const getActiveTokens = (callBack) => {
  console.log("🔄 [NCALayer] Getting active tokens...");
  if (!ensureConnection()) return;

  const request = {
    module: "kz.gov.pki.knca.commonUtils",
    method: "getActiveTokens",
  };
  console.log("📤 [NCALayer] Sending request:", request);
  callback = callBack;
  webSocket.send(JSON.stringify(request));
};

/**
 * Get key information from selected storage
 * @param {string} storageName Storage name (e.g., "PKCS12")
 * @param {Function} callBack Callback function to handle response
 */
export const getKeyInfo = (storageName, callBack) => {
  console.log(`🔄 [NCALayer] Getting key info for storage: ${storageName}`);
  if (!ensureConnection()) return;

  const request = {
    module: "kz.gov.pki.knca.commonUtils",
    method: "getKeyInfo",
    args: [storageName],
  };
  console.log("📤 [NCALayer] Sending request:", request);
  callback = callBack;
  webSocket.send(JSON.stringify(request));
};

/**
 * Sign XML data
 * @param {string} storageName Storage name
 * @param {string} keyType Key type ("AUTHENTICATION" or "SIGNATURE")
 * @param {string} xmlToSign XML data to sign
 * @param {Function} callBack Callback function to handle response
 */
export const signXml = (storageName, keyType, xmlToSign, callBack) => {
  console.log(
    `🔄 [NCALayer] Signing XML with storage: ${storageName}, keyType: ${keyType}`
  );
  if (!ensureConnection()) return;

  const request = {
    module: "kz.gov.pki.knca.commonUtils",
    method: "signXml",
    args: [storageName, keyType, xmlToSign, "", ""],
  };
  console.log("📤 [NCALayer] Sending sign XML request");
  callback = callBack;
  webSocket.send(JSON.stringify(request));
};

/**
 * Sign data in Base64 format
 * @param {string} storageName Storage name
 * @param {string} keyType Key type ("AUTHENTICATION" or "SIGNATURE")
 * @param {string} base64ToSign Base64 data to sign
 * @param {Function} callBack Callback function to handle response
 */
export const signData = (storageName, keyType, base64ToSign, callBack) => {
  console.log(
    `🔄 [NCALayer] Signing data with storage: ${storageName}, keyType: ${keyType}`
  );
  if (!ensureConnection()) return;

  const request = {
    module: "kz.gov.pki.knca.commonUtils",
    method: "signData",
    args: [storageName, keyType, base64ToSign],
  };
  console.log("📤 [NCALayer] Sending sign data request");
  callback = callBack;
  webSocket.send(JSON.stringify(request));
};

/**
 * Change NCALayer locale
 * @param {string} language Language code ("kk", "ru", "en")
 */
export const changeLocale = (language) => {
  console.log(`🔄 [NCALayer] Changing locale to: ${language}`);
  if (!ensureConnection()) return;

  const request = {
    module: "kz.gov.pki.knca.commonUtils",
    method: "changeLocale",
    args: [language],
  };
  console.log("📤 [NCALayer] Sending change locale request");
  webSocket.send(JSON.stringify(request));
};

/**
 * Ensure WebSocket connection is established
 * @returns {boolean} True if connected, false otherwise
 */
const ensureConnection = () => {
  if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
    console.error(
      "❌ [NCALayer] WebSocket connection not established. Call initializeNCALayer first."
    );
    return false;
  }
  return true;
};

/**
 * Create a Promise-based wrapper for NCALayer calls
 * @param {Function} ncaLayerMethod The NCALayer method to call
 * @param {Array} args Arguments for the method
 * @returns {Promise} Promise that resolves with the response
 */
export const createNCALayerPromise = (ncaLayerMethod, ...args) => {
  console.log(
    `🔄 [NCALayer] Creating Promise for method: ${ncaLayerMethod.name}`
  );
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      console.error("❌ [NCALayer] Request timed out");
      reject(new Error("NCALayer request timed out"));
    }, 30000); // 30 second timeout

    const callbackFn = (response) => {
      console.log("📩 [NCALayer] Promise received response:", response);
      clearTimeout(timeoutId);

      if (response.code === "500") {
        console.error("❌ [NCALayer] Error response:", response.message);
        reject(new Error(response.message || "NCALayer operation failed"));
      } else if (response.code === "200") {
        console.log("✅ [NCALayer] Success response");
        resolve(response.responseObject);
      } else {
        console.warn("⚠️ [NCALayer] Unknown response code:", response.code);
        reject(new Error(`Unknown response code: ${response.code}`));
      }
    };

    // Call the NCALayer method with the provided arguments and our callback
    console.log("📤 [NCALayer] Executing method with args:", ...args);
    ncaLayerMethod(...args, callbackFn);
  });
};

/**
 * Clean up NCALayer WebSocket connection
 * Call this when component unmounts or user navigates away
 */
export const cleanupNCALayer = () => {
  console.log("🔄 [NCALayer] Cleaning up NCALayer connection");
  if (webSocket && webSocket.readyState !== WebSocket.CLOSED) {
    try {
      webSocket.close();
      console.log("✅ [NCALayer] Connection closed successfully");
    } catch (error) {
      console.error("❌ [NCALayer] Error closing connection:", error);
    }
  }
  isConnected = false;
  callback = null;
  notifyConnectionListeners(false);
  console.log("✅ [NCALayer] Cleanup complete");
};
