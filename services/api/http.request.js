export const httpRequest = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return (url, body, multipart = false) => {
    const requestOptions = {
      method,
      headers: authHeader(url),
    };
    const config = useRuntimeConfig();
    const baseUrl = config.public.baseUrl;
    if (body && !multipart) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
    if (body && multipart) {
      // requestOptions.headers["Content-Type"] = "multipart/form-data";
      requestOptions.body = body;
    }
    return fetch(baseUrl + url, requestOptions).then(handleResponse, url);
  };
}
// helper functions

function authHeader(url) {
  // return auth header with jwt if user is logged in and request is to the api url
  const { user, token } = useAuthStore();
  const cookie = useCookie("token");
  const isLoggedIn = token != "" || token != undefined;

  // const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);
  if (isLoggedIn) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

async function handleResponse(response, url) {
  const alertStore = useAlertStore();
  const isJson = response.headers
    ?.get("content-type")
    ?.includes("application/json");
    if (response.headers?.get("content-type")?.includes("spreadsheetml")) {
      // console.log(response.blob())
      return Promise.resolve(response.blob());
    }
  const data = isJson && response.status !== 204 ? await response.json() : null;

  // check for error response
  if (!response.ok) {
    const { user, logout } = useAuthStore();
    if ([401, 403].includes(response.status) && user) {
      // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
      logout();
    } else if (response?.status === 404) {
      // Trigger Nuxt error handling
      // Trigger Nuxt error handling
      const message = data.message ?? "Entity not found";
      showError({
        statusCode: 404,
        message,
      });
    } else if (response?.status === 405) {
      console.log(url + " #This endpoint is not yet done");
      return Promise.reject(data);
    }

    alertStore.error(data.message);
    // get error message from body or default to response status
    // const error = (data && data.message) || response.status;
    return Promise.reject(data);
  }

  return data;
}
