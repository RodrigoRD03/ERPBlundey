import axios from "axios";
import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};
const apiToken =
  "264a9b6b51819d11ec1fa3a71ec4cf3d9fc0180b1691a1b1ca6e4d6dfc23dd16";

const getCustomersSeller = async (ID) => {
  const response = await api.get(
    `/Cliente/MostrarClientesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getUserValidate = async (ID) => {
  const response = await api.get(
    `/VendedorInfo/Validar?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getCustomer = async (ID) => {
  const response = await api.get(`/Cliente/MostrarCliente?ID=${ID}`, config);
  return response.data;
};

const getAddresses = async (ID) => {
  const response = await api.get(
    `/LibretaDireccion/MostrarDireccionesCliente?EmpresaID=${ID}`,
    config
  );
  return response.data;
};

const getDollarPrice = async () => {
  const response = await axios.get(
    `https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos?token=${apiToken}&mediaType=json&locale=es`
  );
  return response.data;
};

const startQuote = async (object) => {
  const response = await api.post(`/Cotizacion/Insertar`, object);
  return response.data;
};

const getUserData = async (ID) => {
  const response = await api.get(`/Usuario/MostrarUsuario?ID=${ID}`, config);
  return response.data;
};

const getAddress = async (ID) => {
  const response = await api.get(
    `/LibretaDireccion/MostrarDireccion?ID=${ID}`,
    config
  );
  return response.data;
};

const getQuoteData = async (ID) => {
  const response = await api.get(
    `/Cotizacion/MostrarProductosServiciosPartidasCotizacion?CotizacionID=${ID}`
  );
  return response.data;
};

const getSatUnits = async () => {
  const response = await api.get(`/UnidadesSat/MostrarUnidades`, config);
  return response.data;
};

const createItem = async (object) => {
  const response = await api.post(`/Partida/Insertar`, object, config);
  return response.data;
};

const getProductsSelect = async () => {
  const response = await api.get(`/Producto/MostrarProductosSelect`, config);
  return response.data;
};

const getPriceProduct = async (ID) => {
  const response = await api.get(
    `/Producto/MostrarPrecioProducto?ID=${ID}`,
    config
  );
  return response.data;
};

const addProductItem = async (object) => {
  const resposne = await api.post(`/ProductoPartida/Insertar`, object, config);
  return resposne.data;
};

const dateDelivery = async (ID, date) => {
  const response = await api.get(
    `/Partida/TiempoEntrega?ID=${ID}&TiempoEntrega=${date}`,
    config
  );
  return response.data;
};

const getServicesSelect = async () => {
  const response = await api.get(`/Servicio/MostrarServiciosSelect`, config);
  return response.data;
};

const getPriceService = async (ID) => {
  const response = await api.get(
    `/Servicio/MostrarPrecioServicio?ID=${ID}`,
    config
  );
  return response.data;
};

const addServiceItem = async (object) => {
  const response = await api.post(`/ServicioPartida/Insertar`, object, config);
  return response.data;
};

const deleteItem = async (ID) => {
  const response = await api.get(`/Partida/Eliminar?ID=${ID}`, config);
  return response.data;
};

const deleteProductItem = async (ID) => {
  const response = await api.get(`/ProductoPartida/Eliminar?ID=${ID}`, config);
  return response.data;
};

const deleteServiceItem = async (ID) => {
  const response = await api.get(`/ServicioPartida/Eliminar?ID=${ID}`, config);
  return response.data;
};

const getConditionsDelivery = async () => {
  const response = await api.get(
    `/CondicionesComerciales/MostrarCondicionesEntrega`,
    config
  );
  return response.data;
};

const getCondtionsPayment = async () => {
  const response = await api.get(
    `/CondicionesComerciales/MostrarCondicionesPago`,
    config
  );
  return response.data;
};

const addComercialConditions = async (object) => {
  const response = await api.post(
    `/Cotizacion/AgregarCondicionesComerciales`,
    object,
    config
  );
  return response.data;
};

const getBase = async (object) => {
  const response = await api.get(
    `/Cotizacion/MostrarCotizacionPDF?cotizacionID=${object}&CL=false`,
    config
  );
  return response.data;
};

const finishQuote = async (object, quoteID, longDescription, sendEmail) => {
  const response = await api.post(
    `/Cotizacion/EnviarCotizacion?cotizacionID=${quoteID}&CL=${longDescription}&CorreoCliente=${sendEmail}`,
    object,
    config
  );
  return response.data;
};

export default {
  getUserValidate,
  getCustomersSeller,
  getAddresses,
  getCustomer,
  getDollarPrice,
  startQuote,
  getUserData,
  getAddress,
  getQuoteData,
  getSatUnits,
  createItem,
  getProductsSelect,
  getPriceProduct,
  addProductItem,
  dateDelivery,
  getServicesSelect,
  getPriceService,
  addServiceItem,
  deleteItem,
  deleteProductItem,
  deleteServiceItem,
  getConditionsDelivery,
  getCondtionsPayment,
  addComercialConditions,
  getBase,
  finishQuote,
};
