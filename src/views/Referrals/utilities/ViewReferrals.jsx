import { useNavigate } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useEffect, useState } from "react";
import requests from "./requests";
import { TbPdf, TbSearch } from "react-icons/tb";
import { Button, Spinner, Tooltip } from "@radix-ui/themes";
import { RiCloseFill } from "react-icons/ri";
import ViewPDF from "../../ViewPDF/ViewPDF";

const ViewReferrals = ({ id, close }) => {
  const [listPendingSales, setListPendingSales] = useState([]);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState(null); // 👈 ID del botón que está cargando
  const navigate = useNavigate();
  const [viewDoc, setViewDoc] = useState(null);

  const theme = useTheme([
    getTheme(),
    {
      Row: `
        &:nth-of-type(odd) {
          background-color: #f7f7f7;
        }
        &:nth-of-type(even) {
          background-color: #ffffff;
        }
      `,
    },
  ]);

  useEffect(() => {
    requests.getReferralsSale(id).then((response) => {
      setListPendingSales(response);
      console.log(response);
    });
  }, [id]);

  const handleGetdocumentClick = async (referralID) => {
    try {
      setLoadingId(referralID); // 👈 activar loader solo en este
      const response = await requests.getReferralDocument(referralID);
      console.log(response);

      setViewDoc(response);
    } catch (error) {
      console.error("Error al cargar documento:", error);
    } finally {
      setLoadingId(null); // 👈 desactivar loader
    }
  };

  const data = {
    nodes: listPendingSales
      .filter((item) =>
        item.FechaEntrega?.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Num. de Remisión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.NumeroRemision}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha de Emisión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.FechaEmision}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha de Entrega
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.FechaEntrega}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Ver PDF
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Ver PDF">
            <Button
              variant="soft"
              color="amber"
              onClick={() => handleGetdocumentClick(item.ID)}
              disabled={loadingId === item.ID}
            >
              {loadingId === item.ID ? (
                // 👇 Loader solo en el botón clickeado
                <Spinner size="small" />
              ) : (
                <>
                  <TbPdf size={22} />
                </>
              )}
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
        <div className="bg-white p-5 rounded-md flex flex-col gap-2 min-w-115">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Remisiones</p>
            <span
              className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
              onClick={close}
            >
              <RiCloseFill size={24} />
            </span>
          </div>
          <div className="line-row" />
          {data.nodes.length > 0 ? (
            <div className="table-Scroll relative bg-white mr-5 mb-2 rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
              <CompactTable columns={COLUMNS} data={data} theme={theme} />
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
              <div className="flex flex-col justify-center items-center">
                <TbSearch size={30} />
                <p className="text-xl">Sin resultados</p>
              </div>
            </div>
          )}
        </div>
      </div>
      {viewDoc && (
        <ViewPDF base={viewDoc} version="" close={() => setViewDoc(null)} />
      )}
    </>
  );
};

export default ViewReferrals;
