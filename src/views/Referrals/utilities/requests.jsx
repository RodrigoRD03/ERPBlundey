import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getPendingFerralsSales = async () => {
  const response = await api.get(
    `/Remision/GetVentasPendientesRemision`,
    config
  );
  return response.data;
};

const getReferralsSale = async (ID) => {
  const response = await api.get(
    `/Remision/GetRemisionesByVenta?ordenVentaID=${ID}`,
    config
  );
  return response.data;
};

const getMissingReferralsSales = async (ID) => {
  const response = await api.get(
    `/Remision/GetFaltantesRemisionByVenta?ordenVentaID=${ID}`,
    config
  );
  return response.data;
};

const insertReferral = async (object) => {
  const response = await api.post(`/Remision/Insertar`, object, config);
  return response.data;
};

const getReferralDocument = async (referralID) => {
  const response = await api.get(
    `/Remision/GetPDFRemision?remisionID=${referralID}`,
    config
  );
  return response.data;
};

export default {
  getPendingFerralsSales,
  getReferralsSale,
  getMissingReferralsSales,
  insertReferral,
  getReferralDocument,
};
