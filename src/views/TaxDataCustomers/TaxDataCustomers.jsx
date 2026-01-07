import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const TaxDataCustomers = () => {
  const [listCustomer, setListCustomers] = useState([]);
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

  useEffect(() => {
    if (userData.Roles == "Supervisor") {
      requests.getEnterprisesSupervisor(userData.ID).then((response) => {
        setListCustomers(response);
      });
    } else if (userData.Roles == "Finanzas") {
      requests.getEnterprisesFinance(userData.ID).then((response) => {
        setListCustomers(response);
      });
    }
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: listCustomer.filter((item) =>
      item.Nombre.toLowerCase().includes(search.toLowerCase())
    ).map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Nombre}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          RFC
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.RFC}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Estatus
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Estatus}</p>
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
              color="green"
              onClick={() =>
                navigate(`/Layout/TaxDataCustomers/Complete/${item.ID}`)
              }
            >
              Ver Datos Fiscales
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
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Datos Fiscales Clientes</b>
        </p>
        <p className="text-lg font-semibold">Datos Fiscales Clientes</p>
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
    </div>
  );
};

export default TaxDataCustomers;
