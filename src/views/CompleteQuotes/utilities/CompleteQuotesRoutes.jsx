import React from "react";
import { Route, Routes } from "react-router-dom";
import CompleteQuotes from "../CompleteQuotes";

const CompleteQuotesRoutes = () => {
  return (
    <Routes>
      <Route index element={<CompleteQuotes />} />
      {/* <Route path="Add" element={<AddUser />} />
      <Route path="Update/:userID" element={<UpdateUser />} /> */}
    </Routes>
  );
};

export default CompleteQuotesRoutes;
