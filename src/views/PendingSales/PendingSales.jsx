import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { Link } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button } from "@radix-ui/themes";
import { TbPackageExport, TbSearch } from "react-icons/tb";
import ChangeStatus from "./utilities/ChangeStatus";
import ShipmentData from "./utilities/ShipmentData";

const PendingSales = () => {
  const [listSales, setListsales] = useState([]);
  const [search, setSearch] = useState("");
  const [changeStatus, setChangeStatus] = useState(null);
  const [shipmentData, setShipmentData] = useState(null);
  const { userData } = useUser();
  let data = listSales;

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
    requests.getPendingSales(userData.ID).then((response) => {
      setListsales(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: listSales
      .filter((item) =>
        item.ClienteNombre.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Nombre del Contacto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.ClienteNombre}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Empresa}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Vendedor
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.UsuarioNombre}</p>
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
        <p className="font-normal text-sm capitalize">
          {item.ClienteOrdenCompra}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Versión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Version}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Entrega Estimada
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.FechaEntregaEstimada}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Estatus
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Estatus}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Precio
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          $
          {!item.Dolar ? (
            <>{item.Subtotal.toLocaleString("es-US")} MXN</>
          ) : (
            <>{item.Subtotal.toLocaleString("es-US")} US</>
          )}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Cambiar Estatus
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Button
            variant="soft"
            color="green"
            onClick={() => setChangeStatus(item.ID)}
          >
            Cambiar Estatus
          </Button>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Envío
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Button
            variant="soft"
            color="yellow"
            onClick={() => setShipmentData(item.ID)}
          >
            <TbPackageExport size={20} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Ventas Pendientes</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Ventas Pendientes</p>
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
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl  rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
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
            <p className="text-xl">No se encontraron ventas.</p>
          </div>
        </div>
      )}
      {changeStatus && (
        <ChangeStatus ID={changeStatus} close={() => setChangeStatus(null)} />
      )}
      {shipmentData && (
        <ShipmentData ID={shipmentData} close={() => setShipmentData(null)} />
      )}
    </div>
  );
};

export default PendingSales;
