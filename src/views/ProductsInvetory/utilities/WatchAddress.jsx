import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import requests from "./requests";

const WatchAddress = ({ ID, close }) => {
  const [listAddress, setListAddress] = useState([]);

  // Mismo estilo que tus tablas principales
  const theme = useTheme([
    getTheme(),
    {
      Row: `
        &:nth-of-type(odd) {
          background-color: #f7f7f7;
        }
        &:nth-of-type(even) {
          background-color: #e9e9e9;
        }
      `,
    },
  ]);

  const fetchAddressesList = async () => {
    try {
      const response = await requests.watchAddressOutsideView(ID);
      setListAddress(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error(error);
      setListAddress([]);
    }
  };

  useEffect(() => {
    fetchAddressesList();
  }, []);

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Modelo Producto
        </div>
      ),
      renderCell: (item) => item.ModeloProducto,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => item.Cantidad,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Almacén
        </div>
      ),
      renderCell: (item) => item.NombreAlmacen,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Estante
        </div>
      ),
      renderCell: (item) => item.Estante,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Sección
        </div>
      ),
      renderCell: (item) => item.Seccion,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha Creación
        </div>
      ),
      renderCell: (item) => item.FechaCreacion,
    },
  ];

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2 justify-center max-w-4xl w-full">
        <div className="flex justify-between">
          <p className="text-lg font-bold">Ubicaciones del Producto</p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer hover:bg-red-500 hover:text-white"
            onClick={close}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />

        <div className="table-Scroll relative bg-white border border-zinc-300 rounded-md overflow-hidden max-h-[600px] overflow-y-scroll mt-3">
          {listAddress.length > 0 ? (
            <CompactTable
              columns={COLUMNS}
              data={{ nodes: listAddress }}
              theme={theme}
              layout={{ fixedHeader: true }}
            />
          ) : (
            <div className="p-6 text-center text-gray-500">
              No hay ubicaciones para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchAddress;
