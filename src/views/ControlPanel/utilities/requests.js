import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getProductsCount = async () => {
  const response = await api.get(`/Producto/PanelControl`, config);
  return response.data;
};

const getServices = async () => {
  const response = await api.get(`/Servicio/MostrarServicios`, config);
  return response.data;
};

const getCustomersAdmin = async () => {
  const response = await api.get(`/Cliente/MostrarClientes`, config);
  return response.data;
};

const getCustomersSupervisor = async (ID) => {
  const response = await api.get(
    `/Cliente/MostrarClientesSupervisorSelect?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getCustomersSellers = async (ID) => {
  const response = await api.get(
    `/Cliente/MostrarClientesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getEnterprisesAdmin = async () => {
  const response = await api.get(`/Empresa/MostrarEmpresas`, config);
  return response.data;
};

const getEnterprisesSupervisor = async (ID) => {
  const response = await api.get(
    `/Empresa/MostrarEmpresasSupervisor?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getEnterprisesSeller = async (ID) => {
  const response = await api.get(
    `Empresa/MostrarEmpresasVendedor?UsuarioID=${ID}`,
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

const getPricesCompleteSupervisor = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesCompletadasMesSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPricesCancelSupervisor = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesCanceladasMesSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPricePendingAdmin = async () => {
  const response = await api.get(`/Cotizacion/CotizacionesPendientes`, config);
  return response.data;
};

const getPriceCompleteAdmin = async () => {
  const response = await api.get(
    `/Cotizacion/CotizacionesCompletadasMes`,
    config
  );
  return response.data;
};

const getPricesCancelAdmin = async () => {
  const response = await api.get(
    `/Cotizacion/CotizacionesCanceladasMes`,
    config
  );
  return response.data;
};

const getPricesPendingSeller = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesPendientesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPricesCompleteSeller = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesCompletadasMesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPricesCancelSeller = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesCanceladasMesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPricesChartAdmin = async () => {
  const response = await api.get(`/Cotizacion/CotizacionesGrafica`, config);
  return response.data;
};

const getPricesChartSupervisor = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesGraficaSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPricesChartSeller = async (ID) => {
  const response = await api.get(
    `/Cotizacion/CotizacionesGraficaVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getCommissionsSeller = async (ID) => {
  const response = await api.get(
    `/Comision/MetasMesVendedor?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getCommissionsSupervisor = async (ID) => {
  const response = await api.get(
    `/Comision/MetasMesVendedoresSupervisor?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getProductsCount,
  getServices,
  getCustomersAdmin,
  getCustomersSupervisor,
  getCustomersSellers,
  getEnterprisesAdmin,
  getEnterprisesSupervisor,
  getEnterprisesSeller,
  getPendingPricesSupervisor,
  getPricesCompleteSupervisor,
  getPricesCancelSupervisor,
  getPricePendingAdmin,
  getPriceCompleteAdmin,
  getPricesCancelAdmin,
  getPricesPendingSeller,
  getPricesCompleteSeller,
  getPricesCancelSeller,
  getPricesChartAdmin,
  getPricesChartSupervisor,
  getPricesChartSeller,
  getCommissionsSeller,
  getCommissionsSupervisor,
};
