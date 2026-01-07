import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getHistorySales = async (ID) => {
  const response = await api.get(
    `/OrdenVenta/MostrarOrdenesVentasHistorial?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getHistorySalesDates = async (ID, object) => {
  const response = await api.post(
    `/OrdenVenta/MostrarOrdenesVentasHistorialFechas?usuarioID=${ID}`,
    object,
    config
  );
  return response.data;
};

export default {
  getHistorySales,
  getHistorySalesDates,
};
