import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const recoverPassword = async (email) => {
  const response = await api.get(
    `/Usuario/RecuperarContraseña?correo=${email}`
  );
  return response.data;
};

export default {
  recoverPassword,
};
