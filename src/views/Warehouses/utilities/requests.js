import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getAllWarehouses = async () => {
  const response = await api.get(`/Almacen/MostrarAlmacenes`, config);
  return response.data;
};

const insertWarehouse = async (object) => {
  const response = await api.post(`/Almacen/Insertar`, object, config);
  return response.data;
};

const getWarehouse = async (ID) => {
  const response = await api.get(`/Almacen/MostrarAlmacen?ID=${ID}`, config);
  return response.data;
};

const updateWarehouse = async (object) => {
  const response = await api.post(`/Almacen/Actualizar`, object, config);
  return response.data;
};

const getMoventsInventary = async (ID) => {
  const response = await api.get(
    `/MovimientoInventario/MostrarMovimientosAlmacen?AlmacenID=${ID}`,
    config
  );
  return response.data;
};

const getMovementDetails = async (ID, warehouseID) => {
  const response = await api.get(
    `MovimientoInventario/MostrarMovimientosDetalle?MovimientoInventarioID=${ID}&AlmacenID=${warehouseID}`,
    config
  );
  return response.data;
};

const insertDocument = async (object) => {
  const response = await api.post(
    `/MovimientoInventario/AgregarDocumentoSalida`,
    object,
    config
  );
  return response.data;
};

const getDocumentPDF = async (ID) => {
  const response = await api.get(
    `/DocumentoRespaldo/ObtenerDocumentosRespaldo?ID=${ID}`,
    config
  );
  return response.data;
};

const getReport = async (ID) => {
  const response = await api.get(
    `/MovimientoInventario/ReporteMovimientosAlmacen?AlmacenID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getAllWarehouses,
  insertWarehouse,
  getWarehouse,
  updateWarehouse,
  getMoventsInventary,
  getMovementDetails,
  insertDocument,
  getDocumentPDF,
  getReport,
};
