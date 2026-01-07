import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const addService = async (object) => {
  const response = await api.post(`/Servicio/Insertar`, object, config);
  return response.data;
};

const getServices = async () => {
  const response = await api.get(`/Servicio/MostrarServicios`, config);
  return response.data;
};

const getService = async (ID) => {
  const response = await api.get(`/Servicio/MostrarServicio?ID=${ID}`, config);
  return response.data;
};

const updateService = async (object) => {
  const response = await api.post(`/Servicio/Actualizar`, object, config);
  return response.data;
};

const deleteService = async (ID) => {
  const response = await api.get(`/Servicio/Eliminar?ID=${ID}`, config);
  return response.data;
};

const addLog = async (log) => {
  const response = await api.post(`/Bitacora/Insertar`, log, config);
  return response.data;
};

export default {
  addService,
  getServices,
  getService,
  updateService,
  deleteService,
  addLog,
};
