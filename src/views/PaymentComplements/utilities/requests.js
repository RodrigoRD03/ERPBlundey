import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPaymentsComplements = async () => {
  const response = await api.get(
    `/Facturacion/MostrarComplementosPago`,
    config
  );
  return response.data.data;
};

const getDataClients = async () => {
  const response = await api.get(
    `/DatosFiscales/MostrarDatosFiscalesClientes`,
    config
  );
  return response.data;
};

const getDatapaymentForms = async (ID) => {
  const response = await api.get(
    `/Facturacion/DatosComplementoPago?ClienteUID=${ID}`,
    config
  );
  return response.data;
};

const createPaymentComplement = async (object) => {
  const response = await api.post(
    `/Facturacion/CrearComplementoPago`,
    object,
    config
  );
  return response.data;
};

const getPaymentRelated = async (UID) => {
  const response = await api.get(
    `/Facturacion/MostrarPagosCP?FacturaUID=${UID}`,
    config
  );
  return response.data;
};

export default {
  getPaymentsComplements,
  getDataClients,
  getDatapaymentForms,
  createPaymentComplement,
  getPaymentRelated
};
