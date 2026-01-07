import { Route, Routes } from "react-router-dom";
import Categories from "../Categories";
import AddCategorie from "./AddCategorie";
import UpdateCategorie from "./UpdateCategorie";

const CategoriesRoutes = () => {
  return (
    <Routes>
    <Route index element={<Categories />} />
    <Route path="Add" element={<AddCategorie />} />
    <Route path="Update/:categorieID" element={<UpdateCategorie />} />
    {/* <Route path="update/:id" element={<UpdateCustomer />} /> */}
  </Routes>
  )
}

export default CategoriesRoutes