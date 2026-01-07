import { Route, Routes } from "react-router-dom";
import Suppliers from "../Suppliers";
import AddSupplier from "./AddSupplier";
import UpdateSupplier from "./UpdateSupplier";
import Brands from "./Brands";

const SuppliersRoutes = () => {
  return (
    <Routes>
      <Route index element={<Suppliers />} />
      <Route path="Add" element={<AddSupplier />} />
      <Route path="Update/:supplierID" element={<UpdateSupplier />} />
      <Route path="Brands/:supplierID" element={<Brands />} />
    </Routes>
  );
};

export default SuppliersRoutes;
