import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { AiOutlineFileText } from "react-icons/ai";
import requests from "./requests";

const InsertDocument = ({ movementInventoryID, onClose }) => {
  const [formValues, setFormValues] = useState({
    tipoArchivo: "",
    folio: "",
    proveedor: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileBase64, setFileBase64] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Guardar nombre sin extensión
    const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
    setSelectedFile(nameWithoutExt);

    // Convertir a base64
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result.split(",")[1];
      setFileBase64(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const object = {
      ID: movementInventoryID,
      DocumentoRespaldo: {
        TipoDocumento: formValues.tipoArchivo || "",
        Folio: formValues.folio || "",
        ProveedorCliente: formValues.proveedor || "",
        Documento: fileBase64 || "",
      },
    };

    console.log(object);

    const response = await requests.insertDocument(object);

    console.log(response);

    if (response.Success) {
      onClose();
    } else {
      setErrorMessage(response.Mensaje);
    }
    // Aquí iría la petición al backend con `object`
  };

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-4 justify-center w-[600px]">
        {/* Header */}
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center">
            Insertar Documento
          </p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer  hover:bg-red-500 hover:text-white"
            onClick={() => onClose()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />

        {/* Formulario */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Input folio */}
          <label
            className="inputs-placeholder w-full relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
            data-text="Folio"
          >
            <input
              className="w-full outline-none resize-none"
              type="text"
              name="folio"
              value={formValues.folio}
              onChange={handleInputChange}
            />
          </label>

          {/* Input proveedor */}
          <label
            className="inputs-placeholder w-full relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
            data-text="Proveedor / Cliente"
          >
            <input
              className="w-full outline-none resize-none"
              type="text"
              name="proveedor"
              value={formValues.proveedor}
              onChange={handleInputChange}
            />
          </label>

          {/* Select tipo de archivo */}
          <label className="inputs-placeholder w-full relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm">
            <select
              className="w-full outline-none resize-none border-2 border-white"
              name="tipoArchivo"
              value={formValues.tipoArchivo}
              onChange={handleInputChange}
            >
              <option value="">Selecciona el tipo de Archivo</option>
              <option value="Factura">Factura</option>
              <option value="Remisión">Remisión</option>
              <option value="Vale">Vale</option>
              <option value="Otro">Otro</option>
            </select>
            <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
              <AiOutlineFileText size="20" />
            </span>
          </label>

          {/* Input archivo */}
          <label className="inputs-placeholder w-full relative h-14 flex justify-center items-center gap-2 p-2 border-2 border-sovetec-primary border-dashed rounded-sm cursor-pointer hover:bg-zinc-100">
            <input
              className="hidden"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <span className="min-w-10 min-h-10 flex justify-center items-center rounded-sm text-sovetec-primary">
              <AiOutlineFileText size={24} />
            </span>
            {selectedFile ? (
              <p className="text-sm text-zinc-700">{selectedFile}</p>
            ) : (
              <p className="text-sm text-zinc-500">Sube un archivo PDF</p>
            )}
          </label>

          {/* Botón enviar */}
          <button
            type="submit"
            className="self-end border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
          >
            Guardar Documento
          </button>
          {errorMessage && (
            <p className="text-red-500 text-xs text-right">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default InsertDocument;
