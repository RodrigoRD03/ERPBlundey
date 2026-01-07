import React from "react";
import { Route, Routes } from "react-router-dom";
import HistoryInvoicesReceipt from "../HistoryInvoicesReceipt";

const HistoryInvoicesReceiptRoutes = () => {
  return (
    <Routes>
      <Route index element={<HistoryInvoicesReceipt />} />
      {/* <Route path="Invoice/:base64" element={<Invoice />} />
      <Route path="PaidAddons/:ID" element={<PaidAddons />} /> */}
      {/* <Route path="Brands/:supplierID" element={<Brands />} /> */}
    </Routes>
  );
};

export default HistoryInvoicesReceiptRoutes;
