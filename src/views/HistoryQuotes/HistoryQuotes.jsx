import { Link } from "react-router-dom";
import requests from "./utilities/requests";
import { useEffect, useState } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useUser } from "../../Contexts/UserContext";
import { TbPdf, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";
import ViewPDF from "../ViewPDF/ViewPDF";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import es from "date-fns/locale/es";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const HistoryQuotes = () => {
  const [listQuotes, setListQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [viewPdf, setViewPdf] = useState(null);
  const [loadingButtons, setLoadingButtons] = useState({});
  const [quoteVersion, setQuoteVersion] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [viewCalendar, setViewCalendar] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });

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

  const { userData } = useUser();

  useEffect(() => {
    if (userData.Roles == "Administrador") {
      requests.getHistoryQuotesAdmin().then((response) => {
        setListQuotes(response);
      });
    } else if (userData.Roles == "Supervisor") {
      requests.getHistoryQuotesSupervisor(userData.ID).then((response) => {
        setListQuotes(response);
      });
    } else {
      requests.getHistoryQuotesSeller(userData.ID).then((response) => {
        setListQuotes(response);
      });
    }
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleGetPDFClick = async (quoteID, version) => {
    setLoadingButtons((prev) => ({ ...prev, [quoteID]: true }));
    const response = await requests.getBase(quoteID);
    setViewPdf(response);
    setQuoteVersion(version);
    setLoadingButtons((prev) => ({ ...prev, [quoteID]: false }));
  };

  const handleFilterStatusList = (event) => {
    setFilterStatus(event.target.value);
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

  const handleRevokeQuoteClick = async (ID) => {
    const response = await requests.revokeQuote(ID);
    response && window.location.reload();
  };

  const fetchDataWithDateRange = async () => {
    setViewCalendar(false);
    const object = {
      Inicio: formatDate(dateRange.startDate),
      Fin: formatDate(dateRange.endDate),
    };
    if (userData.Roles == "Administrador") {
      const response = await requests.getHistoryQuotesDatesAdmin(object);
      setListQuotes(response);
    } else if (userData.Roles == "Supervisor") {
      const response = await requests.getHistoryQuotessDatesSupervisor(object);
      setListQuotes(response);
    } else {
      const response = await requests.getHistoryQuotesDatesSeller(object);
      setListQuotes(response);
    }
  };

  const data = {
    nodes: listQuotes
      .filter(
        (item) =>
          item.ClienteNombre.toLowerCase().includes(search.toLowerCase()) ||
          item.UsuarioNombre.toLowerCase().includes(search.toLowerCase()) ||
          item.Empresa.toLowerCase().includes(search.toLowerCase()) ||
          item.Version.toLowerCase().includes(search.toLowerCase())
      )
      .filter((item) =>
        filterStatus === "" || filterStatus === "Todas"
          ? true
          : item.Estatus === filterStatus
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">{item.Empresa}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cliente
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">{item.ClienteNombre}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Vendedor
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">{item.UsuarioNombre}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Versión
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.Version}>
          <p className="font-normal text-sm ">{item.Version}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Estatus
        </div>
      ),
      renderCell: (item) => (
        <div className="flex flex-col gap-2">
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
          {item.Estatus == "Revocar" && (
            <Button
              variant="surface"
              className="!w-28"
              onClick={() => handleRevokeQuoteClick(item.ID)}
            >
              Revocar
            </Button>
          )}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Creación
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaCreacion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Ult. Actualización
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaActualizacion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Entrega Aprox.
        </div>
      ),
      renderCell: (item) => (
        <div className="font-normal text-sm">
          {item.Estatus == "Completada" ? (
            <p>{item.FechaEntregaOrdenCompra}</p>
          ) : item.Estatus == "Cancelada" ? (
            <p>La cotización fue cancelada</p>
          ) : (
            <p>Complete la Cotización</p>
          )}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          {!item.Dolar ? (
            <>{item.Subtotal.toLocaleString("es-US")} MXN</>
          ) : (
            <>{item.Subtotal.toLocaleString("es-US")}US</>
          )}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Ver
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Ver PDF">
            <Button
              variant="soft"
              color="yellow"
              loading={loadingButtons[item.ID] || false}
              onClick={() => handleGetPDFClick(item.ID, item.Version)}
            >
              <TbPdf size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Historial de Cotizaciones</b>
        </p>
        <p className="text-lg font-bold">Historial de Cotizaciones.</p>
      </div>
      <div className="line-row" />
      <div className="flex justify-between items-center">
        <label className="flex items-center bg-white border-2 border-zinc-200 rounded-full px-2">
          <input
            className="h-10 rounded-md py-2 outline-none"
            type="text"
            placeholder="Buscar en la tabla"
            value={search}
            onChange={handleSearch}
          />
          <span className="text-zinc-500">
            <TbSearch size={24} />
          </span>
        </label>
        <div className="relative h-11 flex gap-5">
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
              className={`absolute z-10 right-72 top-10 shadow-md ${
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
          <select
            className="h-11 bg-white px-2 rounded-sm border-2 border-zinc-200 cursor-pointer"
            value={filterStatus}
            onChange={handleFilterStatusList}
          >
            <option value="Todas">Todas</option>
            <option value="Completada">Completadas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="Pendiente Supervisor">Pendientes Supervisor</option>
            <option value="Cancelada">Canceladas</option>
          </select>
        </div>
      </div>
      {data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mb-2 shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <CompactTable
            columns={COLUMNS}
            data={data}
            theme={theme}
            layout={{ fixedHeader: true }}
          />
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

      {viewPdf && (
        <ViewPDF
          base={viewPdf}
          version={quoteVersion}
          close={() => setViewPdf(null)}
        />
      )}
    </div>
  );
};

export default HistoryQuotes;
