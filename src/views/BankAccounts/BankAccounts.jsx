import { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import {
  TbArrowsExchange,
  TbClipboardData,
  TbEdit,
  TbSearch,
  TbTrash,
} from "react-icons/tb";
import { p } from "@table-library/react-table-library/styles-492c6342";
import { Button, Tooltip } from "@radix-ui/themes";
import Report from "./utilities/Report";

const BankAccounts = () => {
  const [bankList, setBankList] = useState([]);
  const [search, setSearch] = useState("");
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

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
    requests.getBankAccounts().then((response) => {
      setBankList(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: bankList
      .filter(
        (item) =>
          item.Banco.toLowerCase().includes(search.toLowerCase()) ||
          item.NumeroCuenta.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Banco
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.Banco}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Tipo
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.Tipo}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Numero de Cuenta
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.NumeroCuenta}</p>
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
        <p className="font-normal text-sm">{item.Estatus}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Saldo
        </div>
      ),
      renderCell: (item) => (
        <div className="font-normal text-sm">
          {item.Tipo == "Nacional" ? (
            <p> $ {item.Saldo.toLocaleString("en-US")} MXN</p>
          ) : (
            <p>$ {item.Saldo.toLocaleString("en-US")} USD</p>
          )}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Reportes
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="yellow"
              onClick={() => setReport(item.ID)}
            >
              <TbClipboardData size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() => navigate(`/Layout/BankAccounts/Update/${item.ID}`)}
            >
              <TbEdit size={24} />
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
          <Link to="/Layout">Panel de Control</Link> / <b>Cuentas Bancarias</b>
        </p>
        <p className="text-lg font-bold">Cuentas Bancarias</p>
      </div>
      <div className="line-row" />
      <div className="flex gap-2">
        <Link
          to="/Layout/BankAccounts/Add"
          className={`${GlobalStyles.btnAdd}`}
        >
          <p className="text-sm">Nuevo Cuenta</p>
          <span>
            <GoPlus size={24} />
          </span>
        </Link>
        <Link
          to="/Layout/BankAccounts/CurrencyExchange"
          className={`${GlobalStyles.btnAdd}`}
        >
          <p className="text-sm">Cambio de Divisas</p>
          <span>
            <TbArrowsExchange size={24} />
          </span>
        </Link>
      </div>
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
      {report && <Report accountID={report} close={() => setReport(null)} />}
    </div>
  );
};

export default BankAccounts;
