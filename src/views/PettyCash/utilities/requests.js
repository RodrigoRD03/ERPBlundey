import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getRegisters = async () => {
  const response = await api.get(`/CajaChica/MostrarRegistros`, config);
  return response.data;
};

const getChecks = async () => {
  const response = await api.get(`/RetiroNacional/MostrarCheques`, config);
  return response.data;
};

const addCheck = async (object) => {
  const response = await api.post(`/CajaChica/IngresarCheque`, object, config);
  return response.data;
};

const getConcepts = async () => {
  const response = await api.get(`/CajaChica/MostrarNoFacturas`, config);
  return response.data;
};

const addRegister = async (object) => {
  const response = await api.post(`/CajaChica/Insertar`, object, config);
  return response.data;
};

const getRegister = async (ID) => {
  const response = await api.get(`/CajaChica/MostrarRegistro?ID=${ID}`, config);
  return response.data;
};

const updateRegister = async (object) => {
  const response = await api.post(`/CajaChica/Actualizar`, object, config);
  return response.data;
};

export default {
  getRegisters,
  getChecks,
  addCheck,
  getConcepts,
  addRegister,
  getRegister,
  updateRegister,
};
