import requests from "./requests";
import { GoPlus } from "react-icons/go";
import { RiCloseFill } from "react-icons/ri";
import GlobalStyles from "../../../globalStyles";
import { useEffect, useState } from "react";
import { ErrorMessage } from "formik";
import {
  TbPaperclip,
  TbPdf,
  TbSearch,
  TbTrash,
  TbUpload,
} from "react-icons/tb";
import { Button } from "@radix-ui/themes";
import ViewPDF from "../../ViewPDF/ViewPDF";
7;

const Files = ({ quoteID, close }) => {
  const [listFiles, setListFiles] = useState([]);
  const [fileName, setFileName] = useState("Seleccionar un archivo");
  const [fileBase64, setFileBase64] = useState("");
  const [viewPdf, setViewPdf] = useState(null);
  const [nameSelectedFile, setNameSelectedFile] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [base, setBase] = useState("");

  useEffect(() => {
    requests.getFilesList(quoteID).then((response) => {
      setListFiles(response);
    });
  }, []);

  const reloadList = () => {
    requests.getFilesList(quoteID).then((response) => {
      setListFiles(response);
    });
  };

  const handleFileUpload = (event) => {
    const file = event.currentTarget.files[0];
    if (file && file.type === "application/pdf") {
      setErrorMessage(null);
      if (file.size === 0) {
        setErrorMessage("No se puede subir un archivo vacío.");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
        setFileName(nameWithoutExt);
        setFileBase64(base64String);
      };
    }
  };

  const handleUploadFileClick = async () => {
    if (!fileBase64) {
      setErrorMessage("Por favor selecciona un archivo válido antes de subir.");
      return;
    }
    setErrorMessage(null);

    const response = await requests.uploadFile({
      Descripcion: fileName,
      Archivo: fileBase64,
      CotizacionID: quoteID,
    });

    if (response) {
      setFileName("Seleccionar un archivo");
      setFileBase64(""); // Limpia base64 tras subida
      reloadList();
    }
  };

  const handleDeleteFileClick = async (ID) => {
    const response = await requests.deleteFile(ID);
    if (response) {
      reloadList();
    }
  };

  const handleGetBasePdfClick = async (ID, description) => {
    setNameSelectedFile(description);
    const response = await requests.viewFileComplete(ID);
    setBase(response);
    setViewPdf(true);
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Archivos</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="flex gap-3">
          <label className="w-76 border border-zinc-300 border-dashed flex p-2 rounded-md items-center gap-2 hover:bg-zinc-200 cursor-pointer">
            <input
              name="file"
              className="hidden"
              type="file"
              accept=".pdf"
              onChange={(event) => handleFileUpload(event)}
            />
            <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
              <TbPaperclip size="20" />
            </span>
            <p className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
              {fileName}
            </p>
          </label>
          <button
            className="size-14 bg-sovetec-fourty flex justify-center items-center rounded-sm text-white hover:bg-sovetec-primary"
            onClick={() => handleUploadFileClick()}
          >
            <TbUpload size={20} />
          </button>
        </div>
        {errorMessage && (
          <div className="text-red-500 text-xs text-right m-0">
            {errorMessage}
          </div>
        )}
        {listFiles.length != 0 ? (
          <table className=" border-zinc-500 text-center min-w-full border-collapse overflow-hidden">
            <thead>
              <tr className="border border-zinc-300">
                <th className="bg-sovetec-primary text-white text-sm p-1.5 w-96">
                  Descripción
                </th>
                <th className="bg-sovetec-primary text-white text-sm p-1.5">
                  Ver
                </th>
                <th className="bg-sovetec-primary text-white text-sm p-1.5">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {listFiles.map((item, index) => (
                <tr key={index} className="border border-zinc-300">
                  <td className="w-96">
                    <p className="font-normal text-sm w-full">
                      {item.Descripcion}
                    </p>
                  </td>
                  <td className="py-2 px-4">
                    <Button color="yellow" variant="soft">
                      <TbPdf
                        size={22}
                        className="cursor-pointer"
                        onClick={() =>
                          handleGetBasePdfClick(item.ID, item.Descripcion)
                        }
                      />
                    </Button>
                  </td>
                  <td className="py-2 px-4">
                    <Button color="red" variant="soft">
                      <TbTrash
                        size={22}
                        className="cursor-pointer"
                        onClick={() => handleDeleteFileClick(item.ID)}
                      />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="w-full flex flex-col justify-center items-center">
            <span>
              <TbSearch size={20} />
            </span>
            <p>Aun no hay archivos</p>
          </div>
        )}
      </div>

      {viewPdf && (
        <ViewPDF
          base={base}
          version={nameSelectedFile}
          close={() => setViewPdf(null)}
        />
      )}
    </div>
  );
};

export default Files;
