import { RiCloseFill } from "react-icons/ri";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useState } from "react";
import { useEffect } from "react";
import requests from "./requests";
import { TbFileTypePdf, TbFileTypeXml, TbSearch } from "react-icons/tb";
import { Button, Tooltip } from "@radix-ui/themes";

const ModelDocuments = ({ UID, close }) => {
  const [search, setSearch] = useState("");
  const [paymentsList, setPaymentsList] = useState([]);

  useEffect(() => {
    requests.getRelatedDocumentsByFacturaUID(UID).then((response) => {
      setPaymentsList(response.data);
      console.log(response.data);
    });
  }, []);

  const downloadBase64File = (base64Data, fileName, mimeType) => {
    const linkSource = `data:${mimeType};base64,${base64Data}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
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

  const data = {
    nodes: paymentsList
      .filter((item) => item.Folio.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.UID })),
  };

  const handleDownloadPDFClick = async (ID, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "pdf");

    if (response) {
      downloadBase64File(response, `${folio}.pdf`, "application/pdf");
    } else {
      console.error("No se recibió un archivo PDF válido.");
    }
  };

  const handleDownloadXMLClick = async (ID, folio) => {
    const response = await requests.getInvoiceDocumentDownload(ID, "xml");

    if (response) {
      downloadBase64File(response, `${folio}.xml`, "text/xml");
    } else {
      console.error("No se recibió un archivo XML válido.");
    }
  };

  const COLUMNS = [
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
    },
  ];

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-3 max-w-[900px] min-w-[600px]">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold">Ver Documentos.</p>
            <span
              className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
              onClick={close}
            >
              <RiCloseFill size={24} />
            </span>
          </div>
          <div className="line-row" />
          {data.nodes.length > 0 ? (
            <div className="table-Scroll relative bg-white mr-5 mb-2  rounded-md overflow-hidden border border-zinc-300 max-h-[520px] overflow-y-scroll">
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
      </div>
    </div>
  );
};

export default ModelDocuments;
