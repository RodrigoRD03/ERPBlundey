import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const VendorTarget = () => {
  const [listTargets, setListTargets] = useState([]);
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
    requests.getVendorsInfo(userData.ID).then((response) => {
      setListTargets(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: listTargets
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
        <p className="font-normal text-sm  capitalize">{item.NombreCompleto}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Meta de Venta
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm  capitalize">
          $ {item.MetaVentas.toLocaleString("en-US")}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Porcentaje de Comisión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm  capitalize">
          {item.PorcentajeComision}%
        </p>
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
          <Tooltip content="Eliminar">
            <Button
              variant="soft"
              color="green"
              onClick={() => navigate(`/Layout/VendorTarget/Update/${item.ID}`)}
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
          <b>Metas de Vendedores</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Metas de Vendedores</p>
      </div>
      <div className="line-row" />
      <Link to="/Layout/VendorTarget/Add" className={`${GlobalStyles.btnAdd}`}>
        <p className="text-sm">Nueva Meta</p>
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
      {data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl  rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <div className="">
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
    </div>
  );
};

export default VendorTarget;
