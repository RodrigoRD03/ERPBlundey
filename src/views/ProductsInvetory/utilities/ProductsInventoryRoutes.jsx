import { Route, Routes } from "react-router-dom";
import ProductsInventory from "../ProductsInventory";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";
import Inputs from "./Inputs";
import Outputs from "./Outputs";
import Adjustment from "./Adjustment";

const ProductsInventoryRoutes = () => {
  return (
    <Routes>
      <Route index element={<ProductsInventory />} />
      <Route path="Add" element={<AddProduct />} />
      <Route path="Update/:ID" element={<UpdateProduct />} />
      <Route path="Inputs/:ID" element={<Inputs />} />
      <Route path="Outputs/:ID" element={<Outputs />} />
      <Route path="Adjustment/:ID" element={<Adjustment />} />
    </Routes>
  );
};

export default ProductsInventoryRoutes;
