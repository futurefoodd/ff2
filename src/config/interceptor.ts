// import axios from "axios";
// import env from "./env";

// export const api = axios.create({
//   baseURL: env.API_BASE_URL,
// });

// type RefreshTokenResponse = {
//   token: string;
//   refreshToken: string;
//   tokenType: string;
// };

// const refreshAccessToken = async (refreshToken: string) => {
//   try {
//     const { data } = await api.post<RefreshTokenResponse>(API_ENDPOINTS.USER.REFRESH_TOKEN, {
//       refreshToken,
//     });
//     return data;
//   } catch (e) {
//     console.error(`Error refreshing access token: ${e}`);
//     throw e;
//   }
// };

// api.interceptors.request.use((config) => {
//   const token = useAuthStore.getState().token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   config.headers["X-Request-Id"] = crypto.randomUUID();
//   return config;
// });

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const { clearAuth, user, setTokens } = useAuthStore.getState();
//     const isLoginRequest = err.config?.url?.includes(API_ENDPOINTS.USER.LOGIN);
//     const isRefreshRequest = err.config?.url?.includes(API_ENDPOINTS.USER.REFRESH_TOKEN);

//     if (!err.config?.url?.includes(API_ENDPOINTS.UI_LOGS.BASE)) {
//       uiLogger.error(
//         "API_REQUEST_FAILED",
//         {
//           url: err.config?.url,
//           method: err.config?.method,
//           status: err.response?.status,
//           message: err.message,
//         },
//         { requestId: err.config?.headers?.["X-Request-Id"] },
//       );
//     }

//     if (err.response?.status === 401 && !isLoginRequest && !isRefreshRequest) {
//       try {
//         if (user && user.refreshToken) {
//           const { token, refreshToken } = await refreshAccessToken(user.refreshToken);
//           setTokens(token, refreshToken);
//           // Retry the original request with the new access token
//           err.config.headers.Authorization = `Bearer ${token}`;
//           return api.request(err.config);
//         }
//       } catch (e) {
//         console.log(e);
//         clearAuth();
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(err);
//   },
// );


// export const authenticatedFetch = async (
//   url: string,
//   init: RequestInit = {},
// ): Promise<Response> => {
//   const requestId = crypto.randomUUID();
//   const withAuthHeader = (token: string | null) => {
//     const headers = new Headers(init.headers);
//     if (token) headers.set("Authorization", `Bearer ${token}`);
//     headers.set("X-Request-Id", requestId);
//     return headers;
//   };

//   const isLoginRequest = url.includes(API_ENDPOINTS.USER.LOGIN);
//   const isRefreshRequest = url.includes(API_ENDPOINTS.USER.REFRESH_TOKEN);

//   const res = await fetch(url, {
//     ...init,
//     headers: withAuthHeader(useAuthStore.getState().token),
//   });

//   if (res.status !== 401 || isLoginRequest || isRefreshRequest) {
//     if (!res.ok && !url.includes(API_ENDPOINTS.UI_LOGS.BASE)) {
//       uiLogger.error(
//         "API_REQUEST_FAILED",
//         {
//           url,
//           method: init.method ?? "GET",
//           status: res.status,
//         },
//         { requestId },
//       );
//     }
//     return res;
//   }

//   const { clearAuth, user, setTokens } = useAuthStore.getState();
//   try {
//     if (!user?.refreshToken) throw new Error("No refresh token available");
//     const { token, refreshToken } = await refreshAccessToken(user.refreshToken);
//     setTokens(token, refreshToken);
//     return fetch(url, { ...init, headers: withAuthHeader(token) });
//   } catch (e) {
//     console.log(e);
//     clearAuth();
//     window.location.href = "/login";
//     return res;
//   }
// };
