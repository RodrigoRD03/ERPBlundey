import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getRelatedDocuments = async () => {
  const response = await api.get(
    `/Facturacion/MostrarFacturasConRelaciones`,
    config
  );
  return response.data;
};

const getRelatedDocumentsByFacturaUID = async (FacturaUID) => {
  const response = await api.get(
    `/Facturacion/MostrarFacturasRelacionadas?FacturaUID=${FacturaUID}`,
    config
  );
  return response.data;
};

const getInvoiceDocumentDownload = async (ID, type) => {
  const response = await api.get(
    `/Facturacion/DescargarFactura?uid=${ID}&tipo=${type}`,
    config
  );
  return response.data;
};

export default {
  getRelatedDocuments,
  getRelatedDocumentsByFacturaUID,
  getInvoiceDocumentDownload,
};
