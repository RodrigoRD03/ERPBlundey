import { Link, useNavigate } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { TbEye, TbPlus, TbSearch } from "react-icons/tb";
import { Button } from "@radix-ui/themes";
import ViewReferrals from "../ReferralsHistory/utilities/ViewReferrals";

const Referrals = () => {
  const [listPendingSales, setListPendingSales] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [viewReferrals, setViewReferrals] = useState(null);
  let data = listPendingSales;

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
    requests.getPendingFerralsSales().then((response) => {
      setListPendingSales(response);
      console.log(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: listPendingSales
      .filter((item) =>
        item.VersionCotizacion.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Version de Cotización
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.VersionCotizacion}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Orden de Compra
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.ClienteOrdenCompra}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Fecha de Act.
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.FechaActualizacion}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          $ {item.Subtotal.toLocaleString("en-US")}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Ver
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Button
            variant="soft"
            color="lime"
            onClick={() => setViewReferrals(item.ID)}
          >
            <TbEye size={24} /> Ver Remisiones
          </Button>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Añadir
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Button
            variant="soft"
            color="amber"
            onClick={() => navigate(`/Layout/Referrals/Insert/${item.ID}`)}
          >
            <TbPlus size={24} /> Añadir Remisión
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Remisiones</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Remisiones</p>
      </div>
      <div className="line-row" />
      <div className="max-w-full flex justify-between  gap-2 mr-5">
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
      {viewReferrals && (
        <ViewReferrals
          id={viewReferrals}
          close={() => setViewReferrals(null)}
        />
      )}
    </div>
  );
};

export default Referrals;
