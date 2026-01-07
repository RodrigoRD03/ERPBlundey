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

const SalesHistory = () => {
  const [listSales, setListSales] = useState([]);
  const [search, setSearch] = useState("");
  const [viewCalendar, setViewCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });

  const { userData } = useUser();
  let data = listSales;

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
    requests.getHistorySales(userData.ID).then((response) => {
      setListSales(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: listSales
      .filter((item) =>
        item.ClienteNombre.toLowerCase().includes(search.toLowerCase())
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

    const response = await requests.getHistorySalesDates(userData.ID, object);
    setListSales(response);
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Nombre del Contacto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.ClienteNombre}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Empresa}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Vendedor
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.UsuarioNombre}</p>
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
        <p className="font-normal text-sm capitalize">
          {item.ClienteOrdenCompra}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Versión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Version}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Entrega Estimada
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.FechaEntregaEstimada}
        </p>
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
          Precio
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          $
          {!item.Dolar ? (
            <>{item.Subtotal.toLocaleString("es-US")} MXN</>
          ) : (
            <>{item.Subtotal.toLocaleString("es-US")} US</>
          )}
        </p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Historial de Ventas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Historial de Ventas</p>
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
      {listSales.length !== 0 && data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl  rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
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
            <p className="text-xl">No se encontraron ventas.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
