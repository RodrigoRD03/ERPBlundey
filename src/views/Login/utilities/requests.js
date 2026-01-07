import api from "../../../Api/api";

const Login = async (object) => {
  const response = await api.post(`/Usuario/Validar`, object);
  return response.data;
};

export default {
  Login,
};
