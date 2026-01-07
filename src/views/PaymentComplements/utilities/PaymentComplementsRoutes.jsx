import { Route, Routes } from "react-router-dom";
import PaymentComplements from "../PaymentComplements";
import AddPaymentComplement from "./AddPaymentComplement";

const PaymentComplementsRoutes = () => {
  return (
    <Routes>
      <Route index element={<PaymentComplements />} />
      <Route path="Add" element={<AddPaymentComplement />} />
      {/* <Route path="Update/:productID" element={<UpdateProduct />} /> */}
    </Routes>
  );
};

export default PaymentComplementsRoutes;
