import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { TbEdit, TbPlus, TbSearch } from "react-icons/tb";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { Button, Tooltip } from "@radix-ui/themes";
import { LiaBoxesSolid } from "react-icons/lia";
import { AiOutlineDownload } from "react-icons/ai";

const Warehouses = () => {
  const [warehousesList, setWarehousesList] = useState([]);
  const [search, setSearch] = useState("");
  const [report, setReport] = useState(null);
  const navigate = useNavigate();

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

  const fetchWarehousesList = async () => {
    try {
      const response = await requests.getAllWarehouses();
      if (Array.isArray(response)) {
        setWarehousesList(response);
      } else {
        console.warn("La respuesta no es un arreglo:", response);
        setWarehousesList([]);
      }
    } catch (error) {
      console.error(error);
      setWarehousesList([]);
    }
  };

  useEffect(() => {
    fetchWarehousesList();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const safeString = (value) => (value ? String(value) : "");

  const data = {
    nodes: (warehousesList ?? [])
      .filter((item) =>
        (item?.Nombre ?? "").toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item?.ID ?? Math.random() })),
  };

  const fetchReport = async (ID) => {
    try {
      const response = await requests.getReport(ID); // Aquí recibes el base64 del backend

      if (response) {
        // Si tu backend devuelve directamente el base64:
        const base64String = response;

        // Convertir base64 a binario
        const byteCharacters = atob(base64String);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Crear blob de tipo Excel
        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);

        // Crear enlace de descarga temporal
        const link = document.createElement("a");
        link.href = url;
        link.download = `Reporte_${ID}.xlsx`; // 👈 descarga como Excel
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Liberar memoria
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error descargando Excel:", error);
    }
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Nombre
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{safeString(item?.Nombre)}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Ubicación
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{safeString(item?.Ubicacion)}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Movimientos
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Ver últimos movimientos">
            <Button
              variant="soft"
              color="amber"
              onClick={() =>
                navigate(`/Layout/Warehouses/Movements/${item?.ID}`)
              }
            >
              <LiaBoxesSolid size={24} /> Últimos Movimientos
            </Button>
          </Tooltip>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Reporte
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Ver Historial de Movimientos">
            <Button
              variant="soft"
              color="cyan"
              onClick={() => fetchReport(item?.ID)}
            >
              <AiOutlineDownload size={24} /> Descargar Reporte
            </Button>
          </Tooltip>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() => navigate(`/Layout/Warehouses/Update/${item?.ID}`)}
            >
              <TbEdit size={24} />
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
          <Link to="/Layout">Panel de Control</Link> / <b>Almacenes</b>
        </p>
        <p className="text-lg font-semibold">Almacenes</p>
      </div>
      <div className="line-row" />
      <Link to="/Layout/Warehouses/Add" className={GlobalStyles.btnAdd}>
        <p className="text-sm font-bold">Nuevo Almacén</p>
        <span>
          <TbPlus size={24} />
        </span>
      </Link>
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
      <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
        {data.nodes.length > 0 ? (
          <CompactTable
            columns={COLUMNS}
            data={data}
            theme={theme}
            layout={{ fixedHeader: true }}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
            No hay datos para mostrar
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehouses;
