import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useState } from "react";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbTrash } from "react-icons/tb";

const PaymentsTable = ({ paymentsList, onDeletePayment }) => {
  const [search, setSearch] = useState("");

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

  const data = {
    nodes: paymentsList
      .filter((item) =>
        item.Monto.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.id })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Fecha y Hora
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          {new Date(item.FechaPago).toLocaleString("es-MX", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Forma de Pago
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.FormaDePagoP}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Monto
        </div>
      ),
      renderCell: (item) => (
        <div className="font-normal capitalize">
          $
          {item.DoctoRelacionado
            .reduce((total, cfdi) => total + Number(cfdi.ImportePagado), 0)
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Moneda
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.MonedaP}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Pagos
        </div>
      ),
      renderCell: (item) => (
        <div className="flex flex-col gap-2">
          {item.DoctoRelacionado.map((cfdi) => (
            <p key={cfdi.id} className="font-normal capitalize">
              ${" "}
              {cfdi.ImportePagado.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              / {cfdi.uuid}
            </p>
          ))}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center">
          <Tooltip content="Eliminar">
            <Button
              variant="soft"
              color="red"
              onClick={() => onDeletePayment(item.id)}
            >
              <TbTrash size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="table-Scroll relative bg-white mb-2 max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] ">
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

export default PaymentsTable;
