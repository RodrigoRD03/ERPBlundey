import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useUser } from "../Contexts/UserContext";
import { Outlet, Route, Routes } from "react-router-dom";
import CustomersRoutes from "../views/Customers/utilities/CustomersRoutes";
import ProductsRoutes from "../views/Products/utilities/ProductsRoutes";
import BrandsRoutes from "../views/Brands/utilities/BrandsRoutes";
import CategoriesRoutes from "../views/Categories/utilities/CategoriesRoutes";
import ServiceRoutes from "../views/Services/utilities/ServiceRoutes";
import EnterprisesRoutes from "../views/Enterprise/utilities/EnterprisesRoutes";
import NewQuoteRoutes from "../views/NewQuote/utilities/NewQuoteRoutes";
import PendingQuotesRoutes from "../views/PendingQuotes/utilities/PendingQuotesRoutes";
import HistoryQuotesRoutes from "../views/HistoryQuotes/utilities/HistoryQuotesRoutes";
import UsersRoutes from "../views/Users/utilities/UsersRoutes";
import CompleteQuotesRoutes from "../views/CompleteQuotes/utilities/CompleteQuotesRoutes";
import PendingSalesRoutes from "../views/PendingSales/utilities/PendingSalesRoutes";
import SalesHistoryRoutes from "../views/SalesHistory/utilities/SalesHistoryRoutes";
import SuppliersRoutes from "../views/Suppliers/utilities/SuppliersRoutes";
import NewPurchaseRoutes from "../views/NewPurchase/utilities/NewPurchaseRoutes";
import VendorTargetRoutes from "../views/VendorTarget/utilities/VendorTargetRoutes";
import PurchaseTrackingRoutes from "../views/purchaseTracking/utilities/purchaseTrackingRoutes";
import PurchaseHistoryRoutes from "../views/PurchaseHistory/utilities/PurchaseHistoryRoutes";
import ControlPanelRoutes from "../views/ControlPanel/utilities/ControlPanelRoutes";
import BankAccountsRoutes from "../views/BankAccounts/utilities/BankAccountsRoutes";
import TaxDataCustomersRoutes from "../views/TaxDataCustomers/utilities/TaxDataCustomersRoutes";
import TaxDataSuppliersRoutes from "../views/TaxDataSuppliers/utilities/TaxDataSuppliersRoutes";
import InvoicePendingIssueRoutes from "../views/InvoicesPendingIssue/utilities/InvoicePendingIssueRoutes";
import InvoicesPendingReceiptRoutes from "../views/InvoicesPendingReceipt/utilities/InvoicesPendingReceiptRoutes";
import SubscriptionsRoutes from "../views/Subscriptions/utilities/SubscriptionsRoutes";
import RetreatsRoutes from "../views/Retreats/utilities/RetreatsRoutes";
import PettyCashRoutes from "../views/PettyCash/utilities/PettyCashRoutes";
import GroupTasksRoutes from "../views/GroupTasks/utilities/GroupTasksRoutes";
import HistoryInvoicesIssuedRoutes from "../views/HistoryInvoicesIssued/utilities/HistoryInvoicesIssuedRoutes";
import HistoryInvoicesReceiptRoutes from "../views/HistoryInvoicesReceipt/utilities/HistoryInvoicesReceiptRoutes";
import WarehousesRoutes from "../views/Warehouses/utilities/WarehousesRoutes";
import ProductsInventoryRoutes from "../views/ProductsInvetory/utilities/ProductsInventoryRoutes";
import ReferralsRoutes from "../views/Referrals/utilities/ReferralsRoutes";
import ReferralsHistoryRoutes from "../views/ReferralsHistory/utilities/ReferralsHistoryRoutes";
import CreditNotesRoutes from "../views/CreditNotes/utilities/CreditNotesRoutes";
import PaymentComplementsRoutes from "../views/PaymentComplements/utilities/PaymentComplementsRoutes";
import RelatedDocumentsRoutes from "../views/RelatedDocuments/utilities/RelatedDocumentsRoutes";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(-100, 0); // Desplázate al inicio de la página
  }, [pathname]); // Se ejecuta cada vez que la ruta cambia

  return null;
};

