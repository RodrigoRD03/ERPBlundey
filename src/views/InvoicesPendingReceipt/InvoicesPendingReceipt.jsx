import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbArrowRight, TbSearch } from "react-icons/tb";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useUser } from "../../Contexts/UserContext";

const InvoicesPendingReceipt = () => {
  const [uploadXML, setUploadXML] = useState(null);
  const [invoiceseData, setInvoicesData] = useState([]);
  const [search, setSearch] = useState("");
  const [newAddon, setNewAddon] = useState(null);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getInvoiceDataSupplier().then((response) => {
      setInvoicesData(response);
      console.log(response);
    });
  }, []);

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

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: invoiceseData
      .filter((item) =>
        item.ClienteEmpresa.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })), // Asegurar que hay una propiedad id única
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Id Orden de Comprar
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.Identificador}>
          <p className="font-normal text-sm">{item.Identificador}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Orden de Comprar
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm uppercase">
          {item.ClienteOrdenCompra}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.ClienteEmpresa}</p>
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
        <p className="font-normal text-sm">{item.Cliente}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha de Creación
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          {new Date(item.FechaCreacion).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha de Act.
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          {new Date(item.FechaActualizacion).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cotización
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.Cotizacion}>
          <p className="font-normal text-sm">{item.Cotizacion}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Estatus
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Estatus}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha Programada
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaEstimadaEntrega}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Button
            variant="soft"
            color="purple"
            onClick={() =>
              navigate(
                `/Layout/InvoicesPendingReceipt/InsertInvoice/${item.ID}`
              )
            }
          >
            Capturar <TbArrowRight size={24} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Facturas Pendientes de Recepción</b>
        </p>
        <p className="text-lg font-bold tracking-wide">
          Facturas Pendientes de Recepción
        </p>
      </div>
      <div className="line-row" />
      {userData.Roles != "Supervisor" ? (
        <div className="flex gap-4">
          <button
            className={`${GlobalStyles.btnAdd}`}
            onClick={() => setUploadXML(true)}
          >
            <p className="text-sm">Nueva Factura</p>
            <span>
              <GoPlus size={24} />
            </span>
          </button>
          <button
            className={`${GlobalStyles.btnAdd}`}
            onClick={() => setNewAddon(true)}
          >
            <p className="text-sm">Nuevo Complemento de Pago</p>
            <span>
              <GoPlus size={24} />
            </span>
          </button>
        </div>
      ) : (
        <div />
      )}
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
      {data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl  rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <div className="">
            <CompactTable columns={COLUMNS} data={data} theme={theme} />
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

export default InvoicesPendingReceipt;
