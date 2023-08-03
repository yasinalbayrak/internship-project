import "../globalVariables.js"
const BASE_URL = window.basePATH;
export async function fetchData(endpoint, options = {}) {
  try {
    const response = await fetch(BASE_URL + endpoint, options);

    if (!response.ok) {
      // Check if the response is JSON and contains an error object
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        const errorMessage = data.message || response.statusText;
        throw new Error(`${errorMessage}`);
      } else {
        // For non-JSON responses, use the statusText
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // Handle any error that occurs during the API call
    console.error("API call error:", error);
    throw error;
  }
}
