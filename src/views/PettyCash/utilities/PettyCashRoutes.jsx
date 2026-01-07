import React from "react";
import { Route, Routes } from "react-router-dom";
import PettyCash from "../PettyCash";
import AddRegister from "./AddRegister";
import AddCheck from "./AddCheck";
import UpdateRegister from "./UpdateRegister";

const PettyCashRoutes = () => {
  return (
    <Routes>
      <Route index element={<PettyCash />} />
      <Route path="AddRegister" element={<AddRegister />} />
      <Route path="AddCheck" element={<AddCheck />} />
      <Route
        path="Update/:registerID"
        element={<UpdateRegister />}
      />
    </Routes>
  );
};

export default PettyCashRoutes;
