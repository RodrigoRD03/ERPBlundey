import React, { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";

export default function SubirPdfModal({ id, close, reload }) {
  const [pdfBase64, setPdfBase64] = useState("");
  const [fileName, setFileName] = useState("");

  // Convierte el PDF a base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Por favor, selecciona un archivo PDF válido.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // quitar el encabezado data:application/pdf;base64,
      setPdfBase64(base64String);
      setFileName(file.name);
      console.log(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPDFClick = async () => {
    if (!pdfBase64) {
      alert("Por favor, selecciona un archivo PDF antes de subir.");
      return;
    }

    const response = await requests.uploadReferralPDF(id, pdfBase64);
    console.log(response);
    if (response) {
      close();
      reload();
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-3 min-w-[460px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Subir PDF firmado.</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={close}
          >
            <RiCloseFill size={24} />
          </span>
        </div>

        <div className="line-row" />

        {/* Input de archivo */}
        <label
          htmlFor="pdfInput"
          className="border-2 border-dashed border-gray-400 rounded-md p-6 text-center cursor-pointer hover:border-blue-500"
        >
          {fileName ? (
            <div className="text-sm text-gray-600 mt-2">
              <p>
                <strong>Archivo seleccionado:</strong> {fileName}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Haz clic para seleccionar un archivo PDF
            </p>
          )}
          <input
            id="pdfInput"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {fileName && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              onClick={handleSubmitPDFClick}
            >
              Subir PDF
            </button>
          </div>
        )}

        {/* Mostrar nombre del archivo */}
      </div>
    </div>
  );
}
