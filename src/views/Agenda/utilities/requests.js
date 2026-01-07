import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getImportantDays = async (ID) => {
  const response = await api.get(
    `/Agendas/MostrarAgendas?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const addNewTaskDiary = async (object) => {
  const response = await api.post(`/Agendas/Insertar`, object, config);
  return response.data;
};

const markCompleteTask = async (ID, config) => {
  const response = await api.get(`/Agendas/Finalizar?ID=${ID}`, config);
  return response.data;
};

export default {
  getImportantDays,
  addNewTaskDiary,
  markCompleteTask,
};
