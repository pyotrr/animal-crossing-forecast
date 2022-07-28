import config from "./config";

class ApiError extends Error {
  constructor(message: string) {
    super(`An error occurred while fetching from the API: ${message}`);
  }
}

const AuthHeader = new Headers({
  "X-API-KEY": config.key,
  "Accept-Version": "1.5.0",
});

export default async function makeRequest(
  path: string,
  query: { [key: string]: string }
) {
  const queryString = query
    ? `?${Object.keys(query)
        .map((key) => `${key}=${query[key]}`)
        .join("&")}`
    : "";
  const apiPath = `${config.apiPath}${path}${queryString}`;

  const response = await fetch(apiPath, {
    method: "GET",
    headers: AuthHeader,
  });

  if (!response.ok) {
    throw new ApiError("The server responded with an error");
  }

  return response.json();
}
