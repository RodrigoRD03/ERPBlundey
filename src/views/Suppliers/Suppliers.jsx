import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const Suppliers = () => {
  const [listSuppliers, setListSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  let data = listSuppliers;

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
    requests.getSuppliers().then((response) => {
      setListSuppliers(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: listSuppliers
      .filter((item) =>
        item.Nombre.toLowerCase().includes(search.toLowerCase())
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
        <p className="font-normal text-sm capitalize">{item.Nombre}</p>
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
        <p className="font-normal text-sm capitalize">{item.Contacto}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Correo Electronico
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm ">{item.CorreoElectronico}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Teléfono
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Telefono}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Dirección
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{`${item.Estado}, ${item.Municipio}, ${item.Colonia}, ${item.CodigoPostal}`}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Marcas
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="purple"
              onClick={() => navigate(`/Layout/Suppliers/Brands/${item.ID}`)}
            >
              Mostrar Marcas
            </Button>
          </Tooltip>
        </div>
      ),
      resize: true,
    },
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
              onClick={() => navigate(`/Layout/Suppliers/Update/${item.ID}`)}
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
          <Link to="/Layout">Panel de Control</Link> / <b>Proveedores</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Proveedores</p>
      </div>
      <div className="line-row" />
      <div className="max-w-full flex justify-between gap-2 mr-5">
        <Link to="/Layout/Suppliers/Add" className={`${GlobalStyles.btnAdd}`}>
          <p className="text-sm">Nuevo Proveedor</p>
          <span>
            <GoPlus size={24} />
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
      </div>
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
            <p className="text-xl">Sin resultados</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
