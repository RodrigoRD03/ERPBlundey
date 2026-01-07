import { Route, Routes } from "react-router-dom";
import RelatedDocuments from "../RelatedDocuments";

const RelatedDocumentsRoutes = () => {
  return (
    <Routes>
      <Route index element={<RelatedDocuments />} />
    </Routes>
  );
};

export default RelatedDocumentsRoutes;
