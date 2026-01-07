import { Route, Routes } from "react-router-dom";
import TaxDataCustomers from "../TaxDataCustomers";
import TaxDataComplete from "./TaxDataComplete";

const TaxDataCustomersRoutes = () => {
  return (
    <Routes>
      <Route index element={<TaxDataCustomers />} />
      <Route path="Complete/:enterpriseID" element={<TaxDataComplete />} />
    </Routes>
  );
};

export default TaxDataCustomersRoutes;
