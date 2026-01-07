import { Route, Routes } from "react-router-dom";
import Retreats from "../Retreats";
import AddRetreat from "./AddRetreat";
import UpdateRetreat from "./UpdateRetreat";

const RetreatsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Retreats />} />
      <Route path="Add" element={<AddRetreat />} />
      <Route path="Update/:retreatID/:type" element={<UpdateRetreat />} />
    </Routes>
  );
};

export default RetreatsRoutes;
