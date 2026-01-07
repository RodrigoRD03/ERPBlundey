import { Route, Routes } from "react-router-dom";
import VendorTarget from "../VendorTarget";
import AddTarget from "./AddTarget";
import UpdateTarget from "./UpdateTarget";

const VendorTargetRoutes = () => {
  return (
    <Routes>
      <Route index element={<VendorTarget />} />
      <Route path="Add" element={<AddTarget />} />
      <Route path="Update/:targetID" element={<UpdateTarget />} />
    </Routes>
  );
};

export default VendorTargetRoutes;
