import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPruchasesHistory = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedor/MostrarHistorialOrdenesCompras?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPruchasesHistorySupervisor = async (ID) => {
  const response = await api.get(
    `/OrdenCompraProveedor/MostrarHistorialOrdenesComprasSupervisor?usuarioID=${ID}`,
    config
  );
  return response.data;
};

const getPurchaseHistoryDates = async (ID, object) => {
  const response = await api.post(
    `/OrdenCompraProveedor/MostrarHistorialOrdenesComprasFechas?usuarioID=${ID}`,
    object,
    config
  );
  return response.data;
};

const getPurchaseHistoryDatesSupervisor = async (ID, object) => {
  const response = await api.post(
    `/OrdenCompraProveedor/MostrarHistorialOrdenesComprasFechasSupervisor?usuarioID=${ID}`,
    object,
    config
  );
  return response.data;
};

export default {
  getPruchasesHistory,
  getPruchasesHistorySupervisor,
  getPurchaseHistoryDates,
  getPurchaseHistoryDatesSupervisor,
};
