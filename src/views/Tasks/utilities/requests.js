import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const insertTasks = async (object) => {
  const response = await api.post(`/Tarea/Insertar`, object, config);
  return response.data;
};

const getTasks = async (ID) => {
  const response = await api.get(
    `/Tarea/MostrarPendientes?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const completeTask = async (ID) => {
  const response = await api.get(`/Tarea/Finalizar?ID=${ID}`, config);
  return response.data;
};

const getFilesTasks = async (ID) => {
  const response = await api.get(
    `/TareaArchivo/MostrarArchivos?TareaID=${ID}`,
    config
  );
  return response.data;
};

const addFilesTasks = async (object) => {
  const response = await api.post(`/TareaArchivo/Insertar`, object, config);
  return response.data;
};

const getFileTask = async (ID, config) => {
  const response = await api.get(
    `/TareaArchivo/MostrarArchivo?ArchivoID=${ID}`,
    config
  );
  return response.data;
};

export default {
  insertTasks,
  getTasks,
  completeTask,
  getFilesTasks,
  addFilesTasks,
  getFileTask,
};
