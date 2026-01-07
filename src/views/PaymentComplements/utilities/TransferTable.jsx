import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useState } from "react";

const TransferTable = ({ transferData }) => {
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
    nodes: transferData
      .filter((item) => item.tax.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2">
          Impuesto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.tax}</p>
      ),
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2">
          Base
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">${item.base.toFixed(6)}</p>
      ),
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2">
          Factor
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.factor}</p>
      ),
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12 text-sovetec-primary  flex items-center pl-2">
          Tasa/Cuota
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.rate.toFixed(6)}</p>
      ),
    },
    {
      label: (
        <div className="bg-sovetec-fifty h-12  text-sovetec-primary flex items-center pl-2">
          Importe
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">${item.import.toFixed(2)}</p>
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

export default TransferTable;
