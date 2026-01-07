import React from "react";
import { Route, Routes } from "react-router-dom";
import Subscriptions from "../Subscriptions";
import AddSubscription from "./AddSubscription";
import UpdateSubsCription from "./UpdateSubsCription";

const SubscriptionsRoutes = () => {
  return (
    <Routes>
      <Route index element={<Subscriptions />} />
      <Route path="Add" element={<AddSubscription />} />
      <Route path="Update/:subscriptionID/:type" element={<UpdateSubsCription />} />
    </Routes>
  );
};

export default SubscriptionsRoutes;
