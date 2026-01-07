import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getGroupTasks = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarActividadesCompartidas?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const getListUsers = async (ID) => {
  const response = await api.get(
    `/Usuario/MostrarUsuariosSelect?UsuarioID=${ID}`,
    config
  );
  return response.data;
};

const addNewGroupTask = async (object) => {
  const response = await api.post(
    `/ActividadesCompartidas/InsertarActividad`,
    object,
    config
  );
  return response.data;
};

const addPeopleGroupTask = async (object) => {
  const response = await api.post(
    `/ActividadesCompartidas/InsertarUsuarioActividad`,
    object,
    config
  );
  return response.data;
};

const addFilesGroupTask = async (object) => {
  const response = await api.post(
    `/ActividadesCompartidas/InsertarActividadArchivo`,
    object,
    config
  );
  return response.data;
};

const checkGroupTask = async (taskID, UserID) => {
  const response = await api.get(
    `/ActividadesCompartidas/ActualizarActividad?ActividadCompartidaID=${taskID}&UsuarioID=${UserID}`,
    config
  );
  return response.data;
};

const getFilesForGroupTask = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarActividadesArchivo?ActividadCompartidaID=${ID}`,
    config
  );
  return response.data;
};

const downloadFileForGroupTask = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarActividadArchivo?ActividadArchivoID=${ID}`,
    config
  );
  return response.data;
};

const getCommentsGroupTask = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarRespuestasActividad?ActividadCompartidaID=${ID}`,
    config
  );
  return response.data;
};

const addCommentGroupTask = async (object) => {
  const response = await api.post(
    `/ActividadesCompartidas/InsertarRespuestaActividad`,
    object,
    config
  );
  return response.data;
};

const addCommentFileGroupTask = async (object) => {
  const response = await api.post(
    `/ActividadesCompartidas/InsertarRespuestaArchivo`,
    object,
    config
  );
  return response.data;
};

const getCommentsFilesGroupTask = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarRespuestaArchivos?RespuestasActividadesCompartidasID=${ID}`,
    config
  );
  return response.data;
};

const getSearchTask = async (ID, content) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarActividadesCompartidasBusqueda?UsuarioID=${ID}&Contenido=
 ${content}`,
    config
  );
  return response.data;
};

const getGroupTask = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/MostrarActividadCompartida?ID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getGroupTasks,
  getListUsers,
  addNewGroupTask,
  addPeopleGroupTask,
  addFilesGroupTask,
  checkGroupTask,
  getFilesForGroupTask,
  downloadFileForGroupTask,
  getCommentsGroupTask,
  addCommentGroupTask,
  addCommentFileGroupTask,
  getCommentsFilesGroupTask,
  getSearchTask,
  getGroupTask,
};
