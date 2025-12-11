const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  console.warn(
    "NEXT_PUBLIC_API_BASE_URL is not defined. API client calls will fail until it is set."
  );
}

export const API_BASE_URL = apiBaseUrl ?? "";

export const getApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is missing. Please provide it in your env file so API requests know where to go."
    );
  }

  return `${API_BASE_URL}${path}`;
};
