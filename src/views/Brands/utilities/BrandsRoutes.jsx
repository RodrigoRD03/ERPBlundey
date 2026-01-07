import { Routes, Route } from "react-router-dom";
import Brands from "../Brands";
import AddBrand from "./AddBrand";
import UpdateBrand from "./UpdateBrand";

const BrandsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Brands />} />
      <Route path="Add" element={<AddBrand />} />
      <Route path="Update/:brandID" element={<UpdateBrand />} />
      {/* <Route path="update/:id" element={<UpdateCustomer />} /> */}
    </Routes>
  );
};

export default BrandsRoutes;
