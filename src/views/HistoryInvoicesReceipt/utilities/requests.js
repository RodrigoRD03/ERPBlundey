import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getInvoicesReceipt = async () => {
  const response = await api.get(
    `/Facturas/HistorialFacturasRecibidas`,
    config
  );
  return response.data;
};

const getInvoiceDocumentDownload = async (ID, type) => {
  const response = await api.get(
    `/Facturas/Descargar?ID=${ID}&Tipo=${type}`,
    config
  );
  return response.data;
};

const getRange = async (object) => {
  const response = await api.post(
    `/Facturas/HistorialFechasFacturasRecibidas`,
    object,
    config
  );
  return response.data;
};

export default {
  getInvoicesReceipt,
  getInvoiceDocumentDownload,
  getRange,
};
