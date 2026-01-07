import axios from "axios";

const api = axios.create({
  // baseURL: "https://managerapi.blundey.com", //URL para el servidor

  baseURL: "https://managerapipruebas.blundey.com", //URL para pruebas de en el servidor
  // baseURL: "https://localhost:44399/", //URL para pruebas de en el servidor
});

// Interceptor de solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de respuesta
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hay un intento de reintento
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          `${api.defaults.baseURL}/Usuario/RefreshToken`,
          {
            RefreshToken: refreshToken,
          }
        );

        const token = response.data.accessToken;

        localStorage.setItem("accessToken", token);

        // Reintenta la solicitud original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axios(originalRequest);
      } catch (error) {
        // Maneja el error de refresco del token o redirige al login
        window.location.href = "/Login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
