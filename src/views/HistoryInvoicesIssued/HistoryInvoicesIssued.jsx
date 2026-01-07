import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import requests from "./utilities/requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbFileTypePdf, TbFileTypeXml, TbSearch } from "react-icons/tb";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import es from "date-fns/locale/es";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import ViewPDF from "../ViewPDF/ViewPDF";
import { MdOutlineCancel } from "react-icons/md";
import CancelIssueAPI from "./utilities/CancelIssueAPI";
import CancelIssue from "./utilities/CancelIssue";
import { FiMinusCircle } from "react-icons/fi";

const HistoryInvoicesIssued = () => {
  const [viewCalendar, setViewCalendar] = useState(false);
  const [invoicesList, setInvoicesList] = useState([]);
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
  });
  const [viewPdf, setViewPdf] = useState(null);
  const [cancelIssueAPIVisible, setCancelIssueAPIVisible] = useState(null);
  const [cancelIssueVisible, setCancelIssueVisible] = useState(null);

  useEffect(() => {
    requests.getInvoicesIssued().then((response) => {
      console.log(response.data);

      setInvoicesList(response.data);
    });
  }, []);

  const handleReloadListClick = async () => {
    const response = await requests.getInvoicesIssued();
    setInvoicesList(response.data);
  };

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
        item?.Folio?.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const handleDownloadPDFClick = async (ID, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "pdf");

    if (response) {
      downloadBase64File(response, `${folio}.pdf`, "application/pdf");
    } else {
      console.error("No se recibió un archivo PDF válido.");
    }
  };

  const handleViewPDFClick = async (ID, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "pdf");
    setViewPdf(response);
  };

  const handleDownloadXMLClick = async (ID, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "xml");

    if (response) {
      downloadBase64File(response, `${folio}.xml`, "text/xml");
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
          Tipo de CFDI
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.TipoComprobante}</p>
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
          Versión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.Version}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Orden
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.NumOrder}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cliente
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.RazonSocialReceptor}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm">{item.FechaTimbrado}</p>
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
          Estatus
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Status}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cancelar
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          {item.Status === "Pendiente Cancelar" ? (
            <Tooltip content="Cancelar Factura">
              <Button
                variant="soft"
                color="red"
                onClick={() => setCancelIssueAPIVisible(item.UID)}
              >
                <MdOutlineCancel size={24} />
              </Button>
            </Tooltip>
          ) : item.Status === "Creada" ? (
            <Tooltip content="Cancelar Factura">
              <Button
                variant="soft"
                color="orange"
                onClick={() => setCancelIssueVisible(item.UID)}
              >
                <FiMinusCircle size={24} />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip content="Descargar Acuse">
              <Button
                variant="soft"
                color="pink"
                onClick={() => handleDownloadXMLClick(item.UID, item.Folio)}
              >
                <TbFileTypeXml size={24} />
              </Button>
            </Tooltip>
          )}
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Descargar
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Descargar PDF">
            <Button
              variant="soft"
              color="purple"
              onClick={() => handleDownloadPDFClick(item.UID, item.Folio)}
            >
              <TbFileTypePdf size={24} />
            </Button>
          </Tooltip>
          <Tooltip content="Descargar PDF">
            <Button
              variant="soft"
              color="amber"
              onClick={() => handleDownloadXMLClick(item.UID, item.Folio)}
            >
              <TbFileTypeXml size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Ver PDF
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Descargar PDF">
            <Button
              variant="soft"
              color="cyan"
              onClick={() => handleViewPDFClick(item.UID, item.Folio)}
            >
              <TbFileTypePdf size={24} />
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
          <b>Historial de Facturas Emitidas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">
          Historial de Facturas Emitidas
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
      {viewPdf && (
        <ViewPDF base={viewPdf} version="dw" close={() => setViewPdf(null)} />
      )}
      {cancelIssueAPIVisible && (
        <CancelIssueAPI
          UID={cancelIssueAPIVisible}
          reload={handleReloadListClick}
          close={() => setCancelIssueAPIVisible(null)}
        />
      )}
      {cancelIssueVisible && (
        <CancelIssue
          UID={cancelIssueVisible}
          reload={() => handleReloadListClick()}
          close={() => setCancelIssueVisible(null)}
        />
      )}
    </div>
  );
};

export default HistoryInvoicesIssued;
