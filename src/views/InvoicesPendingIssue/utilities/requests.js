import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getInvoiceDataCustomer = async () => {
  const response = await api.get(
    `/OrdenVenta/MostrarOrdenesPorFacturar`,
    config
  );
  return response.data;
};

const uploadXML = async (object) => {
  const response = await api.post(
    `/Facturas/MostrarDatosFacturaCliente`,
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

// const insertPaidAddon = async (object) => {
//   const response = await api.post(`/ComplementoPagos/Insertar`, object, config);
//   return response.data;
// };

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

const getDataForms = async (ID) => {
  const resppnse = await api.get(`/Facturacion/DatosFactura?ordenVentaID=${ID}`, config);
  return resppnse.data;
};

const insertPaidAddon = async (ID, object) => {
  const resppnse = await api.post(`/Facturacion/CrearFactura?ordenVentaID=${ID}`, object, config);
  return resppnse.data;
};


export default {
  getInvoiceDataCustomer,
  uploadXML,
  insertInvoice,
  insertPaidAddon,
  getInvoiceDocumentDownload,
  getPaidAddons,
  getMissingAddons,
  getDataForms,
};
