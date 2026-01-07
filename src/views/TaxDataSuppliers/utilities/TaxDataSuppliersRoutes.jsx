import React from "react";
import { Route, Routes } from "react-router-dom";
import TaxDataSuppliers from "../TaxDataSuppliers";
import TaxDataComplete from "./TaxDataComplete";

const TaxDataSuppliersRoutes = () => {
  return (
    <Routes>
      <Route index element={<TaxDataSuppliers />} />
      <Route path="Complete/:supplierID" element={<TaxDataComplete />} />
    </Routes>
  );
};

export default TaxDataSuppliersRoutes;
