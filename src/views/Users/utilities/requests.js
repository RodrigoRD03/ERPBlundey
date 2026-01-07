import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getUsersTable = async () => {
  const response = await api.get(`/Usuario/MostrarUsuarios`);
  return response.data;
};

const getAllUsers = async () => {
  const response = await api.get(`/UsuarioRoles/MostrarUsuarios`);
  return response.data;
};

const getAllRoles = async () => {
  const response = await api.get(`/UsuarioRoles/MostrarRoles`, config);
  return response.data;
};

const addNewUser = async (object) => {
  const response = await api.post(`/Usuario/Insertar`, object, config);
  return response.data;
};

const addNewUserRol = async (object) => {
  const response = await api.post(`/UsuarioRoles/Insertar`, object, config);
  return response.data;
};

const addNewRolJerarquia = async (object, config) => {
  const response = await api.post(`/RolJerarquia/Insertar`, object, config);
  return response.data;
};

const getUser = async (ID) => {
  const response = await api.get(`/Usuario/MostrarUsuario?ID=${ID}`);
  return response.data;
};

const updateUser = async (object) => {
  const response = await api.post(`/Usuario/Actualizar`, object);
  return response.data;
};

export default {
  getUsersTable,
  getAllUsers,
  getAllRoles,
  addNewUser,
  addNewUserRol,
  addNewRolJerarquia,
  getUser,
  updateUser,
};
