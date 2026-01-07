import api from "../../../Api/api";
import axios from "axios";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const apiToken =
  "264a9b6b51819d11ec1fa3a71ec4cf3d9fc0180b1691a1b1ca6e4d6dfc23dd16";

const getProducts = async () => {
  const response = await api.get(`/Producto/MostrarProductos`, config);
  return response.data;
};

const getBrands = async () => {
  const response = await api.get(`/Marca/MostrarMarcasProducto`, config);
  return response.data;
};

const getCategories = async () => {
  const response = await api.get(`/Categoria/MostrarCategorias`, config);
  return response.data;
};

const addProduct = async (object) => {
  const response = await api.post(`/Producto/Insertar`, object, config);
  return response.data;
};

const getProduct = async (ID) => {
  const response = await api.get(`/Producto/MostrarProducto?ID=${ID}`, config);
  return response.data;
};

const updateProduct = async (object) => {
  const response = await api.post(`/Producto/Actualizar`, object, config);
  return response.data;
};

const deleteProduct = async (ID) => {
  const response = await api.get(`/Producto/Eliminar?ID=${ID}`, config);
  return response.data;
};

const getAddresses = async (ID) => {
  const response = await api.get(
    `/LibretaDireccion/MostrarDireccionesCliente?EmpresaID=${ID}`,
    config
  );
  return response.data;
};

const addAddress = async (object) => {
  const response = await api.post(`/LibretaDireccion/Insertar`, object, config);
  return response;
};

const getAddress = async (ID) => {
  const response = await api.get(
    `/LibretaDireccion/MostrarDireccion?ID=${ID}`,
    config
  );
  return response.data;
};

const updateAddress = async (object) => {
  const response = await api.post(
    `/LibretaDireccion/Actualizar`,
    object,
    config
  );
  return response.data;
};

const addLog = async (log) => {
  const response = await api.post(`/Bitacora/Insertar`, log, config);
  return response.data;
};

const getDollarPrice = async () => {
  const response = await axios.get(
    `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos?token=${apiToken}&mediaType=json&locale=es`
  );
  return response.data;
};

const updatePrices = async (object) => {
  const response = await api.post(
    `/Producto/ActualizarPrecioProductosMarca?categoriaID=${object.categoryID}&marcaID=${object.brandID}&porcentaje=${object.percentage}`,
    object,
    config
  );
  return response.data;
};

export default {
  getProducts,
  getBrands,
  getCategories,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getAddresses,
  addAddress,
  getAddress,
  updateAddress,
  addLog,
  getDollarPrice,
  updatePrices,
};
