import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPendingSales = async (userID) => {
  const response = await api.get(
    `/OrdenVenta/MostrarOrdenesVentasPendientes?usuarioID=${userID}`,
    config
  );
  return response.data;
};

const cancelOrder = async (object) => {
  const response = await api.post(`/OrdenVenta/CancelarOrden`, object, config);
  return response.data;
};

const acceptOrder = async (ID) => {
  const response = await api.get(
    `/OrdenVenta/FinalizarOrden?OrdenVentaID=${ID}`,
    config
  );
  return response.data;
};

const addShipmentData = async (object) => {
  const response = await api.post(`/OrdenVenta/Actualizar`, object, config);
  return response.data;
};

export default { getPendingSales, cancelOrder, acceptOrder, addShipmentData };
