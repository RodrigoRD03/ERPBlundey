import React from "react";
import { Route, Routes } from "react-router-dom";
import ControlPanel from "../ControlPanel";

const ControlPanelRoutes = () => {
  return (
    <Routes>
      <Route index element={<ControlPanel />} />
      {/* <Route path="Add" element={<AddProduct />} /> */}
      {/* <Route path="Update/:productID" element={<UpdateProduct />} /> */}
    </Routes>
  );
};

export default ControlPanelRoutes;
