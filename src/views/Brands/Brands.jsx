import { useState, useEffect } from "react";
import requests from "./utilities/requests";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbPlus, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";
import { useUser } from "../../Contexts/UserContext";

const Brands = () => {
  const [brandsList, setBrandsList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser();
  let data = brandsList;

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
    requests.getBrands().then((response) => {
      // Asegurar que los datos sean un array
      setBrandsList(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: brandsList
      .filter(
        (item) =>
          item.NombreCompleto &&
          item.NombreCompleto.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Nombre
        </div>
      ),
      renderCell: (item) => (
        <p className="font-nromal capitalize">{item.NombreCompleto}</p>
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
        <div className="px-4 flex ">
          <img
            src={item.RutaImagen}
            alt="Brand Logo"
            className="h-32  object-contain"
          />
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
              <div className="font-nromal capitalize flex justify-center items-center">
                <Tooltip content="Editar">
                  <Button
                    variant="soft"
                    color="lime"
                    onClick={() => navigate(`/Layout/Brands/Update/${item.ID}`)}
                  >
                    <TbEdit size={24} />
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
          <Link to="/Layout">Panel de Control</Link> / <b>Marcas</b>
        </p>
        <p className="text-lg font-semibold">Marcas</p>
        <div className="line-row" />
      </div>
      <div className="max-w-[1280px] flex justify-between  gap-2 mr-5">
        {userData.Roles == "Encargado de Compras" ? (
          <Link to="/Layout/Brands/Add" className={`${GlobalStyles.btnAdd}`}>
            <p className="text-sm font-bold">Nueva Marca</p>
            <span>
              <TbPlus size={24} />
            </span>
          </Link>
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
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
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
            <p className="text-xl">Sin resultados</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brands;
