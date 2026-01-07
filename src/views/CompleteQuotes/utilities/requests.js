import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getCompleteQuotes = async (ID) => {
  const response = await api.get(
    `/Cotizacion/MostrarCotizacionesOrdenVenta?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getBase = async (object) => {
  const response = await api.get(
    `/Cotizacion/MostrarCotizacionPDF?cotizacionID=${object}&CL=false`,
    config
  );
  return response.data;
};

const addSaleOrder = async (object) => {
  const response = await api.post(`/OrdenVenta/Insertar`, object, config);
  return response.data;
};

export default {
  getCompleteQuotes,
  getBase,
  addSaleOrder,
};
