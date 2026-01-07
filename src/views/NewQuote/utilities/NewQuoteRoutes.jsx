import { Route, Routes } from "react-router-dom";
import NewQuote from "../NewQuote";
import Addresses from "./Addresses";
import Quote from "./Quote";
import Item from "./Item";

const NewQuoteRoutes = () => {
  return (
    <Routes>
      <Route index element={<NewQuote />} />
      {/* <Route path="Add" element={<Addresses />} /> */}
      <Route
        path="Addresses/:enterpriseID/:customerID"
        element={<Addresses />}
      />
      <Route path="Quote/:enterpriseID/:customerID/:addressID/:quoteID" element={<Quote />} />
      <Route path="Item/:enterpriseID/:customerID/:addressID/:quoteID/:itemID/:itemType" element={<Item />} />
    </Routes>
  );
};

export default NewQuoteRoutes;
