import { Route, Routes } from "react-router-dom";
import PurchaseTracking from "../PurchaseTracking";
import EditPurchase from "./EditPurchase";

const purchaseTrackingRoutes = () => {
  return (
    <Routes>
      <Route index element={<PurchaseTracking />} />
      {/* <Route path="Add" element={<AddProduct />} /> */}
      <Route path="/EditPurchase/:purchaseId" element={<EditPurchase />} />
    </Routes>
  );
};

export default purchaseTrackingRoutes;
