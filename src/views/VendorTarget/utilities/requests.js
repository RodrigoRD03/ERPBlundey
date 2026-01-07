import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getVendorsInfo = async (ID) => {
  const response = await api.get(
    `/VendedorInfo/MostrarVendedoresInformacion?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const addVendorsInfo = async (object) => {
  const response = await api.post(`/VendedorInfo/Insertar`, object, config);
  return response.data;
};

const getVendorsSelect = async (ID) => {
  const response = await api.get(
    `/VendedorInfo/MostrarVendedores?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getVendorTarget = async (ID) => {
  const response = await api.get(
    `/VendedorInfo/MostrarVendedorInformacion?ID=${ID}`,
    config
  );
  return response.data;
};

const updateVendorsTarget = async (object) => {
  const response = await api.post(`/VendedorInfo/Actualizar`, object, config);
  return response.data;
};

export default {
  getVendorsInfo,
  addVendorsInfo,
  getVendorsSelect,
  updateVendorsTarget,
  getVendorTarget,
};
