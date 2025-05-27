import CryptoJS from "crypto-js";
import _authHttp from "../services/authHttp";
import config from "./apiEndpoints";

export const FileNameWithoutTimestamp = (fileName) => {
  const fileNameWithoutTimestamp =
    fileName?.replace?.(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{9}-/, "") ||
    "";
  return fileNameWithoutTimestamp;
};

export const uploadPublicFiles = async (file, doc_details) => {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const formData = new FormData();

  formData.set("file", file);
  formData.set("document_detail", JSON.stringify(doc_details));
  const Headers = {
    "Content-Type": "multipart/form-data",
  };

  try {
    let res = await _authHttp.post(config.dataset.uploadFile, formData, {
      headers: { ...Headers },
    });
    if (res?.data?.ok) {
      resolve(res?.data?.result);
    } else {
      reject(getErrorFromApi(res));
    }
  } catch (e) {
    reject(getErrorFromApi(e));
  }
  return promise;
};

export const userCredentialsFromName = (name) => {
  return name?.split(" ")?.[0].trim() || "You";
};

export const handleCopy = (liveUrl) => {
  navigator.clipboard.writeText(liveUrl);
};

export const getErrorFromApi = (
  res,
  defaultMessage = "Something went wrong!",
) => {
  if (typeof res === "string") {
    return res;
  }
  if (res?.response) {
    const error =
      res?.response?.data?.detail &&
      typeof res?.response?.data?.detail === "string"
        ? res?.response?.data?.detail
        : res?.response?.data?.detail?.[0]?.msg &&
          typeof res?.response?.data?.detail?.[0]?.msg === "string"
        ? res?.response?.data?.detail?.[0]?.msg
        : res?.response?.data?.message
        ? res?.response?.data?.message
        : res?.response?.data?.error?.message;
    if (error) return error;
  }

  if (res?.data) {
    const error = res?.data?.error?.message;
    if (error) return error;
  }

  return res?.message || defaultMessage;
};

export const encryptData = (data, key) => {
  const truncatedKey = CryptoJS.enc.Utf8.parse(key.slice(0, 16));
  const encrypted = CryptoJS.AES.encrypt(data, truncatedKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const getCleanMarkdownString = (markdown) => {
  return (markdown =
    markdown?.replace(/\\[ntrfbv'\"\\0]/g, (match) => {
      switch (match) {
        case "\\n":
          return "  \n"; // New line
        case "\\t":
          return "  \t"; // Horizontal tab
        case "\\r":
          return "  \r"; // Carriage return
        case "\\f":
          return "  \f"; // Form feed
        case "\\b":
          return "  \b"; // Backspace
        case "\\v":
          return "  \v"; // Vertical tab
        case "\\'":
          return "  '"; // Single quote
        case '\\"':
          return '  "'; // Double quote
        case "\\\\":
          return "  \\"; // Backslash
        case "\\0":
          return "  \0"; // Null character
        default:
          return match; // No replacement for other sequences
      }
    }) ?? markdown);
};

export const checkValidStringifiedJSON = (value) => {
  try {
    JSON.parse(value);
    return true;
  } catch (e) {
    return false;
  }
};

export const isValidJSONValue = (value) => {
  try {
    JSON.stringify(value);
    return true;
  } catch (e) {
    return false;
  }
};

export const clickDefaultBehaviourDiscardHandler = (e) => {
  e?.stopPropagation();
  e?.preventDefault();
};

export const openFileInNewTab = (blobData, fileName) => {
  // A map of common file extensions to MIME types
  const mimeTypes = {
    pdf: "application/pdf",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    // Add more MIME types and file extensions as needed
  };

  // Extract the file extension from the filename
  const fileExtension = fileName.split(".").pop().toLowerCase();

  // Determine the MIME type based on the file extension or default to binary
  const mimeType = mimeTypes[fileExtension] || "application/octet-stream";

  // Create a Blob object with the correct MIME type
  const blobObj = new Blob([blobData], { type: mimeType });

  // Generate a URL for the Blob object
  const blobUrl = URL.createObjectURL(blobObj);

  // Open the URL in a new tab
  window.open(blobUrl, "_blank");
};

export const injectInlineStylesFromHTML = (html) => {
  // Create a temporary DOM element to manipulate the input HTML
  const tempElement = document.createElement("html");
  tempElement.innerHTML = html;

  // Extract all <style> tags from the <head>
  const styleTags = tempElement.querySelectorAll("style");
  let combinedCSS = "";

  styleTags.forEach((styleTag) => {
    combinedCSS += styleTag.innerHTML;
    styleTag.remove(); // Remove the style tag after extracting rules
  });

  // Create a function to parse CSS rules and apply them inline
  const parseAndApplyStyles = (css, dom) => {
    const styleElement = document.createElement("style");
    styleElement.textContent = css;
    document.head.appendChild(styleElement);

    const sheet = styleElement.sheet;

    if (!sheet) {
      console.warn("No stylesheet found to parse.");
      return;
    }

    Array.from(sheet.cssRules).forEach((rule) => {
      if (rule instanceof CSSStyleRule) {
        const selector = rule.selectorText;
        const style = rule.style.cssText;

        if (selector && style) {
          try {
            // Find elements matching the selector
            const elements = dom.querySelectorAll(selector);

            elements.forEach((el) => {
              // Merge existing inline styles with new styles
              const existingStyle = el.getAttribute("style") || "";
              const mergedStyle = `${existingStyle} ${style}`.trim();
              el.setAttribute("style", mergedStyle);
            });
          } catch (error) {
            console.warn(
              `Error applying styles for selector: ${selector}`,
              error,
            );
          }
        }
      }
    });

    // Clean up the temporary style element
    document.head.removeChild(styleElement);
  };

  // Apply styles from the combined CSS
  parseAndApplyStyles(combinedCSS, tempElement);

  // Return the updated HTML content inside the <body>
  const bodyContent = tempElement.querySelector("body");
  return bodyContent ? bodyContent.innerHTML : "";
};

export const getTimeWithUnitFromMS = (ms) => {
  {
    let unit = "ms";
    let time = ms;

    // Convert to seconds if ms is greater than 1000 (1 second)
    if (ms >= 1000) {
      time = ms / 1000;
      unit = "sec";

      // Convert to minutes if sec is greater than 60 (1 minute)
      if (time >= 60) {
        time = time / 60;
        unit = "min";

        // Convert to hours if minute is greater than 60 (1 hour)
        if (time >= 60) {
          time = time / 60;
          unit = "hr";
        }
      }
    }

    return `${time.toFixed(2)} ${unit}`;
  }
};

export const formatHeaderStringWithUnderscore = (val) => {
  return val
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
};
