import { useState } from "react";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { IoClose } from "react-icons/io5";
import { TbMail, TbPaperclip, TbPlus, TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Finish = ({ quoteID, close }) => {
  const [files, setFiles] = useState([]);
  const [emails, setEmails] = useState([]);
  const [fileName, setFileName] = useState("Seleccionar un archivo");
  const [fileBase64, setFileBase64] = useState("");
  const navigate = useNavigate();

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

  const handleAddEmailsChange = (values, { setSubmitting, resetForm }) => {
    try {
      setEmails((prevEmails) => [...prevEmails, values.email]); // Actualiza el estado correctamente
      resetForm(); // Limpia el campo después de agregar el correo
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEmailClick = (index) => {
    setEmails((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleFinishQuoteChange = async (values, { setSubmitting }) => {
    try {
      await requests.updatePrice({
        ID: quoteID,
      });

      const object = {
        Archivos: files,
        Correos: emails,
      };

      const response = await requests.finishQuote(
        object,
        quoteID,
        values.uselongCondition,
        values.sendEmail
      );

      if (response == true) {
        navigate("/Layout/PendingQuotes");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2 justify-center">
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center ">
            Terminar Cotización
          </p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer hover:bg-red-500 hover:text-white"
            onClick={() => close()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="flex gap-5">
          <div className="flex flex-col gap-1.5">
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
                        onChange={(event) =>
                          handleFileUpload(event, setFieldValue)
                        }
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
                  <button
                    type="submit"
                    className="self-end size-14 border-2 border-sovetec-primary flex justify-center items-center text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                  >
                    <TbPlus size={24} />
                  </button>
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
          </div>
          <div className="flex flex-col gap-2">
            <Formik
              initialValues={{ email: "" }}
              onSubmit={handleAddEmailsChange}
            >
              {({ isSubmitting }) => (
                <Form className="mt-2 flex gap-5 items-center">
                  <div>
                    <label
                      className="inputs-placeholder w-76 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Correo"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="text"
                        name="email"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                        <TbMail size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <button
                    type="submit"
                    className="self-end size-14 border-2 border-sovetec-primary flex justify-center items-center text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                    disabled={isSubmitting}
                  >
                    <TbPlus size={24} />
                  </button>
                </Form>
              )}
            </Formik>
            {emails.length > 0 && (
              <table className=" border-zinc-500 text-center w-96 border-collapse overflow-hidden">
                <thead>
                  <tr className="border ">
                    <th className="bg-sovetec-primary text-white text-sm p-1.5 w-[200px]">
                      Correo
                    </th>
                    <th className="bg-sovetec-primary text-white text-sm p-1.5">
                      Eliminar
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((item, index) => (
                    <tr key={index} className="text-sm border ">
                      <td className="p-1 py-3 text-sm">
                        <p>{item}</p>
                      </td>
                      <td className="p-1 py-3">
                        <span className="flex w-full h-full justify-center items-center text-red-500">
                          <TbTrash
                            size={22}
                            className="cursor-pointer"
                            onClick={() => handleDeleteEmailClick(index)}
                          />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{ sendEmail: false, uselongCondition: false }}
          onSubmit={handleFinishQuoteChange}
        >
          {({ isSubmitting }) => (
            <Form className="w-full flex gap-5 items-center justify-between">
              <div className="flex flex-col gap-2 items-start">
                <div className="flex items-center justify-end gap-2">
                  <label
                    htmlFor="sendEmail"
                    className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
                  >
                    <Field
                      type="checkbox"
                      name="sendEmail"
                      className="hidden peer"
                      id="sendEmail"
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition peer-checked:bg-blue-500 peer-checked:border-blue-500">
                      <svg
                        className="w-4 h-4 bg-r text-white scale-100 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.586l10.293-10.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Enviar correo al cliente.
                  </label>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <label
                    htmlFor="uselongCondition"
                    className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
                  >
                    <Field
                      type="checkbox"
                      name="uselongCondition"
                      className="hidden peer"
                      id="uselongCondition"
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition peer-checked:bg-blue-500 peer-checked:border-blue-500">
                      <svg
                        className="w-4 h-4 bg-r text-white scale-100 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.586l10.293-10.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Usar condiciones largas.
                  </label>
                </div>
              </div>

              <div className="flex h-full gap-5 items-end">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="self-end w-64  bg-zinc-200 px-3 py-2 text-zinc-500 rounded-lg font-bold tracking-wide cursor-pointer hover:bg-zinc-500 hover:text-zinc-200"
                  onClick={() => close()}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Aceptar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Finish;
