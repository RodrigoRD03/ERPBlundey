import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { Link } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbPdf, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";
import ViewPDF from "../ViewPDF/ViewPDF";
import StartOrder from "./utilities/StartOrder";

const CompleteQuotes = () => {
  const [listQuotes, setListQuotes] = useState([]);
  const [search, setSearch] = useState("");
  const [viewPdf, setViewPdf] = useState(null);
  const [loadingButtons, setLoadingButtons] = useState({});
  const [quoteVersion, setQuoteVersion] = useState("");
  const [initOrder, setInitOrder] = useState(null);
  const { userData } = useUser();
  let data = listQuotes;

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
    requests.getCompleteQuotes(userData.ID).then((response) => {
      setListQuotes(response);
    });
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

  data = {
    nodes: listQuotes
      .filter(
        (item) =>
          item.ClienteNombre.toLowerCase().includes(search.toLowerCase()) ||
          item.UsuarioNombre.toLowerCase().includes(search.toLowerCase()) ||
          item.Empresa.toLowerCase().includes(search.toLowerCase()) ||
          item.Version.toLowerCase().includes(search.toLowerCase())
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
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          $
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
          Orden
        </div>
      ),
      renderCell: (item) => (
        <Button
          variant="soft"
          color="green"
          onClick={() => setInitOrder(item.ID)}
        >
          Iniciar Orden
        </Button>
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
          <b>Cotizaciones Completadas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">
          Cotizaciones Completadas
        </p>
      </div>
      <div className="line-row" />
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
        <div className="table-Scroll relative bg-white mb-2 shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <CompactTable
            columns={COLUMNS}
            data={data}
            theme={theme}
            layout={{ fixedHeader: true }}
          />
        </div>
      ) : (
        <div className="h-48 text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center">
            <span>
              <TbSearch size={30} />
            </span>
            <p className="text-xl">No se encontraron cotizaciones.</p>
          </div>
        </div>
      )}
      {initOrder && (
        <StartOrder quoteID={initOrder} close={() => setInitOrder(null)} />
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

export default CompleteQuotes;
