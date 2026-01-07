import { ErrorMessage, Form, Formik } from "formik";
import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { TbFileTypePdf, TbTrash } from "react-icons/tb";
import requests from "./requests";

const UploadFiles = ({ taskID, close }) => {
  const [files, setFiles] = useState([]);

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    for (const file of selectedFiles) {
      const base64 = await convertToBase64(file);
      const fileData = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        Nombre: file.name.replace(/\.pdf$/i, ""),
        Archivo: base64,
      };

      setFiles((prev) => [...prev, fileData]);
    }

    // Limpiar el input para permitir subir el mismo archivo de nuevo si se desea
    event.target.value = "";
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleUploadXMLClick = async (values, { setSubmitting }) => {
    try {
      const object = { Archivos: files, TareasID: taskID };

      const response = await requests.addFilesTasks(object);

      if (response) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Subir Archivos</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />

        <Formik
          initialValues={{
            pdf: "",
          }}
          onSubmit={handleUploadXMLClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div className="w-full">
                <label className="w-76 border border-zinc-300 border-dashed flex p-2 rounded-md items-center gap-2 hover:bg-zinc-200 cursor-pointer">
                  <input
                    name="pdf"
                    className="hidden"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbFileTypePdf size="20" />
                  </span>
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
                    Selecciona archivos PDF
                  </p>
                </label>
                <ErrorMessage
                  name="pdf"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              {files.length > 0 && (
                <div className="w-full max-h-20 overflow-y-scroll text-sm p-1 border border-dashed border-zinc-300 rounded flex flex-col gap-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-zinc-100 flex justify-between items-center p-2 rounded"
                    >
                      <span className="truncate max-w-[200px]">
                        {file.Nombre}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        <TbTrash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Subir archivos
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadFiles;
