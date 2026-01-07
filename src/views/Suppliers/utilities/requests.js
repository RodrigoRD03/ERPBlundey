import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getSuppliers = async () => {
  const response = await api.get(`/Proveedores/MostrarProveedores`, config);
  return response.data;
};

const addSupplier = async (object) => {
  const response = await api.post(`/Proveedores/Insertar`, object, config);
  return response.data;
};

const getSupplier = async (ID) => {
  const response = await api.get(
    `/Proveedores/MostrarProveedor?ProveedorID=${ID}`,
    config
  );
  return response.data;
};

const updateSupplier = async (object) => {
  const response = await api.post(`/Proveedores/Actualizar`, object, config);
  return response.data;
};

const getBrandsSupplier = async (ID) => {
  const response = await api.get(
    `/Proveedores/MostrarProveedorMarcas?ProveedorID=${ID}`,
    config
  );
  return response.data;
};

const getBrandsSelect = async () => {
  const response = await api.get(`/Marca/MostrarMarcasProveedor`, config);
  return response.data;
};

const addBrandSupplier = async (object) => {
  const response = await api.post(
    `/ProveedoresMarcas/Insertar`,
    object,
    config
  );
  return response.data;
};

const deleteBrandSupplier = async (ID) => {
  const response = await api.get(
    `/ProveedoresMarcas/Eliminar?proveedoresMarcasID=${ID}`,
    config
  );
  return response.data;
};

export default {
  getSuppliers,
  addSupplier,
  getSupplier,
  updateSupplier,
  getBrandsSupplier,
  getBrandsSelect,
  addBrandSupplier,
  deleteBrandSupplier,
};
