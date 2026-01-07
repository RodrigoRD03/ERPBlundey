import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getHistoryQuotesAdmin = async () => {
  const response = await api.get(`/Cotizacion/CotizacionesHistorial`, config);
  return response.data;
};

const getHistoryQuotesSupervisor = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesHistorialSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getHistoryQuotesSeller = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesHistorialVendedor?usuarioID=${ID}`,
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

const getHistoryQuotesDatesAdmin = async (object) => {
  const response = await api.post(
    `/Cotizacion/CotizacionesHistorialFechas`,
    object,
    config
  );
  return response.data;
};

const getHistoryQuotessDatesSupervisor = async (object) => {
  const response = await api.post(
    `/Cotizacion/CotizacionesHistorialFechasSupervisor`,
    object,
    config
  );
  return response.data;
};

const getHistoryQuotesDatesSeller = async (object) => {
  const response = await api.post(
    `/Cotizacion/CotizacionesHistorialFechasVendedor`,
    object,
    config
  );
  return response.data;
};

const uploadFile = async (newObject, config) => {
  const response = await api.post(`/ArchivosOrdenCompra/Insertar`, config);
  return response.data;
};

const revokeQuote = async (ID) => {
  const response = await api.get(
    `/Cotizacion/RevocarCotizacion?CotizacionID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getHistoryQuotesAdmin,
  getHistoryQuotesSupervisor,
  getHistoryQuotesSeller,
  getBase,
  getHistoryQuotesDatesAdmin,
  getHistoryQuotessDatesSupervisor,
  getHistoryQuotesDatesSeller,
  revokeQuote,
};
