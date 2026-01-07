import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPendingQuotesSeller = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesPendientesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPendingPricesSupervisor = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesPendientesSupervisor?usuarioID=${ID}`,
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

const acceptQuote = async (object) => {
  const response = await api.post(`/Cotizacion/ConfirmarOrden`, object);
  return response.data;
};

const acceptQuoteSupervisor = async (check, object) => {
  const response = await api.post(
    `/Cotizacion/ConfirmarOrdenSupervisor?CorreoCliente=${check}`,
    object
  );
  return response.data;
};

const cancelQuote = async (object) => {
  const response = await api.post(`/Cotizacion/CancelarCotizacion`, object);
  return response.data;
};

const deleteQuote = async (ID) => {
  const response = await api.get(
    `/Cotizacion/Eliminar?CotizacionID=${ID}`,
    config
  );
  return response.data;
};

const getUserData = async (ID) => {
  const response = await api.get(`/Usuario/MostrarUsuario?ID=${ID}`, config);
  return response.data;
};

const getCustomer = async (ID) => {
  const response = await api.get(`/Cliente/MostrarCliente?ID=${ID}`, config);
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

const deleteItem = async (ID) => {
  const response = await api.get(`/Partida/Eliminar?ID=${ID}`, config);
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

const getCustomersSeller = async (ID) => {
  const response = await api.get(
    `/Cliente/MostrarClientesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getAddresses = async (ID) => {
  const response = await api.get(
    `/LibretaDireccion/MostrarDireccionesCliente?EmpresaID=${ID}`,
    config
  );
  return response.data;
};

const startQuote = async (object) => {
  const response = await api.post(`/Cotizacion/Insertar`, object);
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

const finishQuote = async (object, quoteID, longDescription, sendEmail) => {
  const response = await api.post(
    `/Cotizacion/EnviarCotizacion?cotizacionID=${quoteID}&CL=${longDescription}&CorreoCliente=${sendEmail}`,
    object,
    config
  );
  return response.data;
};

const updatePrice = async (object) => {
  const response = await api.post(`/Cotizacion/Actualizar`, object, config);
  return response.data;
};

const addDiscountItem = async (ID, discount) => {
  const response = await api.get(
    `/Partida/AgregarDescuento?ID=${ID}&descuento=${discount}`,
    config
  );
  return response.data;
};

const getFilesList = async (ID) => {
  const response = await api.get(
    `/ArchivosOrdenCompra/MostrarArchivosCotizacion?CotizacionID=${ID}`,
    config
  );
  return response.data;
};

const uploadFile = async (object) => {
  const response = await api.post(
    `/ArchivosOrdenCompra/Insertar`,
    object,
    config
  );
  return response.data;
};

const deleteFile = async (ID) => {
  const response = await api.get(
    `/ArchivosOrdenCompra/Eliminar?ID=${ID}`,
    config
  );
  return response.data;
};

const viewFileComplete = async (ID) => {
  const response = await api.get(
    `/ArchivosOrdenCompra/MostrarArchivoPDF?ID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getPendingQuotesSeller,
  getPendingPricesSupervisor,
  getBase,
  acceptQuote,
  acceptQuoteSupervisor,
  cancelQuote,
  deleteQuote,
  getUserData,
  getCustomer,
  getAddress,
  getQuoteData,
  deleteItem,
  getSatUnits,
  createItem,
  getCustomersSeller,
  getAddresses,
  startQuote,
  getProductsSelect,
  getPriceProduct,
  addProductItem,
  dateDelivery,
  getServicesSelect,
  getPriceService,
  addServiceItem,
  deleteProductItem,
  deleteServiceItem,
  getConditionsDelivery,
  getCondtionsPayment,
  addComercialConditions,
  finishQuote,
  updatePrice,
  addDiscountItem,
  getFilesList,
  uploadFile,
  deleteFile,
  viewFileComplete,
};