const GlobalRoutes = () => {
  const { userData } = useUser();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/*" element={<Outlet />}>
          {/* Cotizaciones*/}
          <Route index element={<ControlPanelRoutes />} />
          <Route path="ControlPanel/*" element={<ControlPanelRoutes />} />
          <Route path="GroupTasks/*" element={<GroupTasksRoutes />} />
          {(userData.Roles === "Vendedor Comisionista" ||
            userData.Roles === "Vendedor con Sueldo + Comisión" ||
            userData.Roles === "Supervisor") && (
            <>
              <Route path="NewQuote/*" element={<NewQuoteRoutes />} />
              <Route path="PendingQuotes/*" element={<PendingQuotesRoutes />} />
            </>
          )}
          {userData.Roles != "Finanzas" && (
            <>
              <Route path="HistoryQuotes/*" element={<HistoryQuotesRoutes />} />
              <Route path="Enterprises/*" element={<EnterprisesRoutes />} />
              <Route path="Customers/*" element={<CustomersRoutes />} />
              <Route path="Products/*" element={<ProductsRoutes />} />
              <Route path="Categories/*" element={<CategoriesRoutes />} />
              <Route path="Brands/*" element={<BrandsRoutes />} />
              <Route path="Services/*" element={<ServiceRoutes />} />
            </>
          )}

          {/* Ordenes de Compra */}

          {(userData.Roles == "Supervisor" ||
            userData.Roles == "Administrador") && (
            <>
              <Route
                path="CompleteQuotes/*"
                element={<CompleteQuotesRoutes />}
              />
              <Route path="PendingSales/*" element={<PendingSalesRoutes />} />
              <Route path="SalesHistory/*" element={<SalesHistoryRoutes />} />
            </>
          )}
          {(userData.Roles == "Encargado de Compras" ||
            userData.Roles == "Supervisor" ||
            userData.Roles == "Administrador") && (
            <>
              <Route path="Suppliers/*" element={<SuppliersRoutes />} />
              {userData.Roles != "Supervisor" && (
                <Route path="NewPurchase/*" element={<NewPurchaseRoutes />} />
              )}
              <Route
                path="PurchaseTracking/*"
                element={<PurchaseTrackingRoutes />}
              />
              <Route
                path="PurchaseHistory/*"
                element={<PurchaseHistoryRoutes />}
              />
            </>
          )}

          {/* Facturación */}

          <Route
            path="TaxDataCustomers/*"
            element={<TaxDataCustomersRoutes />}
          />
          <Route
            path="TaxDataSuppliers/*"
            element={<TaxDataSuppliersRoutes />}
          />
          <Route
            path="Referrals/*"
            element={<ReferralsRoutes />}
          />
          <Route
            path="ReferralsHistory/*"
            element={<ReferralsHistoryRoutes />}
          />
          <Route
            path="InvoicesPendingIssue/*"
            element={<InvoicePendingIssueRoutes />}
          />
          <Route
            path="CreditNotes/*"
            element={<CreditNotesRoutes />}
          />
          <Route
            path="PaymentComplements/*"
            element={<PaymentComplementsRoutes />}
          />
          <Route
            path="HistoryInvoicesIssued/*"
            element={<HistoryInvoicesIssuedRoutes />}
          />
          <Route
            path="RelatedDocuments/*"
            element={<RelatedDocumentsRoutes />}
          />
          <Route
            path="InvoicesPendingReceipt/*"
            element={<InvoicesPendingReceiptRoutes />}
          />
          <Route
            path="HistoryInvoicesReceipt/*"
            element={<HistoryInvoicesReceiptRoutes />}
          />
          {/* Finanzas*/}

          <Route path="BankAccounts/*" element={<BankAccountsRoutes />} />
          <Route path="Subscriptions/*" element={<SubscriptionsRoutes />} />
          <Route path="Retreats/*" element={<RetreatsRoutes />} />
          <Route path="PettyCash/*" element={<PettyCashRoutes />} />

          {/* Administracion */}

          <Route path="VendorTarget/*" element={<VendorTargetRoutes />} />
          {userData.Roles === "Desarrollador" && (
            <>
              <Route path="Users/*" element={<UsersRoutes />} />
            </>
          )}
          {userData.Roles === "Responsable de Logistica de Almacen" && (
            <>
              <Route path="Warehouses/*" element={<WarehousesRoutes />} />
              <Route
                path="ProductsInventory/*"
                element={<ProductsInventoryRoutes />}
              />
            </>
          )}
        </Route>
      </Routes>
    </>
  );
};

export default GlobalRoutes;
