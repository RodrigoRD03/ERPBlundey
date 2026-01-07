import { Route, Routes } from "react-router-dom";
import CreditNotes from "../CreditNotes";
import NewPaidAddon from "./NewPaidAddon";

const CreditNotesRoutes = () => {
  return (
    <Routes>
      <Route index element={<CreditNotes />} />
      <Route path="NewPaidAddon/:UID" element={<NewPaidAddon />} />
    </Routes>
  );
};

export default CreditNotesRoutes;
