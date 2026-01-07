import { RiCloseFill } from "react-icons/ri";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useState } from "react";
import { useEffect } from "react";
import requests from "./requests";
import { TbSearch } from "react-icons/tb";
import { Tooltip } from "@radix-ui/themes";

const ModalPayments = ({ UID, close }) => {
  const [search, setSearch] = useState("");
  const [paymentsList, setPaymentsList] = useState([]);

  useEffect(() => {
    requests.getPaymentRelated(UID).then((response) => {
      setPaymentsList(response);
      console.log(response);
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

  const data = {
    nodes: paymentsList
      .filter((item) =>
        item.FolioFiscal.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.UID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Folio
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.FolioFiscal} placement="top">
          <p className="font-normal capitalize text-sm">{item.FolioFiscal}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Moneda
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">{item.Moneda}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Numero de Parcialidad
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">{item.NoParcialidad}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Importe Anterior
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">
          $
          {item.SaldoAnterior.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Importe Pagado
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">
          $
          {item.MontoPagado.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Saldo Insoluto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">
          $
          {item.SaldoInsoluto.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Fecha de Pago
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize text-sm">{item.FechaPago}</p>
      ),
    },
  ];

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-3 max-w-[900px] min-w-[600px]">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Ver Pagos.</p>
            <span
              className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
              onClick={close}
            >
              <RiCloseFill size={24} />
            </span>
          </div>
          <div className="line-row" />
          {data.nodes.length > 0 ? (
            <div className="table-Scroll relative bg-white mr-5 mb-2  rounded-md overflow-hidden border border-zinc-300 max-h-[520px] overflow-y-scroll">
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
        </div>
      </div>
    </div>
  );
};

export default ModalPayments;
