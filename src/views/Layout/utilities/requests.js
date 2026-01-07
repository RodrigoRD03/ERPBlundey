import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const checkPendingGroupTasks = async (ID) => {
  const response = await api.get(
    `/ActividadesCompartidas/ActividadesPendientes?UsuarioID=${ID}`,
    config
  );
  return response.data;
};


export default {
  checkPendingGroupTasks,
};
