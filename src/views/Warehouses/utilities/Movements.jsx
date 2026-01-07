import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import requests from "./requests";
import { TbSearch } from "react-icons/tb";
import { Button } from "@radix-ui/themes";
import { AiOutlineEye } from "react-icons/ai";
import {
  HiOutlineDocumentArrowUp,
  HiOutlineDocumentCheck,
} from "react-icons/hi2";
import MovementDetails from "./MovementDetails";
import InsertDocument from "./InsertDocument";
import ViewPDF from "../../ViewPDF/ViewPDF";

const Movements = ({}) => {
  const [movementsList, setMovementsList] = useState([]);
  const [search, setSearch] = useState("");
  const { ID } = useParams();
  const [movementDetails, setMovementDetails] = useState(null);
  const [insertDocument, setInsertDocument] = useState(null);
  const [viewPDF, setViewPDF] = useState(null);
  let data = movementsList;

  const fetchMovements = async () => {
    try {
      const response = await requests.getMoventsInventary(ID);
      console.log(response);
      setMovementsList(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovements();
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

  data = {
    nodes: movementsList
      ?.filter((item) =>
        item?.Motivo?.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const fetchPDF = async (ID) => {
    const response = await requests.getDocumentPDF(ID);

    if (response) {
      setViewPDF(response);
    }
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Tipo de Movimiento
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.TipoMovimiento}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Recibido o Entregado por:
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          {item.Recibido || item.Entregado}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Motivo
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Motivo}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Fecha
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.FechaMovimiento}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Datos
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Button
            variant="soft"
            color="lime"
            onClick={() => setMovementDetails(item?.ID)}
          >
            <AiOutlineEye size={24} /> Ver Datos
          </Button>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Documento
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          {!item.DocumentoRespaldoID ? (
            <Button
              variant="soft"
              color="cyan"
              onClick={() => setInsertDocument(item?.ID)}
            >
              <HiOutlineDocumentArrowUp size={24} /> Añadir Documento
            </Button>
          ) : (
            <Button
              variant="soft"
              color="amber"
              onClick={() => fetchPDF(item?.DocumentoRespaldoID)}
            >
              <HiOutlineDocumentCheck size={24} /> Ver Documento
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Warehouses">Almacenes</Link> /{" "}
          <b>Ultimos Movimientos</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Ultimos Movimientos</p>
        <div className="line-row" />
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

      {(data?.nodes?.length ?? 0) > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <CompactTable columns={COLUMNS} data={data} theme={theme} />
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
      {movementDetails && (
        <MovementDetails
          warehouseID={ID}
          movementID={movementDetails}
          close={() => setMovementDetails(null)}
        />
      )}
      {insertDocument && (
        <InsertDocument
          movementInventoryID={insertDocument}
          onClose={() => {
            setInsertDocument(null);
            fetchMovements();
          }}
        />
      )}
      {viewPDF && (
        <ViewPDF base={viewPDF} version="" close={() => setViewPDF(null)} />
      )}
    </div>
  );
};

export default Movements;
