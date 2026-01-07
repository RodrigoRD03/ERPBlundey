import { Routes, Route } from "react-router-dom";
import Customers from "../Customers";
import AddCustomer from "./AddCustomer";
import UpdateCustomer from "./UpdateCustomer";

const CustomersRoutes = () => {
  return (
    <Routes>
      <Route index element={<Customers />} />
      <Route path="Add" element={<AddCustomer />} />
      <Route path="Update/:customerID" element={<UpdateCustomer />} />
    </Routes>
  );
};

export default CustomersRoutes;
