import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getAllProductsInventory = async () => {
  const response = await api.get(
    `/ProductoInventario/MostrarProductosInventario`,
    config
  );
  return response.data;
};

const insertProducts = async (object) => {
  const response = await api.post(
    `/ProductoInventario/Insertar`,
    object,
    config
  );
  return response.data;
};

const getProduct = async (ID) => {
  const response = await api.get(
    `/ProductoInventario/MostrarProducto?ID=${ID}`,
    config
  );
  return response.data;
};

const updateProduct = async (object) => {
  const response = await api.post(
    `/ProductoInventario/Actualizar`,
    object,
    config
  );
  return response.data;
};

const getProductsAddress = async (ProductInventoryID, warehouseID) => {
  const response = await api.get(
    `/UbicacionProducto/MostrarUbicacionesProducto?productoInventarioID=${ProductInventoryID}&AlmacenID=${warehouseID}`,
    config
  );
  return response.data;
};

const checkBarCode = async (barcode) => {
  const response = await api.get(
    `/ProductoInventario/MostrarProductoPorLector?CodigoBarras=${barcode}`
  );
  return response.data;
};

const getAllWarehouses = async () => {
  const response = await api.get(`/Almacen/MostrarAlmacenes`, config);
  return response.data;
};

const getModel = async (Model) => {
  const response = await api.get(
    `/ProductoInventario/MostrarProductoPorModelo?Modelo=${Model}`,
    config
  );
  return response.data;
};

const insertInputs = async (object) => {
  const response = await api.post(
    `/MovimientoInventarioDetalle/Insertar`,
    object,
    config
  );
  return response.data;
};

const InsertInventoryMovement = async (object) => {
  const response = await api.post(
    `/MovimientoInventario/Insertar`,
    object,
    config
  );
  return response.data;
};

const getInventoryMovementWatch = async (ID) => {
  const response = await api.get(
    `/MovimientoInventario/MostrarDetalle?MovimientoInventarioID=${ID}`,
    config
  );
  return response.data;
};

const postFinishMovement = async (object) => {
  const response = await api.post(
    `/MovimientoInventario/FinalizarMovimiento`,
    object,
    config
  );
  return response.data;
};

const watchAddressOutsideView = async (ID) => {
  const response = await api.get(
    `/UbicacionProducto/MostrarUbicacionesProducto?ProductoInventarioID=${ID}`,
    config
  );
  return response.data;
};

const getServicesSelect = async () => {
  const response = await api.get(`/Servicio/MostrarServiciosSelect`, config);
  return response.data;
};

const insertServiceInMovement = async (object) => {
  const response = await api.post(
    `/MovimientoServicioDetalle/Insertar`,
    object,
    config
  );
  return response.data;
};

const getGeneralInventoryReport = async () => {
  const response = await api.get(
    `/UbicacionProducto/ReporteGeneralInventario`,
    config
  );
  return response.data;
};

export default {
  getAllProductsInventory,
  insertProducts,
  getProduct,
  updateProduct,
  getProductsAddress,
  checkBarCode,
  getAllWarehouses,
  insertInputs,
  InsertInventoryMovement,
  getModel,
  getInventoryMovementWatch,
  postFinishMovement,
  watchAddressOutsideView,
  getServicesSelect,
  insertServiceInMovement,
  getGeneralInventoryReport,
};
