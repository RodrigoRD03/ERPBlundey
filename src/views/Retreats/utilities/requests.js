import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getRetreatsNational = async () => {
  const response = await api.get(
    `/RetiroNacional/MostrarRetirosNacional`,
    config
  );
  return response.data;
};

const getRetreatsDolar = async () => {
  const response = await api.get(`/RetiroDolar/MostrarRetirosDolar`, config);
  return response.data;
};

const getBankAccounts = async (type) => {
  const response = await api.get(
    `/CuentaBancaria/MostrarCuentasSelect?Tipo=${type}`,
    config
  );
  return response.data;
};

const getConceptsNational = async () => {
  const response = await api.get(`/RetiroNacional/MostrarConceptos`, config);
  return response.data;
};

const getConceptsDollar = async () => {
  const response = await api.get(`/RetiroDolar/MostrarConceptos`, config);
  return response.data;
};

const insertRetreatNational = async (object) => {
  const response = await api.post(`/RetiroNacional/Insertar`, object, config);
  return response.data;
};

const insertRetreatDollar = async (object) => {
  const response = await api.post(`/RetiroDolar/Insertar`, object, config);
  return response.data;
};

const getRetreatDollar = async (ID) => {
  const response = await api.get(`/RetiroDolar/MostrarRetiro?ID=${ID}`, config);
  return response.data;
};

const getRetreatNational = async (ID) => {
  const response = await api.get(
    `/RetiroNacional/MostrarRetiro?ID=${ID}`,
    config
  );
  return response.data;
};

const updateRetreatNational = async (object) => {
  const response = await api.post(`/RetiroNacional/Actualizar`, object, config);
  return response.data;
};

const updateRetreatDollar = async (object) => {
  const response = await api.post(`/RetiroDolar/Actualizar`, object, config);
  return response.data;
};

export default {
  getRetreatsNational,
  getRetreatsDolar,
  getBankAccounts,
  getConceptsNational,
  getConceptsDollar,
  insertRetreatNational,
  insertRetreatDollar,
  getRetreatDollar,
  getRetreatNational,
  updateRetreatNational,
  updateRetreatDollar,
};
