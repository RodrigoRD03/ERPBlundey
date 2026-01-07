import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getInvoicesIssued = async () => {
  const response = await api.get(`/Facturacion/MostrarFacturas`, config);
  return response.data;
};

const getInvoiceDocumentDownload = async (ID, type) => {
  const response = await api.get(
    `/Facturacion/DescargarFactura?uid=${ID}&tipo=${type}`,
    config
  );
  return response.data;
};

const getRange = async (object) => {
  const response = await api.post(
    `/Facturas/HistorialFechasFacturasEmitidas`,
    object,
    config
  );
  return response.data;
};

const replacementInvoices = async (UID) => {
  const response = await api.get(
    `/Facturacion/FacturasSustitutas?uid=${UID}`,
    config
  );
  return response.data;
};

const postCancelIssueAPI = async (UID, motivo, folioSustituto) => {
  const response = await api.post(
    `/Facturacion/CancelarFacturaAPI?uid=${UID}&motivo=${motivo}&folioSustituto=${folioSustituto}`,
    config
  );
  return response.data;
};

const postCancelIssue = async (UID) => {
  const response = await api.post(
    `/Facturacion/CancelarFactura?uid=${UID}`,
    config
  );
  return response.data;
};

export default {
  getInvoicesIssued,
  getInvoiceDocumentDownload,
  getRange,
  replacementInvoices,
  postCancelIssueAPI,
  postCancelIssue,
};
