import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import { GoPlus } from "react-icons/go";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const PettyCash = () => {
  const [registersList, setRegistersList] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    requests.getRegisters().then((response) => {
      setRegistersList(response);
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

  const data = {
    nodes: registersList
      .filter((item) =>
        item.NoFactura.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })), // Asegurar que hay una propiedad id única
  };

  const columns = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Numero de Factura
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.NoFactura}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Motivo
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Motivo}</p>
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
          Entregado por:
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Entregado}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          $ {item.Cantidad.toLocaleString("en-US")}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          $ {item.Total.toLocaleString("en-US")}
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
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          {item.NoFactura != "Ingreso" && (
            <Tooltip content="Editar">
              <Button
                variant="soft"
                color="lime"
                onClick={() => navigate(`/Layout/Pettycash/Update/${item.ID}`)}
              >
                <TbEdit size={24} />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Caja Chica</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Caja Chica</p>
      </div>

      <div className="line-row" />

      <div className="flex gap-2">
        <Link
          to="/Layout/PettyCash/AddCheck"
          className={`${GlobalStyles.btnAdd}`}
        >
          <p className="text-sm">Nuevo Cheque</p>
          <span>
            <GoPlus size={24} />
          </span>
        </Link>
        <Link
          to="/Layout/PettyCash/AddRegister"
          className={`${GlobalStyles.btnAdd}`}
        >
          <p className="text-sm">Nuevo Registro</p>
          <span>
            <GoPlus size={24} />
          </span>
        </Link>
      </div>

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
      <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
        <CompactTable
          columns={columns}
          data={data}
          theme={theme}
          layout={{ fixedHeader: true }}
        />
      </div>
    </div>
  );
};

export default PettyCash;
