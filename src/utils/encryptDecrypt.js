import CryptoJS from "crypto-js";

export const encryptData = (data) => {
  let secret_key = process.env.REACT_APP_APP_SECRET_KEY;
  let encJson = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secret_key,
  ).toString();
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encJson));
};

export const decryption = (encryptedData) => {
  let secret_key = process.env.REACT_APP_APP_SECRET_KEY;
  let decData = CryptoJS.enc.Base64.parse(encryptedData).toString(
    CryptoJS.enc.Utf8,
  );
  let decrypted = CryptoJS.AES.decrypt(decData, secret_key).toString(
    CryptoJS.enc.Utf8,
  );
  let decryptedData = JSON.parse(decrypted);
  return decryptedData;
};

export function decrypt(encryptedData) {
  // Get secret key from environment variables
  const secret_key = process.env.REACT_APP_APP_AES_SECRET_KEY;

  if (!secret_key) {
    throw new Error("Secret key is not defined in environment variables");
  }

  // Decode the Base64-encoded string
  const decodedBytes = CryptoJS.enc.Base64.parse(encryptedData);

  // Parse the secret key to the appropriate format
  const secretKey = CryptoJS.enc.Utf8.parse(secret_key);

  // Decrypt the data using AES
  const decrypted = CryptoJS.AES.decrypt(
    {
      ciphertext: decodedBytes,
    }, // Cast as any to satisfy TypeScript
    secretKey,
    {
      mode: CryptoJS.mode.ECB, // Ensure you're using the right mode (adjust if necessary)
      padding: CryptoJS.pad.Pkcs7,
    },
  );

  // Convert decrypted bytes back to string
  try {
    return decrypted?.toString(CryptoJS.enc.Utf8);
  } catch {
    return "";
  }
}
