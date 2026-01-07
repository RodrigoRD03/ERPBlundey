import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useState } from "react";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbTrash } from "react-icons/tb";

const RelatedCFDIsTable = ({ relatedCFDIsList, onDeleteCDFI }) => {
  const [search, setSearch] = useState("");

  const theme = useTheme([
    getTheme(),
    {
      Row: `
        &:nth-of-type(odd) {
          background-color: #ffffff;
          }
          
          &:nth-of-type(even) {
            background-color: #G9G9G9;
        }
      `,
    },
  ]);

  const data = {
    nodes: relatedCFDIsList
      .filter((item) => item.uuid.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.id })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Folio
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.uuid}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Moneda
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.MonedaDR}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Numero de Parcialidad
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.NumParcialidad}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Importe Anterior
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          $
          {item.ImpSaldoAnt.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Importe Pagado
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          $
          {item.ImportePagado.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Saldo Insoluto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          $
          {item.ImpSaldoInsoluto.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2 text-sm">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center">
          <Tooltip content="Eliminar">
            <Button
              variant="soft"
              color="red"
              onClick={() => onDeleteCDFI(item.id)}
            >
              <TbTrash size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
     <div className="table-Scroll w-full relative bg-sovetec-fourty mr-5 mb-2 max-w-[1280px] rounded-md overflow-hidden border border-sovetec-fourty max-h-[720px] transfer-table">
      <div className="">
        <CompactTable
          columns={COLUMNS}
          data={data}
          theme={theme}
          layout={{ fixedHeader: true }}
        />
      </div>
    </div>
  );
};

export default RelatedCFDIsTable;
