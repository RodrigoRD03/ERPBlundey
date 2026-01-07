import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const Retreats = () => {
  const [listNational, setListNational] = useState([]);
  const [listDollar, setListDollar] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    requests.getRetreatsNational().then((response) => {
      setListNational(response);
    });
    requests.getRetreatsDolar().then((response) => {
      setListDollar(response);
    });
  }, []);

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

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const columns = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Banco
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.Banco}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Número de Cuenta
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.NumeroCuenta}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Documento
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Documento}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Concepto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Concepto}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Observaciones
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Observaciones}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.Fecha}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Abono
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          ${item.Abono.toLocaleString("en-US")} {item.Moneda || "MXN"}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Editar
        </div>
      ),
      renderCell: (item) => (
        <div className="font-normal flex justify-center items-center">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="lime"
              onClick={() =>
                navigate(`/Layout/Retreats/Update/${item.ID}/${item.Tipo}`)
              }
            >
              <TbEdit size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const dataNational = {
    nodes: listNational
      .filter((item) => item.Banco.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({
        ...item,
        id: item.ID,
        Moneda: "MXN",
        Tipo: "Nacional",
      })),
  };

  const dataDollar = {
    nodes: listDollar
      .filter((item) => item.Banco.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.ID, Moneda: "USD", Tipo: "Dolar" })),
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Retiros</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Retiros</p>
      </div>

      <div className="line-row" />

      <Link to="/Layout/Retreats/Add" className={`${GlobalStyles.btnAdd}`}>
        <p className="text-sm">Nuevo Retiro</p>
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

      {/* Tabla Nacional */}
      <p className="text-lg font-bold tracking-wide mt-2">Retiros Nacionales</p>
      {dataNational.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <CompactTable
            columns={columns}
            data={dataNational}
            theme={theme}
            layout={{ fixedHeader: true }}
          />
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center">
            <span>
              <TbSearch size={30} />
            </span>
            <p className="text-xl">Sin resultados nacionales</p>
          </div>
        </div>
      )}

      {/* Tabla Dólares */}
      <p className="text-lg font-bold tracking-wide ">Retiros en Dólares</p>
      {dataDollar.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <CompactTable
            columns={columns}
            data={dataDollar}
            theme={theme}
            layout={{ fixedHeader: true }}
          />
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center">
            <span>
              <TbSearch size={30} />
            </span>
            <p className="text-xl">Sin resultados en dólares</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retreats;
