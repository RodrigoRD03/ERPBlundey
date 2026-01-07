import React from "react";
import { Route, Routes } from "react-router-dom";
import InvoicesPendingIssue from "../InvoicesPendingIssue";
import Invoice from "./Invoice";
import PaidAddons from "./PaidAddons";
import NewPaidAddon from "./NewPaidAddon";

const InvoicePendingIssueRoutes = () => {
  return (
    <Routes>
      <Route index element={<InvoicesPendingIssue />} />
      <Route path="Invoice/:base64" element={<Invoice />} />
      <Route path="PaidAddons/:ID" element={<PaidAddons />} />
      <Route path="NewPaidAddon/:saleID" element={<NewPaidAddon />} />

      {/* <Route path="Brands/:supplierID" element={<Brands />} /> */}
    </Routes>
  );
};

export default InvoicePendingIssueRoutes;
