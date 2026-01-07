import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getBankAccountsSelect = async (type) => {
  const response = await api.get(
    `/CuentaBancaria/MostrarCuentasSelect?Tipo=${type}`,
    config
  );
  return response.data;
};

const paymentConceptSelectNational = async () => {
  const response = await api.get(`/AbonoNacional/MostrarConceptos`, config);
  return response.data;
};

const paymentConceptSelectDolar = async () => {
  const response = await api.get(`/AbonoDolar/MostrarConceptos`, config);
  return response.data;
};

const insertPaymentNational = async (object, config) => {
  const response = await api.post(`/AbonoNacional/Insertar`, object, config);
  return response.data;
};

const insertPaymentDollar = async (object, config) => {
  const response = await api.post(`/AbonoDolar/Insertar`, object, config);
  return response.data;
};

const getPaymentsNational = async () => {
  const response = await api.get(
    `/AbonoNacional/MostrarAbonosNacional`,
    config
  );
  return response.data;
};

const getPaymentsDollar = async () => {
  const response = await api.get(`/AbonoDolar/MostrarAbonosDolar`, config);
  return response.data;
};

const getPaymentDollar = async (ID) => {
  const response = await api.get(`/AbonoDolar/MostrarAbono?ID=${ID}`, config);
  return response.data;
};

const getPaymentNational = async (ID) => {
  const response = await api.get(
    `/AbonoNacional/MostrarAbono?ID=${ID}`,
    config
  );
  return response.data;
};

const updateSubscriptionNational = async (object) => {
  const response = await api.post(`/AbonoNacional/Actualizar`, object, config);
  return response.data;
};

const updateSubscriptionDollar = async (object) => {
  const response = await api.post(`/AbonoDolar/Actualizar`, object, config);
  return response.data;
};

export default {
  getBankAccountsSelect,
  paymentConceptSelectNational,
  paymentConceptSelectDolar,
  insertPaymentNational,
  insertPaymentDollar,
  getPaymentsNational,
  getPaymentsDollar,
  getPaymentNational,
  getPaymentDollar,
  updateSubscriptionNational,
  updateSubscriptionDollar,
};
