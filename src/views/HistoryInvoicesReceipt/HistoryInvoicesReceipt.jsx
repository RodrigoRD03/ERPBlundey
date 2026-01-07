import { Button, Tooltip } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";
import { TbFileTypePdf, TbFileTypeXml, TbSearch } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";

import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import es from "date-fns/locale/es";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import requests from "./utilities/requests";

const HistoryInvoicesReceipt = () => {
  const [viewCalendar, setViewCalendar] = useState(false);
  const [invoicesList, setInvoicesList] = useState([]);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });
  const navigate = useNavigate();

  useEffect(() => {
    requests.getInvoicesReceipt().then((response) => {
      setInvoicesList(response);
      console.log(response);
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
    nodes: invoicesList
      .filter((item) =>
        item.Proveedor.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })), // Asegurar que hay una propiedad id única
  };

  const handleDownloadPDFClick = async (ID, serie, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "PDF");

    if (response) {
      downloadBase64File(response, ".pdf", "application/pdf", serie, folio);
    } else {
      console.error("No se recibió un archivo PDF válido.");
    }
  };

  const handleDownloadXMLClick = async (ID, serie, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "XML");

    if (response) {
      downloadBase64File(response, ".xml", "text/xml", serie, folio);
    } else {
      console.error("No se recibió un archivo XML válido.");
    }
  };

  const downloadBase64File = (base64Data, fileName, mimeType, serie, folio) => {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `${serie} ${folio}${fileName}`;
    downloadLink.click();
  };

  const formatDateUI = (date) => {
    return date.toLocaleDateString("es-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const handleSelect = (ranges) => {
    setDateRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const fetchDataWithDateRange = async () => {
    setViewCalendar(false);
    const object = {
      Inicio: formatDate(dateRange.startDate),
      Final: formatDate(dateRange.endDate),
    };
    const response = await requests.getRange(object);
    setInvoicesList(response);
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Folio Fiscal
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.FolioFiscal}>
          <p className="font-normal text-sm">{item.FolioFiscal}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Identificacion de O.C.
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.IdentificadorOrdenCompra}>
          <p className="font-normal text-sm">{item.IdentificadorOrdenCompra}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Folio
        </div>
      ),
      renderCell: (item) => <p className="font-normal text-sm">{item.Folio}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Proveedor}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha de Creación
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaCreacion}</p>
      ),
      resize: true,
    },
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
          Moneda
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Moneda}</p>
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
          {item.TotalMN != "0"
            ? `$ ${item.TotalMN.toLocaleString("en-US")}`
            : item.TotalUSD != "0"
            ? `$ ${item.TotalUSD.toLocaleString("en-US")}`
            : ""}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Factura
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          {item.PDF == "1" && (
            <Tooltip content="Descargar PDF">
              <Button
                variant="soft"
                color="amber"
                onClick={() =>
                  handleDownloadPDFClick(item.ID, item.Serie, item.Folio)
                }
              >
                <TbFileTypePdf size={24} />
              </Button>
            </Tooltip>
          )}
          {item.XML == "1" && (
            <Tooltip content="Descargar XML">
              <Button
                variant="soft"
                color="lime"
                onClick={() =>
                  handleDownloadXMLClick(item.ID, item.Serie, item.Folio)
                }
              >
                <TbFileTypeXml size={24} />
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
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <b>Historial de Facturas Recibidas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">
          Historial de Facturas Recibidas
        </p>
      </div>
      <div className="line-row" />
      <div className="flex justify-between items-center">
        <label className="flex items-center bg-white border-2 border-zinc-200 rounded-full px-2">
          <input
            className="h-10 rounded-md py-2 outline-none"
            type="text"
            placeholder="Buscar en la tabla"
            value={search}
            onChange={handleSearch}
          />
          <span className="text-zinc-500">
            <TbSearch size={24} />
          </span>
        </label>
        <div className="relative h-11 flex gap-5">
          <div className="flex bg-white px-5 rounded-sm">
            <div
              className="flex items-center gap-2 px-2 rounded-md text-sm cursor-pointer"
              onClick={() => setViewCalendar(!viewCalendar)}
            >
              Fechas:{" "}
              <b>
                {formatDateUI(dateRange.startDate)} -{" "}
                {formatDateUI(dateRange.endDate)}
              </b>
            </div>
            <div
              className={`absolute z-10 right-72 top-10 shadow-md ${
                viewCalendar ? "flex" : "hidden"
              }`}
            >
              <DateRangePicker
                ranges={[{ ...dateRange, key: "selection" }]}
                onChange={handleSelect}
                locale={es}
              />
            </div>
            <button
              onClick={fetchDataWithDateRange}
              className="size-9 m-auto flex justify-center items-center rounded-full hover:bg-zinc-100"
            >
              <TbSearch className="text-zinc-500" size={24} />
            </button>
          </div>
        </div>
      </div>
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

export default HistoryInvoicesReceipt;
