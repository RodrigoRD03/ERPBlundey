import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getSuppliers = async () => {
  const response = await api.get(`Proveedores/MostrarProveedores`, config);
  return response.data;
};

const getTaxData = async (ID) => {
  const response = await api.get(
    `/DatosFiscales/MostrarDatosProveedor?ProveedorID=${ID}`,
    config
  );
  return response.data;
};

const addTaxData = async (object, email) => {
  const response = await api.post(
    `/DatosFiscales/InsertarProveedor?correo=${email}`,
    object,
    config
  );
  return response.data;
};

const updateTaxData = async (object) => {
  const response = await api.post(
    `/DatosFiscales/ActualizarProveedor`,
    object,
    config
  );
  return response.data;
};

export default {
  getSuppliers,
  getTaxData,
  addTaxData,
  updateTaxData,
};
