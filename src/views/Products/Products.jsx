import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import GlobalStyles from "../../globalStyles";
import { Link, useNavigate } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbEdit, TbSearch, TbTrash } from "react-icons/tb";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import DeleteProduct from "./utilities/DeleteProduct";
import { useUser } from "../../Contexts/UserContext";
import { GrUpdate } from "react-icons/gr";
import UpdatePrices from "./utilities/UpdatePrices";

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const [deleteProdut, setDeleteProduct] = useState(null);
  const [updatePrices, setUpdatePrices] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser();
  let data = productsList;

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
    requests.getProducts().then((response) => {
      setProductsList(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: productsList
      .filter(
        (item) =>
          item.Nombre.toLowerCase().includes(search.toLowerCase()) ||
          item.Modelo.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })), // Asegurar que hay una propiedad id única
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Nombre
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Nombre}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w-full h-12 text-zinc-100 flex items-center pl-2">
          Imagen
        </div>
      ),
      renderCell: (item) => (
        <div className="flex size-36 rounded-full overflow-hidden">
          <img
            src={item.RutaImagen}
            alt="Brand Logo"
            className="w-full h-full object-contain"
          />
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Modelo
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Modelo}</p>
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
        <div className="flex gap-1">
          <p className="font-normal capitalize">
            $ {item.PrecioVenta.toLocaleString("en-US")}
          </p>
          <p className="text-xs mt-[2px]">{item.Dolar ? "USD" : "MXM"}</p>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Ult. Actualización de precio
        </div>
      ),
      renderCell: (item) => (
        <div className="flex gap-1">
          <p className="font-normal capitalize">
            {item.UltimaActualizacionPrecio}
          </p>
        </div>
      ),
      ...(userData.Roles === "Encargado de Compras" && { resize: true }),
    },
    ...(userData.Roles == "Encargado de Compras"
      ? [
          {
            label: (
              <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
                Acciones
              </div>
            ),
            renderCell: (item) => (
              <div className="font-bold capitalize flex justify-center items-center gap-3">
                <Tooltip content="Editar">
                  <Button
                    variant="soft"
                    color="lime"
                    onClick={() =>
                      navigate(`/Layout/Products/Update/${item.ID}`)
                    }
                  >
                    <TbEdit size={24} />
                  </Button>
                </Tooltip>
                <Tooltip content="Eliminar">
                  <Button
                    variant="soft"
                    color="red"
                    onClick={() => setDeleteProduct(item.ID)}
                  >
                    <TbTrash size={24} />
                  </Button>
                </Tooltip>
              </div>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Productos</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Productos</p>
      </div>
      <div className="line-row" />
      <div className="max-w-full flex justify-between  gap-2 mr-5">
        {userData.Roles == "Encargado de Compras" ? (
          <div className="flex gap-4">
            <Link
              to="/Layout/Products/Add"
              className={`${GlobalStyles.btnAdd}`}
            >
              <p className="text-sm">Nuevo Producto</p>
              <span>
                <GoPlus size={24} />
              </span>
            </Link>
            <button className="w-48 h-12 bg-emerald-500 flex justify-center items-center gap-2 rounded-md text-white hover:bg-emerald-600 transition-colors" onClick={() => setUpdatePrices(true)}>
              <p className="text-sm">Actualizar Precios</p>
              <span>
                <GrUpdate size={18} />
              </span>
            </button>
          </div>
        ) : (
          <div />
        )}
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
      </div>
      {data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <div>
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
      {deleteProdut && (
        <DeleteProduct
          productID={deleteProdut}
          close={() => setDeleteProduct(null)}
        />
      )}
      {updatePrices && <UpdatePrices close={() => setUpdatePrices(null)} />}
    </div>
  );
};

export default Products;
