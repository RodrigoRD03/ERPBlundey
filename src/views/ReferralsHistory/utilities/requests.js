import api from "../../../Api/api";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
};

const getHistoruReferrals = async () => {
  const response = await api.get(
    `/Remision/GetVentasHistorialRemision`,
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

const getReferralDocument = async (referralID) => {
  const response = await api.get(
    `/Remision/GetPDFRemision?remisionID=${referralID}`,
    config
  );
  return response.data;
};

const uploadReferralPDF = async (referralID, pdfBase64) => {
  const object = {
    ID: referralID,
    PDF: pdfBase64,
  };
  const response = await api.post(
    `/Remision/GuardarPDFRemision`,
    object,
    config
  );
  return response.data;
};

const getReferralDocumentSigned = async (referralID) => {
  const response = await api.get(
    `/Remision/GetPDFRemisionFirmado?remisionID=${referralID}`,
    config
  );
  return response.data;
};

export default {
  getHistoruReferrals,
  getReferralsSale,
  getReferralDocument,
  uploadReferralPDF,
  getReferralDocumentSigned,
};
