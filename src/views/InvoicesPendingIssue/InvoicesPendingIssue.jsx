import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { Link, useNavigate } from "react-router-dom";
import UploadXML from "./utilities/UploadXML";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbArrowRight, TbSearch } from "react-icons/tb";
import { Button } from "@radix-ui/themes";
import NewPaidAddon from "./utilities/NewPaidAddon";
import { useUser } from "../../Contexts/UserContext";

const InvoicesPendingIssue = () => {
  const [uploadXML, setUploadXML] = useState(null);
  const [invoiceseData, setInvoicesData] = useState([]);
  const [search, setSearch] = useState("");
  const [newAddon, setNewAddon] = useState(null);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getInvoiceDataCustomer().then((response) => {
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
        item?.VersionCotizacion?.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })), // Asegurar que hay una propiedad id única
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cotización
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.VersionCotizacion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          OC. Cliente
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.ClienteOrdenCompra}</p>
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
        <p className="font-normal text-sm">{item.FechaActualizacion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          $ {item.Total.toLocaleString("en-US")}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Subtotal
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          $ {item.Subtotal.toLocaleString("en-US")}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="flex justify-center items-center">
          <Button
            variant="soft"
            color="lime"
            onClick={() => navigate(`/Layout/InvoicesPendingIssue/NewPaidAddon/${item.ID}`)}
          >
            <p>Facturar</p> <TbArrowRight size={24} />
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
          <b>Ventas Pendientes de Facturar</b>
        </p>
        <p className="text-lg font-bold tracking-wide">
          Ventas Pendientes de Facturar
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
      {uploadXML && <UploadXML close={() => setUploadXML(null)} />}
      {newAddon && <NewPaidAddon close={() => setNewAddon(null)} />}
    </div>
  );
};

export default InvoicesPendingIssue;
