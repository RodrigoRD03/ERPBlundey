import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getEnterprisesSupervisor = async (ID) => {
  const response = await api.get(
    `/Empresa/MostrarEmpresasSupervisor?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getEnterprisesFinance = async (ID) => {
  const response = await api.get(
    `/Empresa/MostrarEmpresasFinanzas?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getTaxData = async (ID) => {
  const response = await api.get(
    `/DatosFiscales/MostrarDatosCliente?EmpresaID=${ID}`,
    config
  );
  return response.data;
};

const addTaxData = async (object, email) => {
  const response = await api.post(
    `/DatosFiscales/InsertarCliente?correo=${email}`,
    object,
    config
  );
  return response.data;
};

const updateTaxData = async (object) => {
  const response = await api.post(
    `/DatosFiscales/ActualizarCliente`,
    object,
    config
  );
  return response.data;
};

export default {
  getEnterprisesSupervisor,
  getEnterprisesFinance,
  getTaxData,
  addTaxData,
  updateTaxData,
};
