import { Route, Routes } from "react-router-dom";
import Warehouses from "../Warehouses";
import AddWarehouse from "./AddWarehouse";
import UpdateWarehouse from "./UpdateWarehouse";
import Movements from "./Movements";

const WarehousesRoutes = () => {
  return (
    <Routes>
      <Route index element={<Warehouses />} />
      <Route path="Add" element={<AddWarehouse />} />
      <Route path="Update/:warehouseID" element={<UpdateWarehouse />} />
      <Route path="Movements/:ID" element={<Movements />} />
    </Routes>
  );
};

export default WarehousesRoutes;
