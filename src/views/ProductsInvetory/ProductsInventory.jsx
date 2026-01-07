import { TbEdit, TbFileDownload, TbPlus, TbSearch } from "react-icons/tb";
import GlobalStyles from "../../globalStyles";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button, Tooltip } from "@radix-ui/themes";
import { LuMapPin } from "react-icons/lu";
import { useUser } from "../../Contexts/UserContext";
import WatchAddress from "./utilities/WatchAddress";
import { GrDocumentDownload } from "react-icons/gr";

const ProductsInventory = () => {
  const [watchAddress, setWatchAddress] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser();

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

  const fetchProductsInvetory = async () => {
    try {
      const response = await requests.getAllProductsInventory();
      if (Array.isArray(response)) {
        setProductsList(response);
        console.log(response);
      } else {
        console.warn("La respuesta no es un arreglo:", response);
        setProductsList([]);
      }
    } catch (error) {
      console.error(error);
      setProductsList([]);
    }
  };

  useEffect(() => {
    fetchProductsInvetory();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const safeString = (value) => (value ? String(value) : "");

  const data = {
    nodes: (productsList ?? [])
      .filter((item) =>
        (item?.Modelo ?? "").toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item?.ID ?? Math.random() })),
  };

  const handleDownload = async () => {
    try {
      const response = await requests.getGeneralInventoryReport();
      console.log(response);

      // Asumiendo que el backend devuelve { base64: "..." }

      if (response) {
        const byteCharacters = atob(response);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);

        const blob = new Blob([byteArray], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "ReporteGeneral.xlsx"; // nombre del archivo
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("No se recibió el archivo.");
      }
    } catch (error) {
      console.error("Error descargando el reporte:", error);
    }
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Modelo
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{safeString(item?.Modelo)}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Descripción
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          {safeString(item?.Descripcion)}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          {safeString(item?.CantidadDisponible)}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Ult. Actualización
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">
          {safeString(item?.FechaModificacion)}
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
      renderCell: (item) => {
        const status = safeString(item?.Estatus);
        return status === "Activo" ? (
          <div className="font-normal capitalize bg-green-200 w-max px-3 py-1 text-sm rounded-full text-green-600">
            {status}
          </div>
        ) : (
          <div className="font-normal capitalize bg-red-200 text-red-600 px-3 py-1 w-max rounded-full">
            {status}
          </div>
        );
      },
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
          <Tooltip content="Mostrar Ubicaciones">
            <Button
              variant="soft"
              color="amber"
              onClick={() => setWatchAddress(item.ID)}
            >
              <LuMapPin size={24} /> Ubicaciones
            </Button>
          </Tooltip>
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() =>
                navigate(`/Layout/ProductsInventory/Update/${item?.ID}`)
              }
            >
              <TbEdit size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleInsertInventoryMovementClick = async (type, redirect) => {
    const response = await requests.InsertInventoryMovement({
      UsuarioID: userData.ID,
      TipoMovimiento: type,
    });
    console.log(response);
    response && type == "Entrada" && navigate(`${redirect}/${response.ID}`);
    response && type == "Salida" && navigate(`${redirect}/${response.ID}`);
    response && type == "Ajuste" && navigate(`${redirect}/${response.ID}`);
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Productos del Inventario</b>
        </p>
        <p className="text-lg font-semibold">Productos del Inventario</p>
      </div>
      <div className="line-row" />

      <div className="max-w-[1280px] flex justify-between  gap-2 mr-5">
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
        <div className="flex gap-2">
          <button
            // to="/Layout/ProductsInventory/Inputs"
            onClick={() =>
              handleInsertInventoryMovementClick(
                "Entrada",
                "/Layout/ProductsInventory/Inputs"
              )
            }
            className={GlobalStyles.btnAdd}
          >
            <p className="text-sm font-bold">Entradas</p>
            <span>
              <TbPlus size={24} />
            </span>
          </button>
          <button
            onClick={() =>
              handleInsertInventoryMovementClick(
                "Salida",
                "/Layout/ProductsInventory/Outputs"
              )
            }
            className={GlobalStyles.btnAdd}
          >
            <p className="text-sm font-bold">Salidas</p>
            <span>
              <TbPlus size={24} />
            </span>
          </button>
          <Tooltip content="Mover de Ubicación el producto">
            <button
              onClick={() =>
                handleInsertInventoryMovementClick(
                  "Ajuste",
                  "/Layout/ProductsInventory/Adjustment"
                )
              }
              className={GlobalStyles.btnAdd}
            >
              <p className="text-sm font-bold">Ajuste</p>
              <span>
                <TbPlus size={24} />
              </span>
            </button>
          </Tooltip>

          <Tooltip content="Descargar Reporte General">
            <button
              onClick={handleDownload}
              className="bg-cyan-600 p-2 rounded-lg text-zinc-100 flex gap-2 items-center"
            >
              Reporte General
              <TbFileDownload size={24} />
            </button>
          </Tooltip>
        </div>
      </div>

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
      {watchAddress && (
        <WatchAddress ID={watchAddress} close={() => setWatchAddress(null)} />
      )}
    </div>
  );
};

export default ProductsInventory;
