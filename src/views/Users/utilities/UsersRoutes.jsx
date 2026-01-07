import { Route, Routes } from "react-router-dom";
import Users from "../Users";
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";

const UsersRoutes = () => {
  return (
    <Routes>
      <Route index element={<Users />} />
      <Route path="Add" element={<AddUser />} />
      <Route path="Update/:userID" element={<UpdateUser />} />
    </Routes>
  );
};

export default UsersRoutes;
