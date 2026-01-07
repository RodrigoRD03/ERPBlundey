import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const addCategorie = async (object) => {
  const response = await api.post(`/Categoria/Insertar`, object, config);
  return response.data;
};

const getCategories = async () => {
  const response = await api.get(`/Categoria/MostrarCategorias`, config);
  return response.data;
};

const getCategorie = async (ID) => {
  const response = await api.get(
    `/Categoria/MostrarCategoria?ID=${ID}`,
    config
  );
  return response.data;
};

const updateCategorie = async (object) => {
  const response = await api.post(`/Categoria/Actualizar`, object, config);
  return response.data;
};

const addLog = async (log) => {
  const response = await api.post(`/Bitacora/Insertar`, log, config);
  return response.data;
};

export default {
  addCategorie,
  getCategories,
  getCategorie,
  updateCategorie,
  addLog,
};
