import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import requests from "./requests";
import { TbFileTypePdf, TbFileTypeXml, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const PaidAddons = () => {
  const { ID } = useParams();
  const [paidAddonsList, setPaidAddons] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    requests.getPaidAddons(ID).then((response) => {
      setPaidAddons(response);
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
    nodes: paidAddonsList
      .filter((item) =>
        item.MetodoPago.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const handleDownloadPDFClick = async (ID) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "PDF");

    if (response) {
      downloadBase64File(response, "archivo.pdf", "application/pdf");
    } else {
      console.error("No se recibió un archivo PDF válido.");
    }
  };

  const handleDownloadXMLClick = async (ID) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "XML");

    if (response) {
      downloadBase64File(response, "archivo.xml", "text/xml");
    } else {
      console.error("No se recibió un archivo XML válido.");
    }
  };

  const downloadBase64File = (base64Data, fileName, mimeType) => {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
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
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha Programada
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaProgramada}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Metodo de Pago
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.MetodoPago}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Total M.N.
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          {item.TotalMN == 0 ? (
            <>0</>
          ) : (
            <>$ {item.TotalMN.toLocaleString("en-US")} MXN</>
          )}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Total USD
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">
          {item.TotalUSD == 0 ? (
            <>0</>
          ) : (
            <>$ {item.TotalUSD.toLocaleString("en-US")} MXN</>
          )}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          PDF
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Descargar PDF">
            <Button
              variant="soft"
              color="lime"
              onClick={() => handleDownloadPDFClick(item.ID)}
            >
              <TbFileTypePdf size={24} />
            </Button>
          </Tooltip>
          <Tooltip content="Descargar XML">
            <Button
              variant="soft"
              color="lime"
              onClick={() => handleDownloadXMLClick(item.ID)}
            >
              <TbFileTypeXml size={24} />
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
          <Link to="/Layout/InvoicesPendingIssue">
            Facturas Pendientes de Emisión
          </Link>{" "}
          / <b>Complementos de Pago</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Complementos de Pago</p>
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
            <p className="text-xl">Sin Complementos de Pago</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaidAddons;
