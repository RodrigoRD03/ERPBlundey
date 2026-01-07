import { Route, Routes } from "react-router-dom";
import GruopTasks from "../GruopTasks";
import AddTask from "./AddTask";
import Comments from "./Comments";

const GroupTasksRoutes = () => {
  return (
    <Routes>
      <Route index element={<GruopTasks />} />
      <Route path="Add" element={<AddTask />} />
      <Route path="Comments/:id" element={<Comments />} />
    </Routes>
  );
};

export default GroupTasksRoutes;
