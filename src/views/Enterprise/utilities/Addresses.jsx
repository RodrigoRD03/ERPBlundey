import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import GlobalStyles from "../../../globalStyles";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbPlus, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const Addresses = () => {
  const { enterpriseID } = useParams();
  const [addressesList, setAddressesList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  let data = addressesList;

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
    requests.getAddresses(enterpriseID).then((response) => {
      setAddressesList(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: addressesList
      .filter((item) =>
        item.Direccion.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          #
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Consecutivo}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Direccion
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Direccion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Codigo Postal
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.CodigoPostal}</p>
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
        <div className="font-bold capitalize flex justify-center items-center">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() =>
                navigate(`/Layout/Enterprises/UpdateAddress/${item.ID}`)
              }
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
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Enterprises">Empresas</Link> / <b>Direcciones</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Direcciones</p>
        <div className="line-row" />
        <Link
          to={`/Layout/Enterprises/AddAddress/${enterpriseID}`}
          className={`${GlobalStyles.btnAdd}`}
        >
          <p className="text-sm font-bold">Nueva Dirección</p>
          <span>
            <TbPlus size={24} />
          </span>
        </Link>

        {addressesList.length > 0 ? (
          <>
            <label
              htmlFor="search"
              className=" w-64 flex items-center bg-white border-2 border-zinc-200 rounded-full"
            >
              <input
                className="h-10 rounded-md py-2 px-3 outline-none"
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
              <div className="">
                <CompactTable
                  columns={COLUMNS}
                  data={data}
                  theme={theme}
                  layout={{ fixedHeader: true }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
            <div className="flex flex-col justify-center items-center">
              <span>
                <TbSearch size={24} />
              </span>
              <p className="text-xl">Sin Direcciones</p>
              <p className="text-sm">(Agrege una dirección.)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
