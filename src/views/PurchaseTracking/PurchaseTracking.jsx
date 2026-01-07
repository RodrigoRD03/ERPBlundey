import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import {
  TbCircleCheck,
  TbEdit,
  TbPaperclip,
  TbPdf,
  TbSearch,
} from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";
import AddFiles from "./utilities/AddFiles";
import ViewPDF from "../ViewPDF/ViewPDF";
import PurchaseReceived from "./utilities/PurchaseReceived";

const PurchaseTracking = () => {
  const [listPurchases, setListPurchases] = useState([]);
  const [search, setSearch] = useState("");
  const [viewPDF, setViewPDF] = useState(null);
  const [purchaseSelected, setPurchaseSelected] = useState("");
  const [base64, setBase64] = useState("");
  const [loadingButtons, setLoadingButtons] = useState({});
  const [purchaseReceive, setPurchaseReceived] = useState(null);
  const [addFiles, setAddFiles] = useState(null);
  const navigate = useNavigate();
  const { userData } = useUser();

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
      requests.getPurchaseTrackingSupervisor(userData.ID).then((response) => {
        setListPurchases(response);
      });
    } else {
      requests.getPurchaseTracking(userData.ID).then((response) => {
        setListPurchases(response);
      });
    }
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleGetBaseClick = async (ID, quote) => {
    setLoadingButtons((prev) => ({ ...prev, [ID]: true }));
    setPurchaseSelected(quote);
    const response = await requests.getPdfPurchase(ID);
    setBase64(response);
    setLoadingButtons((prev) => ({ ...prev, [ID]: false }));
    response && setViewPDF(true);
  };

  const data = {
    nodes: listPurchases
      .filter((item) =>
        item.Proveedor.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
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
          Fecha Estimada
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaEstimadaEntrega}</p>
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
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Archivos
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Button
            variant="soft"
            color="blue"
            onClick={() => setAddFiles(item.ID)}
          >
            <TbPaperclip size={18} />
          </Button>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Recibido
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Button
            variant="soft"
            color="lime"
            onClick={() => setPurchaseReceived(item.ID)}
          >
            Recibido <TbCircleCheck size={18} />
          </Button>
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
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() => navigate(`/Layout/PurchaseTracking/EditPurchase/${item.ID}`)}
            >
              <TbEdit size={24} />
            </Button>
          </Tooltip>
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="orange"
              loading={loadingButtons[item.ID] || false}
              onClick={() => handleGetBaseClick(item.ID, item.Cotizacion)}
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
          <b>Seguimiento de Compras</b>
        </p>
        <p className="text-lg font-semibold">Seguimiento de Compras</p>
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
      {addFiles && (
        <AddFiles purchaseID={addFiles} close={() => setAddFiles(null)} />
      )}
      {purchaseReceive && (
        <PurchaseReceived
          purchaseID={purchaseReceive}
          close={() => setPurchaseReceived(null)}
        />
      )}

      {viewPDF && (
        <ViewPDF
          base={base64}
          version={`OC${purchaseSelected}`}
          close={() => setViewPDF(null)}
        />
      )}
    </div>
  );
};

export default PurchaseTracking;
