import { Route, Routes } from "react-router-dom";
import Enterprise from "../Enterprise";
import AddEnterprise from "./AddEnterprise";
import UpdateEnterprise from "./UpdateEnterprise";
import Addresses from "./Addresses";
import AddAddress from "./AddAddress";
import UpdateAddress from "./UpdateAddress";

const EnterprisesRoutes = () => {
  return (
    <Routes>
      <Route index element={<Enterprise />} />
      <Route path="Add" element={<AddEnterprise />} />
      <Route path="Update/:enterpriseID" element={<UpdateEnterprise />} />
      <Route path="Addresses/:enterpriseID" element={<Addresses />} />
      <Route path="AddAddress/:enterpriseID" element={<AddAddress />} />
      <Route path="UpdateAddress/:addressID" element={<UpdateAddress />} />
      {/* <Route path="update/:id" element={<UpdateCustomer />} /> */}
    </Routes>
  );
};

export default EnterprisesRoutes;
