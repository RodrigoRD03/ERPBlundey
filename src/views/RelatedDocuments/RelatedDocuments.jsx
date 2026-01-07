import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import { Link } from "react-router-dom";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useEffect } from "react";
import { Button, Tooltip } from "@radix-ui/themes";
import { MdOutlinePayments } from "react-icons/md";
import ModelDocuments from "./utilities/ModelDocuments";

const RelatedDocuments = () => {
  const [search, setSearch] = useState("");
  const [relatedDopumentsList, setRelatedDocumentsList] = useState([]);
  const [viewDocuments, setViewDocuments] = useState(null);

  useEffect(() => {
    requests.getRelatedDocuments().then((response) => {
      console.log(response.data);

      setRelatedDocumentsList(response.data);
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
    nodes: relatedDopumentsList
      .filter((item) =>
        item?.Folio?.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
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
          Orden
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.NumOrder}</p>
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
          <Tooltip content="Ver Documentos">
            <Button
              variant="soft"
              color="purple"
              onClick={() => setViewDocuments(item.UID)}
            >
              <span>
                <MdOutlinePayments size={20} />
              </span>
              Ver Documentos
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
          <b>Documentos Relacionados</b>
        </p>
        <p className="text-lg font-bold tracking-wide">
          Documentos Relacionados
        </p>
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
      {
        viewDocuments && (
          <ModelDocuments
            UID={viewDocuments}
            close={() => setViewDocuments(null)}
          />
        )
      }
    </div>
  );
};

export default RelatedDocuments;
