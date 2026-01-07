import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPurchaseOrders = async (ID) => {
  const response = await api.get(
    `/OrdenCompra/MostrarCotizacionesOrdenCompra?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPotentialSuppliers = async (ID) => {
  const response = await api.get(
    `/OrdenCompra/MostrarPosiblesProveedores?ordenVentaID=${ID}`,
    config
  );
  return response.data;
};

const getSellersSelect = async () => {
  const response = await api.get(
    `/Proveedores/MostrarProveedoresSelect`,
    config
  );
  return response.data;
};

const insertPurchaseOrder = async (object) => {
  const response = await api.post(`/OrdenCompra/Insertar`, object, config);
  return response.data;
};

const addOrderSupplier = async (object) => {
  const response = await api.post(
    `/OrdenCompraProveedor/Insertar`,
    object,
    config
  );
  return response.data;
};

const getProductsServices = async (ID) => {
  const response = await api.get(
    `/Partida/MostrarPartidasOrdenCompra?CotizacionID=${ID}`,
    config
  );
  return response.data;
};

const addPurchaseOrderProduct = async (object) => {
  const response = await api.post(
    `/OrdenCompraProveedorProducto/Insertar`,
    object,
    config
  );
  return response.data;
};

const addPurchaseOrderService = async (object) => {
  const response = await api.post(
    `/OrdenCompraProveedorServicio/Insertar`,
    object,
    config
  );
  return response.data;
};

const addComercialConditions = async (object) => {
  const response = await api.post(
    `/OrdenCompraProveedor/CondicionesComerciales`,
    object,
    config
  );
  return response.data;
};

export default {
  getPurchaseOrders,
  getPotentialSuppliers,
  getSellersSelect,
  insertPurchaseOrder,
  addOrderSupplier,
  getProductsServices,
  addPurchaseOrderProduct,
  addPurchaseOrderService,
  addComercialConditions,
};
