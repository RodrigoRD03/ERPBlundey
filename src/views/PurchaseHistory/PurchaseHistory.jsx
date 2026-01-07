import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { Link } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbSearch } from "react-icons/tb";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import es from "date-fns/locale/es";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const PurchaseHistory = () => {
  const [listPurchases, setListPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [viewCalendar, setViewCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });
  const { userData } = useUser();
  let data = listPurchases;

  const theme = useTheme([
    getTheme(),
    {
      Row: `
          &:nth-of-type(odd) {
            background-color: #f7f7f7;
            }
            
            &:nth-of-type(even) {
              background-color: #G9G9G9;
          }
        `,
    },
  ]);

  useEffect(() => {
    if (userData.Roles == "Supervisor") {
      requests.getPruchasesHistorySupervisor(userData.ID).then((response) => {
        setListPurchases(response);
      });
    } else {
      requests.getPruchasesHistory(userData.ID).then((response) => {
        setListPurchases(response);
      });
    }
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: listPurchases
      .filter((item) =>
        item.Proveedor.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const formatDateUI = (date) => {
    return date.toLocaleDateString("es-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleSelect = (ranges) => {
    setDateRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const fetchDataWithDateRange = async () => {
    setViewCalendar(false);
    const object = {
      Inicio: formatDate(dateRange.startDate),
      Final: formatDate(dateRange.endDate),
    };

    if (userData.Roles == "Supervisor") {
      const response = await requests.getPurchaseHistoryDatesSupervisor(
        userData.ID,
        object
      );
      setListPurchases(response);
    } else {
      const response = await requests.getPurchaseHistoryDates(
        userData.ID,
        object
      );
      setListPurchases(response);
    }
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Identificador
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Identificador}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Cliente
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Cliente}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Proveedor
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Proveedor}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Cotización
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Cotizacion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          OC del Cliente
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.ClienteOrdenCompra}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Estatus
        </div>
      ),
      renderCell: (item) => (
        <div
          className={`text-xs ${
            item.Estatus == "Pendiente"
              ? "bg-amber-500"
              : item.Estatus == "Pendiente Supervisor"
              ? " bg-cyan-400"
              : item.Estatus == "Cancelada"
              ? "bg-red-600"
              : item.Estatus == "Revocar"
              ? "bg-purple-400"
              : "bg-green-400"
          } w-max px-3 py-2 flex justify-center items-center rounded-full text-white self`}
        >
          {item.Estatus}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          $ {item.Subtotal.toLocaleString("us-ES")}
        </p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Historial de Compras</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Historial de Compras</p>
      </div>
      <div className="line-row" />
      <div className="flex justify-between">
        <label
          htmlFor="search"
          className="w-max flex justify-between px-2 items-center bg-white border-2 border-zinc-200 rounded-full"
        >
          <input
            className="h-10 rounded-md py-2 outline-none"
            id="search"
            type="text"
            placeholder="Buscar en la tabla"
            value={search}
            onChange={handleSearch}
          />
          <span className="text-zinc-500">
            <TbSearch size={24} />
          </span>
        </label>
        <div className="relative h-11 flex gap-5 mr-5">
          <div className="flex bg-white px-5 rounded-sm">
            <div
              className="flex items-center gap-2 px-2 rounded-md text-sm cursor-pointer"
              onClick={() => setViewCalendar(!viewCalendar)}
            >
              Fechas:{" "}
              <b>
                {formatDateUI(dateRange.startDate)} -{" "}
                {formatDateUI(dateRange.endDate)}
              </b>
            </div>
            <div
              className={`absolute z-10 right-0 top-12 shadow-md ${
                viewCalendar ? "flex" : "hidden"
              }`}
            >
              <DateRangePicker
                ranges={[{ ...dateRange, key: "selection" }]}
                onChange={handleSelect}
                locale={es}
              />
            </div>
            <button
              onClick={fetchDataWithDateRange}
              className="size-9 m-auto flex justify-center items-center rounded-full hover:bg-zinc-100"
            >
              <TbSearch className="text-zinc-500" size={24} />
            </button>
          </div>
        </div>
      </div>
      {listPurchases.length !== 0 && data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mb-2 shadow-xl  rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <div className="">
            <CompactTable
              columns={COLUMNS}
              data={data}
              theme={theme}
              layout={{ fixedHeader: true }}
            />
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center">
            <span>
              <TbSearch size={30} />
            </span>
            <p className="text-xl">Sin resultados</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;
