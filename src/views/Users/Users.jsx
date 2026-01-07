import requests from "./utilities/requests";
import { TbEdit, TbPlus, TbSearch } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { useEffect, useState } from "react";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button, Tooltip } from "@radix-ui/themes";

const Users = () => {
  const [usersList, setUsersList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  let data = usersList;

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
    requests.getUsersTable().then((response) => {
      setUsersList(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: usersList
      .filter((item) =>
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
        <p className="font-normal capitalize">{item.NombreCompleto}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w-full h-12 text-zinc-100 flex items-center pl-2">
          Rol
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Roles}</p>
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
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() => navigate(`/Layout/Users/Update/${item.ID}`)}
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
          <Link to="/Layout">Panel de Control</Link> / <b>Usuarios</b>
        </p>
        <p className="text-lg font-semibold">Usuarios</p>
      </div>
      <div className="line-row" />

      <div className="max-w-[1280px] flex justify-between gap-2 mr-5">
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
        <Link to="/Layout/Users/Add" className={`${GlobalStyles.btnAdd}`}>
          <p className="text-sm font-bold">Nuevo Usuario</p>
          <span>
            <TbPlus size={24} />
          </span>
        </Link>
      </div>
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
    </div>
  );
};

export default Users;
