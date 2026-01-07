import { useState, useEffect } from "react";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import { Button, Tooltip } from "@radix-ui/themes";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbSearch } from "react-icons/tb";

const Customers = () => {
  const [listCustomers, setListCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { userData } = useUser();
  let data = listCustomers;

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
    if (
      userData.Roles == "Vendedor Comisionista" ||
      userData.Roles == "Vendedor con Sueldo + Comisión"
    ) {
      requests.getCustomersSellers(userData.ID).then((response) => {
        setListCustomers(response);
      });
    } else if (userData.Roles == "Supervisor") {
      requests.getCustomersSupervisor(userData.ID).then((response) => {
        setListCustomers(response);
      });
    } else {
      requests.getCustomers().then((response) => {
        setListCustomers(response);
      });
    }
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: listCustomers
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
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Correo Electronico
        </div>
      ),
      renderCell: (item) => <p className="font-normal ">{item.Correo}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Telefono
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Telefono}</p>
      ),
      ...((userData.Roles == "Vendedor Comisionista" ||
        userData.Roles == "Vendedor con Sueldo + Comisión") && {
        resize: true,
      }),
    },
    ...(userData.Roles == "Vendedor Comisionista" ||
    userData.Roles == "Vendedor con Sueldo + Comisión"
      ? [
          {
            label: (
              <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
                Acciones
              </div>
            ),
            renderCell: (item) => (
              <div className="font-bold capitalize flex justify-center items-center">
                <Tooltip content="Editar">
                  <Button
                    variant="soft"
                    color="lime"
                    onClick={() =>
                      navigate(`/Layout/Customers/Update/${item.ID}`)
                    }
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
          <Link to="/Layout">Panel de Control</Link> / <b>Clientes</b>
        </p>
        <p className="text-lg font-bold">Clientes</p>
      </div>
      <div className="line-row" />

      <div className="max-w-[1280px] flex justify-between  gap-2 mr-5">
        {(userData.Roles == "Vendedor Comisionista" ||
          userData.Roles == "Vendedor con Sueldo + Comisión") && (
          <Link to="/Layout/Customers/Add" className={`${GlobalStyles.btnAdd}`}>
            <p className="text-sm">Nuevo Cliente</p>
            <span>
              <GoPlus size={24} />
            </span>
          </Link>
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

export default Customers;
