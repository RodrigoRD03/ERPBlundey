import { Route, Routes } from "react-router-dom";
import PendingQuotes from "../PendingQuotes";
import Quote from "./Quote";
import Item from "./Item";

const PendingQuotesRoutes = () => {
  return (
    <Routes>
      <Route index element={<PendingQuotes />} />
      {/* <Route path="Add" element={<AddProduct />} />
      <Route path="Update/:productID" element={<UpdateProduct />} /> */}
      <Route
        path="Quote/:enterpriseID/:customerID/:addressID/:quoteID"
        element={<Quote />}
      />
      <Route
        path="Item/:enterpriseID/:customerID/:addressID/:quoteID/:itemID/:itemType"
        element={<Item />}
      />
    </Routes>
  );
};

export default PendingQuotesRoutes;
