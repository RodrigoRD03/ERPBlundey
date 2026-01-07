import React from "react";
import HistoryInvoicesIssued from "../HistoryInvoicesIssued";
import { Route, Routes } from "react-router-dom";

const HistoryInvoicesIssuedRoutes = () => {
  return (
    <Routes>
      <Route index element={<HistoryInvoicesIssued />} />
      {/* <Route path="Invoice/:base64" element={<Invoice />} />
      <Route path="PaidAddons/:ID" element={<PaidAddons />} /> */}
      {/* <Route path="Brands/:supplierID" element={<Brands />} /> */}
    </Routes>
  );
};

export default HistoryInvoicesIssuedRoutes;
