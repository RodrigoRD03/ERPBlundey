import { useState, useEffect } from "react";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@radix-ui/themes";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbArrowRight, TbSearch } from "react-icons/tb";

const NewQuote = () => {
  const [listCustomers, setListCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [validate, setValidate] = useState(false);
  const navigate = useNavigate();
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

  const { userData } = useUser();

  useEffect(() => {
    requests.getCustomersSeller(userData.ID).then((response) => {
      setListCustomers(response);
    });
    requests.getUserValidate(userData.ID).then((response) => {
      setValidate(response);
    });
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

  const handleGetCustomerDataClick = async (customerID) => {
    try {
      const response = await requests.getCustomer(customerID);
      navigate(
        `/Layout/NewQuote/Addresses/${response.EmpresaID}/${customerID}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
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
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Empresa}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Correo Electronico
        </div>
      ),
      renderCell: (item) => <p className="font-normal ">{item.Correo}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Telefono
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Telefono}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary  h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="flex justify-center items-center">
          {validate ? (
            <Button
              variant="soft"
              color="lime"
              onClick={() => handleGetCustomerDataClick(item.ID)}
            >
              <p>Empezar Cotización</p> <TbArrowRight size={24} />
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-sm text-red-400">
                Aun no tienes una meta registrada
              </p>
              <p className="text-xs text-red-400">
                Pidele a tu supervisor que te registre una meta para poder
                cotizar
              </p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Nueva Cotización</b>
        </p>
        <p className="text-lg font-bold">Nueva Cotización</p>
        <div className="line-row" />
      </div>
      <label
        htmlFor="search"
        className="w-max flex justify-between px-2  items-center bg-white border-2 border-zinc-200 rounded-full"
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
      <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
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

export default NewQuote;
