import { ErrorMessage, Form, Formik } from "formik";
import { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { TbFileTypeXml } from "react-icons/tb";
import requests from "./requests";
import { useNavigate } from "react-router-dom";

const UploadXML = ({ close }) => {
  const [fileName, setFileName] = useState("Seleccionar un archivo");
  const [fileBase64, setFileBase64] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file && file.type === "text/xml") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        const nameWithoutExt = file.name.replace(/\.xml$/i, "");
        setFileName(nameWithoutExt);
        setFileBase64(base64String);

        setFieldValue("file", ""); // Limpiar el input
      };
    } else {
      console.error("El archivo no es un XML válido.");
    }
  };

  const handleUploadXMLClick = async (values, { setSubmitting }) => {
    try {
      //   setLoading(true);
      const object = {
        XML: fileBase64,
      };

      const response = await requests.uploadXML(object);

      if (response.MetodoPago == null) {
        setErrorMessage("Factura Invalida");
        setTimeout(() => window.location.reload(), 8000);
        return;
      } else if (response.Ordenes != null) {
        navigate(`/Layout/InvoicesPendingIssue/Invoice/${fileBase64}`);
      } else {
        setErrorMessage(response.TipoFactura);
        setTimeout(() => window.location.reload(), 8000);
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
          <p className="text-lg font-bold">Subir XML</p>
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
            xml: "",
          }}
          onSubmit={handleUploadXMLClick}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label className="w-76 border border-zinc-300 border-dashed flex p-2 rounded-md items-center gap-2 hover:bg-zinc-200 cursor-pointer">
                  <input
                    name="xml"
                    className="hidden"
                    type="file"
                    accept=".xml"
                    onChange={(event) => handleFileUpload(event, setFieldValue)}
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbFileTypeXml size="20" />
                  </span>
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
                    {fileName}
                  </p>
                </label>
                <ErrorMessage
                  name="xml"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div className="w-full flex justify-end gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Subir XML
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {errorMessage && (
        <div className="absolute bottom-5 right-5 bg-white rounded-sm overflow-hidden">
          <div className="relative w-full h-full px-5 py-3">
            {errorMessage}
            <div className="absolute bottom-0 right-0 h-1 w-full bg-red-500 cronometer"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadXML;
