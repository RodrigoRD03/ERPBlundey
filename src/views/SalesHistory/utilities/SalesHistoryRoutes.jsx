import React from "react";
import { Route, Routes } from "react-router-dom";
import SalesHistory from "../SalesHistory";

const SalesHistoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<SalesHistory />} />
      {/* <Route path="Update/:customerID" element={<UpdateCustomer />} /> */}
    </Routes>
  );
};

export default SalesHistoryRoutes;
