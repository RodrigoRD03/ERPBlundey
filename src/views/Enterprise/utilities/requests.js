import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
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

const addEnterprises = async (object) => {
  const response = await api.post(`/Empresa/Insertar`, object, config);
  return response.data;
};

const getEnterprise = async (ID) => {
  const response = await api.get(`/Empresa/MostrarEmpresa?ID=${ID}`, config);
  return response.data;
};

const updateEnterprises = async (object) => {
  const response = await api.post(`/Empresa/Actualizar`, object, config);
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

export default {
  getEnterprisesAdmin,
  getEnterprisesSupervisor,
  getEnterprisesSeller,
  addEnterprises,
  getEnterprise,
  updateEnterprises,
  getAddresses,
  addAddress,
  getAddress,
  updateAddress,
  addLog,
};
