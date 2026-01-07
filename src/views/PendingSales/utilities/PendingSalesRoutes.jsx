import React from "react";
import { Route, Routes } from "react-router-dom";
import PendingSales from "../PendingSales";

const PendingSalesRoutes = () => {
  return (
    <Routes>
      <Route index element={<PendingSales />} />
      {/* <Route path="Add" element={<AddUser />} />
      <Route path="Update/:userID" element={<UpdateUser />} /> */}
    </Routes>
  );
};

export default PendingSalesRoutes;
