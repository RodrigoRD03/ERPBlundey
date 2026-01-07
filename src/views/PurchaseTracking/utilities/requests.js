import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPurchaseTracking = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedor/MostrarOrdenesCompras?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPurchaseTrackingSupervisor = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedor/MostrarOrdenesComprasSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPdfPurchase = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedor/MostrarOrdenesCompraPDF?OrdenCompraProveedorID=${ID}`,
    config
  );
  return response.data;
};

const checkReceiptOrder = async (object) => {
  const response = await api.post(`/RecepcionCompra/Insertar`, object, config);
  return response.data;
};

const addInsertFiles = async (ID, object) => {
  const response = await api.post(
    `/OrdenCompraProveedor/EnviarOrdenCompraProveedor?OrdenCompraProveedorID=${ID}`,
    object,
    config
  );
  return response.data;
};

const getOrderPurchasePS = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedor/MostrarOrdenesCompraPS?OrdenCompraProveedorID=${ID}`,
    config
  );
  return response.data;
};

const deleteProductOrderPurchase = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedorProducto/Eliminar?ordenCompraProveedorProductoID=${ID}`,
    config
  );
  return response.data;
};

const deleteServiceOrderPurchase = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedorServicio/Eliminar?ordenCompraProveedorServicioID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getPurchaseTracking,
  getPurchaseTrackingSupervisor,
  getPdfPurchase,
  checkReceiptOrder,
  addInsertFiles,
  getOrderPurchasePS,
  deleteProductOrderPurchase,
  deleteServiceOrderPurchase,
};
