import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const addBrand = async (object) => {
  const response = await api.post(`/Marca/Insertar`, object, config);
  return response.data;
};

const getBrands = async () => {
  const response = await api.get(`/Marca/MostrarMarcas`, config);
  return response.data;
};

const getBrand = async (ID) => {
  const response = await api.get(`/Marca/MostrarMarca?ID=${ID}`, config);
  return response.data;
};

const updateBrand = (object) => {
  const response = api.post(`/Marca/Actualizar`, object, config);
  return response;
};

const addLog = async (log) => {
  const response = await api.post(`/Bitacora/Insertar`, log, config);
  return response.data;
};

export default { addBrand, getBrands, getBrand, updateBrand, addLog };
