import { Route, Routes } from "react-router-dom";
import Services from "../Services";
import AddService from "./AddService";
import UpdateService from "./UpdateService";

const ServiceRoutes = () => {
  return (
    <Routes>
      <Route index element={<Services />} />
      <Route path="Add" element={<AddService />} />
      <Route path="Update/:serviceID" element={<UpdateService />} />
      {/* <Route path="update/:id" element={<UpdateCustomer />} /> */}
    </Routes>
  );
};

export default ServiceRoutes;
