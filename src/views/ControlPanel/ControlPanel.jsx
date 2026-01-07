import Products from "./utilities/Products";
import Services from "./utilities/Services";
import Customers from "./utilities/Customers";
import Enterprises from "./utilities/Enterprises";
import Quotes from "./utilities/Quotes";
import Amounts from "./utilities/Amounts";
import Commissions from "./utilities/Commissions";
import CommissionsSupervisor from "./utilities/CommissionsSupervisor";
import { useUser } from "../../Contexts/UserContext";

const ControlPanel = () => {
  const { userData } = useUser();
  const role = userData.Roles;

  // Cards base (siempre las 4 primeras)
  const baseCards = [
    <Customers key="customers" />,
    <Products key="products" />,
    <Services key="services" />,
    <Enterprises key="enterprises" />,
  ];

  // Reglas por rol
  const onlyBaseRoles = [
    "Responsable de Logistica de Almacen",
    "Encargado de Compras",
    "Desarrollador",
    "Finanzas",
  ];

  const extraCards =
    role === "Supervisor"
      ? [
          <Amounts key="amounts" />,
          <CommissionsSupervisor key="commSupervisor" />,
        ]
      : role === "Administrador"
      ? [<Quotes key="quotes" />, <Amounts key="amounts" />]
      : [
          <Quotes key="quotes" />,
          <Amounts key="amounts" />,
          <Commissions key="commissions" />,
        ];

  return (
    <div className="flex flex-col gap-2 m-4">
      {/* Header */}
      <div className="w-full flex flex-col gap-1">
        <div className="text-xs flex gap-1">
          <p>Sovetec</p> / <b>Panel de Control</b>
        </div>
        <p className="text-lg font-bold tracking-wide">Panel de Control</p>
      </div>

      <div className="line-row" />

      {/* Cards */}
      <div className="w-full flex gap-5">
        {onlyBaseRoles.includes(role) ? (
          <div className="flex gap-5">{baseCards}</div>
        ) : (
          <>
            <div className="flex flex-col gap-5">{baseCards}</div>
            <div className="flex flex-col gap-5">{extraCards}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
