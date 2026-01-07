import { Routes, Route } from "react-router-dom";
import Products from "../Products";
import AddProduct from "./AddProduct";
import UpdateProduct from "./UpdateProduct";

const ProductsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Products />} />
      <Route path="Add" element={<AddProduct />} />
      <Route path="Update/:productID" element={<UpdateProduct />} />
    </Routes>
  );
};

export default ProductsRoutes;
