import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { RiCloseFill } from "react-icons/ri";
import { TbMail, TbPaperclip } from "react-icons/tb";
import * as Yup from "yup";
import requests from "./requests";

const UploadFile = ({ enterpriseID, taxDataID, update, close }) => {
  const [fileName, setFileName] = useState("Seleccionar un archivo");
  const [fileBase64, setFileBase64] = useState("");

  const validationSchema = Yup.object().shape({
    file: Yup.mixed().required("El archivo es obligatorio."),
    type: Yup.string().required("El tipo de archivo es obligatorio."),
    email: Yup.string().when("$update", {
      is: false,
      then: (schema) =>
        schema
          .required("El correo electrónico es obligatorio.")
          .email("Correo electrónico inválido."),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

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
        setFieldValue("file", file); // Guardar el archivo en Formik correctamente
      };
    } else {
      setFieldValue("file", ""); // Limpiar si no es un PDF válido
    }
  };
  
  const handleFinishQuoteChange = async (values, { setSubmitting }) => {
    try {
      const object = update
        ? {
            ID: taxDataID,
            EmpresaID: enterpriseID,
            PDF: fileBase64,
            TipoPersona: values.type,
          }
        : {
            EmpresaID: enterpriseID,
            PDF: fileBase64,
            TipoPersona: values.type,
          };

      const response = update
        ? await requests.updateTaxData(object)
        : await requests.addTaxData(object, values.email);

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
          <p className="text-lg font-bold">Subir Archivo</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{ file: "", type: "", email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleFinishQuoteChange}
          context={{ update }}
        >
          {({ setFieldValue }) => (
            <Form className="mt-2 flex gap-5 items-center flex-col">
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
              <div>
                <label
                  className="inputs-placeholder w-76 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tipo de Archivo"
                >
                  <Field
                    className="w-full outline-none resize-none border border-white pr-2"
                    as="select"
                    name="type"
                  >
                    <option>Seleccione el tipo de archivo</option>
                    <option value="Fisica">Persona Fisica</option>
                    <option value="Moral">Persona Moral</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbMail size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {!update && (
                <div>
                  <label
                    className="inputs-placeholder w-76 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Correo Electrónico"
                  >
                    <Field
                      className="w-full outline-none resize-none border border-white pr-2"
                      type="email"
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
              )}
              <button
                type="submit"
                className="self-end h-12 px-16 border-2 border-sovetec-primary flex justify-center items-center text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                // disabled={isSubmitting}
              >
                Añadir
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadFile;
