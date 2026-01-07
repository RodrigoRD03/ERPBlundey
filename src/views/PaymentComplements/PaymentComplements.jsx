import { useState } from "react";
import { Link } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import { TbSearch } from "react-icons/tb";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useEffect } from "react";
import requests from "./utilities/requests";
import { Button, Tooltip } from "@radix-ui/themes";
import { MdOutlinePayments } from "react-icons/md";
import ModalPayments from "./utilities/ModalPayments";

const PaymentComplements = () => {
  const [search, setSearch] = useState("");
  const [complementsList, setComplementsList] = useState([]);
  const [viewPayments, setViewPayments] = useState(null);

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
    requests.getPaymentsComplements().then((response) => {
      setComplementsList(response);
      console.log(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: complementsList
      .filter((item) => item.Folio.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.UID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Folio
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.Folio}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Versión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Version}</p>
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
        <p className="font-normal text-sm">{item.RazonSocialReceptor}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaTimbrado}</p>
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
        <p className="font-normal text-sm capitalize">{item.Status}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Pagos
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Descargar PDF">
            <Button
              variant="soft"
              color="purple"
              onClick={() => setViewPayments(item.UID)}
            >
              <span>
                <MdOutlinePayments size={20} />
              </span>
              Ver Pagos
            </Button>
          </Tooltip>
        </div>
      ),
      resize: true,
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Complementos de Pago</b>
        </p>
        <p className="text-lg font-bold">Complementos de Pago</p>
      </div>
      <div className="line-row" />
      <div className="max-w-[1280px] flex justify-between  gap-2 mr-5">
        <Link
          to="/Layout/PaymentComplements/Add"
          className={`${GlobalStyles.btnAdd}`}
        >
          <p className="text-sm">Nuevo Complemento</p>
          <span>
            <GoPlus size={24} />
          </span>
        </Link>
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
      </div>
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
      {viewPayments && <ModalPayments UID={viewPayments} close={() => setViewPayments(null)} />}
    </div>
  );
};

export default PaymentComplements;
