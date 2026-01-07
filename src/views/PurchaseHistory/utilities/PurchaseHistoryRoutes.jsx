import { Route, Routes } from "react-router-dom";
import PurchaseHistory from "../PurchaseHistory";

const PurchaseHistoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<PurchaseHistory />} />
      {/* <Route path="Add" element={<AddTarget />} /> */}
      {/* <Route path="Update/:targetID" element={<UpdateTarget />} /> */}
    </Routes>
  );
};

export default PurchaseHistoryRoutes;
