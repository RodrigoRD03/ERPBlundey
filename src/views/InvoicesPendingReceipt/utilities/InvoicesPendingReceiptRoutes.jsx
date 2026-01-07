import React from "react";
import { Route, Routes } from "react-router-dom";
import InvoicesPendingReceipt from "../InvoicesPendingReceipt";
import InsertInvoice from "./InsertInvoice";

const InvoicesPendingReceiptRoutes = () => {
  return (
    <Routes>
      <Route index element={<InvoicesPendingReceipt />} />
      {/* <Route path="Add" element={<AddSupplier />} /> */}
      <Route path="InsertInvoice/:supplierID" element={<InsertInvoice />} />
      {/* <Route path="Brands/:supplierID" element={<Brands />} /> */}
    </Routes>
  );
};

export default InvoicesPendingReceiptRoutes;
