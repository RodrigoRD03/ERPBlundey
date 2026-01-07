import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const addCustomer = async (object, check) => {
  const response = await api.post(
    `/Cliente/Insertar?CorreoCliente=${check}`,
    object,
    config
  );
  return response.data;
};

const getCustomers = async () => {
  const response = await api.get(`/Cliente/MostrarClientes`, config);
  return response.data;
};

const getCustomersSellers = async (ID) => {
  const response = await api.get(
    `/Cliente/MostrarClientesVendedor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getCustomersSupervisor = async (ID) => {
  const response = await api.get(
    `/Cliente/MostrarClientesSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getEnterprisesSelect = async (ID) => {
  const response = await api.get(
    `/Empresa/MostrarEmpresasSelect?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getCustomer = async (ID) => {
  const response = await api.get(`/Cliente/MostrarCliente?ID=${ID}`, config);
  return response.data;
};

const updateCustomer = async (object) => {
  const response = await api.post(`/Cliente/Actualizar`, object, config);
  return response.data;
};

const addLog = async (log) => {
  const response = await api.post(`/Bitacora/Insertar`, log, config);
  return response.data;
};

export default {
  addCustomer,
  getCustomers,
  getCustomersSellers,
  getCustomersSupervisor,
  getEnterprisesSelect,
  getCustomer,
  updateCustomer,
  addLog,
};
