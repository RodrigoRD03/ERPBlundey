import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import requests from "./requests";
import { GoPlus } from "react-icons/go";
import GlobalStyles from "../../../globalStyles";
import UploadFile from "./UploadFile";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbEdit, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";
import { useUser } from "../../../Contexts/UserContext";

const TaxDataComplete = () => {
  const { enterpriseID } = useParams();
  const [taxData, setTaxData] = useState([]);
  const [uploadFile, setUploadFile] = useState(null);
  const [search, setSearch] = useState("");
  const [taxDataID, setTaxDataID] = useState(0);
  const [type, setType] = useState(false);
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
    requests.getTaxData(enterpriseID).then((response) => {
      setTaxData(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const data = {
    nodes: taxData
      .filter((item) => item.RFC.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          RFC
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.ID}</p>,
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
          Codigo Postal
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.CodigoPostal}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Razón Social
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.DenominacionRazonSocial}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Tipo
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={`Persona ${item.TipoPersona}`}>
          <p className="font-normal text-sm">Persona {item.TipoPersona}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Estatus Padron
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.EstatusPadron}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Ult. Fecha de Actualización
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaActualizacion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Regimen Fiscal
        </div>
      ),
      renderCell: (item) => (
        <Tooltip
          content={`${item.NumeroRegimenFiscal} - ${item.RegimenFiscal}`}
        >
          <p className="font-normal text-sm">
            {item.NumeroRegimenFiscal} - {item.RegimenFiscal}
          </p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          IdCIF
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.idCIF}</p>,
      ...(userData.Roles === "Finanzas" && { resize: true }),
    },
    ...(userData.Roles == "Finanzas"
      ? [
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
                    onClick={() => {
                      setUploadFile(true), setType(true), setTaxDataID(item.ID);
                    }}
                  >
                    <TbEdit size="20" />
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
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/TaxDataCustomers">Datos Fiscales Clientes</Link> /{" "}
          <b>Ver Datos Fiscales</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Ver Datos Fiscales</p>
      </div>
      <div className="line-row" />
      {taxData.length == 0 && (
        <>
          <button
            onClick={() => setUploadFile(true)}
            className={`${GlobalStyles.btnAdd}`}
          >
            <p className="text-sm">Añadir Datos Fiscales</p>
            <span>
              <GoPlus size={24} />
            </span>
          </button>
        </>
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
            <p className="text-xl">Aun hay datos fiscales, registralo.</p>
          </div>
        </div>
      )}
      {uploadFile && (
        <UploadFile
          enterpriseID={enterpriseID}
          update={type}
          taxDataID={taxDataID}
          close={() => setUploadFile(null)}
        />
      )}
    </div>
  );
};

export default TaxDataComplete;
