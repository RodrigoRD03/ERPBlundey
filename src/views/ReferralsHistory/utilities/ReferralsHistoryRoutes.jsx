import React from "react";
import { Route, Routes } from "react-router-dom";
import ReferralsHistory from "../ReferralsHistory";

const ReferralsHistoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<ReferralsHistory />} />
      {/* <Route path="Add" element={<AddProduct />} />
      <Route path="Update/:productID" element={<UpdateProduct />} /> */}
    </Routes>
  );
};

export default ReferralsHistoryRoutes;
