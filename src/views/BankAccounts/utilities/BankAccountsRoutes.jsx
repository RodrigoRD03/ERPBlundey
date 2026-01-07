import { Route, Routes } from "react-router-dom";
import BankAccounts from "../BankAccounts";
import AddAccount from "./AddAccount";
import UpdateAccount from "./UpdateAccount";
import CurrencyExchange from "./CurrencyExchange";

const BankAccountsRoutes = () => {
  return (
    <Routes>
      <Route index element={<BankAccounts />} />
      <Route path="Add" element={<AddAccount />} />
      <Route path="CurrencyExchange" element={<CurrencyExchange />} />
      <Route path="Update/:accountID" element={<UpdateAccount />} />
    </Routes>
  );
};

export default BankAccountsRoutes;
