import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import {
  TbBrowserPlus,
  TbBuilding,
  TbBuildingBank,
  TbCards,
  TbCash,
  TbCashRegister,
  TbCategory,
  TbCircleCheck,
  TbCreditCard,
  TbCreditCardPay,
  TbDatabaseCog,
  TbHistory,
  TbHistoryToggle,
  TbReceipt,
  TbReceiptRefund,
  TbShoppingCart,
  TbTargetArrow,
  TbTool,
  TbTruckDelivery,
  TbTruckLoading,
  TbUsers,
  TbUsersGroup,
} from "react-icons/tb";
import { MdOutlineBookmarkAdd, MdOutlineWarehouse, MdOutlineWorkHistory } from "react-icons/md";
import {
  GrBladesHorizontal,
  GrCatalogOption,
  GrDocumentDownload,
  GrDocumentTime,
  GrDocumentUpload,
  GrNote,
} from "react-icons/gr";
import requests from "./requests";
import { BsBoxSeam } from "react-icons/bs";
import { IoGitNetworkOutline } from "react-icons/io5";

const Links = () => {
  const { userData } = useUser();
  const [activeMenu, setActiveMenu] = useState(
    () => localStorage.getItem("activeMenu") || "quotes"
  );
  const [pendingGroupTasks, setPendingGroupTasks] = useState(false);
  const [activeView, setActiveView] = useState(
    () => localStorage.getItem("activeView") || ""
  );

  useEffect(() => {
    localStorage.setItem("activeMenu", activeMenu);
    localStorage.setItem("activeView", activeView);
  }, [activeMenu, activeView]);

  useEffect(() => {
    requests.checkPendingGroupTasks(userData.ID).then((response) => {
      setPendingGroupTasks(response);
    });
  }, []);

  let menuItems;

  if (userData.Roles === "Responsable de Logistica de Almacen") {
    // Solo inventario para este rol
    menuItems = [
      {
        key: "inventary",
        label: "Inventario",
        links: [
          {
            link: "/Layout/Warehouses",
            Icon: <MdOutlineWarehouse size={20} />,
            Text: "Almacenes",
          },
          {
            link: "/Layout/ProductsInventory",
            Icon: <BsBoxSeam size={20} />,
            Text: "Productos",
          },
        ],
      },
    ];
  } else {
    // Menú completo para otros roles
    menuItems = [
      ...(userData.Roles !== "Finanzas"
        ? [
            {
              key: "quotes",
              label: "Cotizaciones",
              links: [
                ...(userData.Roles === "Vendedor Comisionista" ||
                userData.Roles === "Vendedor con Sueldo + Comisión"
                  ? [
                      {
                        link: "/Layout/NewQuote",
                        Icon: <TbReceipt size={20} />,
                        Text: "Nueva Cotización",
                      },
                    ]
                  : []),
                ...(userData.Roles === "Vendedor Comisionista" ||
                userData.Roles === "Vendedor con Sueldo + Comisión" ||
                userData.Roles === "Supervisor"
                  ? [
                      {
                        link: "/Layout/PendingQuotes",
                        Icon: <TbReceiptRefund size={20} />,
                        Text: "Cotizaciones Pendientes",
                      },
                    ]
                  : []),
                ...(userData.Roles !== "Encargado de Compras"
                  ? [
                      {
                        link: "/Layout/HistoryQuotes",
                        Icon: <TbHistory size={20} />,
                        Text: "Historial de Cotizaciones",
                      },
                      {
                        link: "/Layout/Enterprises",
                        Icon: <TbBuilding size={20} />,
                        Text: "Empresas",
                      },
                      {
                        link: "/Layout/Customers",
                        Icon: <TbUsersGroup size={20} />,
                        Text: "Clientes",
                      },
                    ]
                  : []),
                {
                  link: "/Layout/Products",
                  Icon: <TbShoppingCart size={20} />,
                  Text: "Productos",
                },
                {
                  link: "/Layout/Categories",
                  Icon: <TbCategory size={20} />,
                  Text: "Categorias",
                },
                {
                  link: "/Layout/Brands",
                  Icon: <TbCards size={20} />,
                  Text: "Marcas",
                },
                {
                  link: "/Layout/Services",
                  Icon: <TbTool size={20} />,
                  Text: "Servicios",
                },
              ],
            },
          ]
        : []),

      ...(userData.Roles === "Encargado de Compras" ||
      userData.Roles === "Supervisor" ||
      userData.Roles === "Administrador"
        ? [
            {
              key: "orders",
              label: "Órdenes de Compra",
              links: [
                ...(userData.Roles === "Supervisor" ||
                userData.Roles === "Administrador"
                  ? [
                      {
                        link: "/Layout/CompleteQuotes",
                        Icon: <TbCircleCheck size={20} />,
                        Text: "Cotizaciones Completas",
                      },
                      {
                        link: "/Layout/PendingSales",
                        Icon: <TbCreditCardPay size={20} />,
                        Text: "Ventas Pendientes",
                      },
                      {
                        link: "/Layout/SalesHistory",
                        Icon: <MdOutlineWorkHistory size={20} />,
                        Text: "Historial de Ventas",
                      },
                    ]
                  : []),
                ...(userData.Roles === "Encargado de Compras" ||
                userData.Roles === "Supervisor" ||
                userData.Roles === "Administrador"
                  ? [
                      {
                        link: "/Layout/Suppliers",
                        Icon: <TbTruckDelivery size={20} />,
                        Text: "Proveedores",
                      },
                      ...(userData.Roles !== "Supervisor"
                        ? [
                            {
                              link: "/Layout/NewPurchase",
                              Icon: <TbBrowserPlus size={20} />,
                              Text: "Nueva Compra",
                            },
                          ]
                        : []),
                      {
                        link: "/Layout/PurchaseTracking",
                        Icon: <TbTruckLoading size={20} />,
                        Text: "Seguimiento de Compras",
                      },
                      {
                        link: "/Layout/PurchaseHistory",
                        Icon: <TbHistoryToggle size={20} />,
                        Text: "Historial de Compras",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),

      ...(userData.Roles === "Supervisor" ||
      userData.Roles === "Administrador" ||
      userData.Roles === "Finanzas"
        ? [
            {
              key: "billing",
              label: "Facturación",
              links: [
                {
                  link: "/Layout/TaxDataCustomers",
                  Icon: <TbDatabaseCog size={20} />,
                  Text: "Datos Fiscales Clientes",
                },
                {
                  link: "/Layout/TaxDataSuppliers",
                  Icon: <TbDatabaseCog size={20} />,
                  Text: "Datos Fiscales Proveedores",
                },
                {
                  link: "/Layout/Referrals",
                  Icon: <GrCatalogOption size={20} />,
                  Text: "Remisiones",
                },
                {
                  link: "/Layout/ReferralsHistory",
                  Icon: <GrBladesHorizontal size={20} />,
                  Text: "Historial de Remisiones",
                },
                {
                  link: "/Layout/InvoicesPendingIssue",
                  Icon: <GrDocumentUpload size={18} />,
                  Text: "Facturas Pendientes de Emisión",
                },
                {
                  link: "/Layout/CreditNotes",
                  Icon: <GrNote size={20} />,
                  Text: "Notas de Crédito",
                },
                {
                  link: "/Layout/PaymentComplements",
                  Icon: <MdOutlineBookmarkAdd size={22} />,
                  Text: "Complementos de Pago",
                },
                {
                  link: "/Layout/RelatedDocuments",
                  Icon: <IoGitNetworkOutline size={22} />,
                  Text: "Documentos Relacionados",
                },
                {
                  link: "/Layout/HistoryInvoicesIssued",
                  Icon: <GrDocumentTime size={18} />,
                  Text: "Historial de Facturas Emitidas",
                },
                {
                  link: "/Layout/InvoicesPendingReceipt",
                  Icon: <GrDocumentDownload size={18} />,
                  Text: "Facturas Pendientes de Recepción",
                },
                {
                  link: "/Layout/HistoryInvoicesReceipt",
                  Icon: <GrDocumentTime size={18} />,
                  Text: "Historial de Facturas Recibidas",
                },
              ],
            },
          ]
        : []),

      ...(userData.Roles === "Finanzas" || userData.Roles === "Administrador"
        ? [
            {
              key: "finance",
              label: "Finanzas",
              links: [
                {
                  link: "/Layout/BankAccounts",
                  Icon: <TbBuildingBank size={20} />,
                  Text: "Cuentas Bancarias",
                },
                {
                  link: "/Layout/Subscriptions",
                  Icon: <TbCreditCard size={20} />,
                  Text: "Abonos",
                },
                {
                  link: "/Layout/Retreats",
                  Icon: <TbCashRegister size={20} />,
                  Text: "Retiros",
                },
                {
                  link: "/Layout/PettyCash",
                  Icon: <TbCash size={20} />,
                  Text: "Caja Chica",
                },
              ],
            },
          ]
        : []),

      ...(userData.Roles === "Desarrollador" || userData.Roles === "Supervisor"
        ? [
            {
              key: "Admin",
              label: "Administración",
              links: [
                ...(userData.Roles === "Desarrollador"
                  ? [
                      {
                        link: "/Layout/Users",
                        Icon: <TbUsers size={20} />,
                        Text: "Usuarios",
                      },
                    ]
                  : []),
                ...(userData.Roles === "Supervisor"
                  ? [
                      {
                        link: "/Layout/VendorTarget",
                        Icon: <TbTargetArrow size={20} />,
                        Text: "Metas de  Vendedores",
                      },
                    ]
                  : []),
              ],
            },
          ]
        : []),
    ];
  }

  const toggleMenu = (key) => {
    setActiveMenu((prev) => (prev === key ? "" : key));
  };

  return (
    <div className="max-h-[580px] overflow-y-scroll scroll">
      <Link
        to={"/Layout/GroupTasks"}
        onClick={() => setActiveView("groupTasks")}
        className="relative w-full h-11 px-4 flex flex-row items-center gap-2 rounded-sm hover:bg-sovetec-thirty transition-UI"
      >
        {activeView === "groupTasks" && (
          <span className="absolute inset-y-0 left-0 w-1.5 bg-sovetec-thirty rounded-tr-md rounded-md" />
        )}
        <span>
          <TbUsersGroup size={20} />
        </span>
        <p className="text-[13px] hidden lg:flex">Tareas Compartidas</p>
        {pendingGroupTasks && (
          <span className="w-3 h-3  bg-red-600 rounded-full absolute top-0 left-0 pendingGroupTask" />
        )}
      </Link>

      {menuItems.map(({ key, label, links }) => (
        <div key={key}>
          <button
            className="w-full h-11 px-4 flex flex-row items-center gap-2 rounded-sm cursor-pointer"
            onClick={() => toggleMenu(key)}
          >
            {activeMenu === key ? (
              <FaChevronDown size={13} />
            ) : (
              <FaChevronRight size={13} />
            )}
            <p className="text-[13px] tracking-wide hidden lg:flex">{label}</p>
          </button>

          <div
            className={`w-full p-2 flex flex-col gap-2 ${
              activeMenu === key ? "flex" : "hidden"
            }`}
          >
            {links.map((item, index) => (
              <Link
                to={item.link}
                key={index}
                onClick={() => setActiveView(item.link)}
                className={`relative w-full h-11 px-4 flex flex-row items-center gap-2 rounded-sm hover:bg-sovetec-thirty transition-UI`}
              >
                {activeView === item.link && (
                  <span className="absolute inset-y-0 left-0 w-1.5 bg-sovetec-thirty rounded-tr-md rounded-md" />
                )}
                <span>{item.Icon}</span>
                <p className="text-[13px] hidden lg:flex">{item.Text}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Links;
