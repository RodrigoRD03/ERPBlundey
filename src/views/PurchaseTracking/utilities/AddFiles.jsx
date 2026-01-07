import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { TbPaperclip, TbPlus, TbTrash } from "react-icons/tb";
import requests from "./requests";
import { Spinner, Tooltip } from "@radix-ui/themes";

const AddFiles = ({ purchaseID, close }) => {
  const [files, setFiles] = useState([]);
  const [fileName, setFileName] = useState("Seleccionar un archivo");
  const [fileBase64, setFileBase64] = useState("");
  const [loader, setLoader] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
        setFileName(nameWithoutExt);
        setFileBase64(base64String);
        setFieldValue("file", ""); // Limpiar el input
      };
    }
  };

  const handleAddFileSubmit = () => {
    setErrorMessage(null);
    if (fileName !== "Seleccionar un archivo" && fileBase64) {
      setFiles((prevFiles) => [
        ...prevFiles,
        { Nombre: fileName, Archivo: fileBase64 },
      ]);
      setFileName("Seleccionar un archivo");
      setFileBase64("");
    }
  };

  const handleDeleteFileClick = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleAddFilesClick = async () => {
    if (files.length == 0) {
      setErrorMessage("Añada Archivos a la lista.");
      return;
    }
    setErrorMessage(null);
    setLoader(true);
    const response = await requests.addInsertFiles(purchaseID, files);
    response && window.location.reload();
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Anexar Archivos</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <Formik initialValues={{ file: "" }} onSubmit={handleAddFileSubmit}>
          {({ setFieldValue }) => (
            <Form className="mt-2 flex gap-5 items-center">
              <div>
                <label className="w-76 border border-zinc-300 border-dashed flex p-2 rounded-md items-center gap-2 hover:bg-zinc-200 cursor-pointer">
                  <input
                    name="file"
                    className="hidden"
                    type="file"
                    accept=".pdf"
                    onChange={(event) => handleFileUpload(event, setFieldValue)}
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbPaperclip size="20" />
                  </span>
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
                    {fileName}
                  </p>
                </label>
                <ErrorMessage
                  name="file"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <Tooltip content="Agregar Archivo">
                <button
                  type="submit"
                  className="self-end size-14 border-2 border-sovetec-primary flex justify-center items-center text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  <TbPlus size={24} />
                </button>
              </Tooltip>
            </Form>
          )}
        </Formik>
        {files.length > 0 && (
          <table className=" border-zinc-500 text-center w-96 border-collapse overflow-hidden">
            <thead>
              <tr className="border ">
                <th className="bg-sovetec-primary text-white text-sm p-1.5 w-[200px]">
                  Nombre.
                </th>
                <th className="bg-sovetec-primary text-white text-sm p-1.5">
                  Eliminar
                </th>
              </tr>
            </thead>
            <tbody>
              {files.map((item, index) => (
                <tr key={index} className="text-sm border ">
                  <td className="p-1 py-3 text-sm">
                    <p>{item.Nombre}</p>
                  </td>
                  <td className="p-1 py-3">
                    <span className="flex w-full h-full justify-center items-center text-red-500">
                      <TbTrash
                        size={22}
                        className="cursor-pointer"
                        onClick={() => handleDeleteFileClick(index)}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {errorMessage && (
          <p className="w-full text-right text-sm text-red-600">
            {errorMessage}
          </p>
        )}
        <div className="line-row" />
        <button
          type="submit"
          className="flex justify-center items-center self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
          onClick={() => handleAddFilesClick()}
        >
          {!loader ? "Enviar Correo" : <Spinner size={3} />}
        </button>
      </div>
    </div>
  );
};

export default AddFiles;
