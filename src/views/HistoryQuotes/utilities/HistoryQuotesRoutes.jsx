import { Route, Routes } from "react-router-dom";
import HistoryQuotes from "../HistoryQuotes";

const HistoryQuotesRoutes = () => {
  return (
    <Routes>
      <Route index element={<HistoryQuotes />} />
    </Routes>
  );
};

export default HistoryQuotesRoutes;
