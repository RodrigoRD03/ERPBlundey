import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getInvoiceDataSupplier = async () => {
  const response = await api.get(
    `/Facturas/MostrarFacturasPendientesRecibidas`,
    config
  );
  return response.data;
};

const uploadXML = async (object) => {
  const response = await api.post(
    `/Facturas/MostrarDatosFacturaProveedor`,
    object,
    config
  );
  return response.data;
};

const insertInvoice = async (object, check) => {
  const response = await api.post(
    `/Facturas/Insertar?CorreoCliente=${check}`,
    object,
    config
  );
  return response.data;
};

const insertPaidAddon = async (object) => {
  const response = await api.post(`/ComplementoPagos/Insertar`, object, config);
  return response.data;
};

const getInvoiceDocumentDownload = async (ID, type) => {
  const response = await api.get(
    `/Facturas/Descargar?ID=${ID}&Tipo=${type}`,
    config
  );
  return response.data;
};

const getPaidAddons = async (ID) => {
  const response = await api.get(
    `/ComplementoPagos/MostrarComplementosPagos?FacturaID=${ID}`,
    config
  );
  return response.data;
};

const getMissingAddons = async (ID) => {
  const response = await api.get(`/Facturas/GetFaltantesPDF?ID=${ID}`, config);
  return response.data;
};

const getSupplierInvoiceData = async (ID) => {
  const response = await api.get(
    `/Facturas/MostrarDatosFacturaProveedor?OrdenCompraProveedorID=${ID}`,
    config
  );
  return response;
};

const insertInvoiceReceipt = async (object) => {
  const response = await api.post(`/Facturas/Insertar`, object, config);
  return response;
};

const insertInvoiceReceiptManual = async (object) => {
  const response = await api.post(`/Facturas/InsertarManual`, object, config);
  return response;
};

export default {
  getInvoiceDataSupplier,
  uploadXML,
  insertInvoice,
  insertPaidAddon,
  getInvoiceDocumentDownload,
  getPaidAddons,
  getMissingAddons,
  getSupplierInvoiceData,
  insertInvoiceReceipt,
  insertInvoiceReceiptManual,
};
