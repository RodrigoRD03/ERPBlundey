import { Route, Routes } from "react-router-dom";
import NewPurchase from "../NewPurchase";
import Orders from "./Orders";

const NewPurchaseRoutes = () => {
  return (
    <Routes>
      <Route index element={<NewPurchase />} />
      {/* <Route path="Add" element={<AddProduct />} /> */}
      <Route path="Orders/:quoteID/:orderPurchaseID" element={<Orders />} />
    </Routes>
  );
};

export default NewPurchaseRoutes;
