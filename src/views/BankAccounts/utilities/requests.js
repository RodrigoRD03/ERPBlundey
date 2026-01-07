import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const insertBankAccount = async (object) => {
  const response = await api.post(`/CuentaBancaria/Insertar`, object, config);
  return response.data;
};

const getBankAccounts = async () => {
  const response = await api.get(`/CuentaBancaria/MostrarCuentas`, config);
  return response.data;
};

const getBankAccountsSelect = async (type) => {
  const response = await api.get(
    `/CuentaBancaria/MostrarCuentasSelect?Tipo=${type}`,
    config
  );
  return response.data;
};

const addCurrencyExchange = async (object) => {
  const response = await api.post(`/CambioDivisas/Insertar`, object, config);
  return response.data;
};

const updateBankAccounts = async (object) => {
  const response = await api.post(`/CuentaBancaria/Actualizar`, object);
  return response.data;
};

const getBankAccount = async (ID) => {
  const response = await api.get(`/CuentaBancaria/MostrarCuenta?ID=${ID}`);
  return response.data;
};

const getReportAnioExcel = async (anio, ID) => {
  const response = await api.get(
    `/ReportesFinancieros/ReporteExcelAnio?Anio=${anio.getFullYear()}&CuentaBancariaID=${ID}`,
    config
  );
  return response.data;
};

const getReportRangeExcel = async (object) => {
  const response = await api.post(
    `/ReportesFinancieros/ReporteExcelFechas`,
    object,
    config
  );
  return response.data;
};

export default {
  insertBankAccount,
  getBankAccounts,
  getBankAccountsSelect,
  addCurrencyExchange,
  updateBankAccounts,
  getBankAccount,
  getReportAnioExcel,
  getReportRangeExcel,
};
