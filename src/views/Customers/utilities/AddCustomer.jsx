import { useEffect, useState } from "react";
import { useUser } from "../../../Contexts/UserContext";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LuMail, LuPhone, LuUser } from "react-icons/lu";
import { TbAddressBook, TbPresentation } from "react-icons/tb";
import { AiOutlineFieldNumber } from "react-icons/ai";
import requests from "./requests";
import { Link, useNavigate } from "react-router-dom";
import { Spinner } from "@radix-ui/themes";

const AddCustomer = () => {
  const { userData } = useUser();
  const [listEnterprises, setListEnterprises] = useState([]);
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    requests.getEnterprisesSelect(userData.ID).then((response) => {
      setListEnterprises(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre o razón social es obligatorio."),
    phone: Yup.string().required("El teléfono es obligatorio."),
    email: Yup.string().required("El correo electrónico es obligatorio."),
    contact: Yup.string().required("El nombre de la empresa es obligatorio."),
    references: Yup.string().required("Las referencias son obligatorias."),
  });

  const handleAddCustomerClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const object = {
        NombreCompleto: values.name,
        Telefono: values.phone,
        Extension: values.extension,
        Correo: values.email,
        Contacto: values.phone,
        Referencias: values.references,
        UsuarioID: userData.ID,
        EmpresaID: values.contact,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Crear",
        Contenido: `Añadio el cliente ${values.name}.`,
      };

      const response = await requests.addCustomer(object, values.sendEmail);
      console.log(response);
      
      if (response) {
        await requests.addLog(log);
        setLoader(false);
        navigate("/Layout/Customers");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Customers">Clientes</Link> / <b>Nuevo Cliente</b>
        </p>
        <p className="text-lg">Nuevo Cliente</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Cliente</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: "",
            phone: "",
            extension: "",
            email: "",
            contact: "",
            references: "",
            sendEmail: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddCustomerClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Nombre Completo"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="name"
                  />
                  <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <LuUser size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div className="flex gap-4">
                <div>
                  <label
                    className="inputs-placeholder relative w-60 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Telefono"
                  >
                    <Field
                      className="w-full h-full outline-none"
                      type="number"
                      name="phone"
                    />
                    <span className="min-h-8 min-w-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <LuPhone size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="phone"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    className="inputs-placeholder relative w-32 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Ext."
                  >
                    <Field
                      className="w-full h-full outline-none"
                      type="number"
                      name="extension"
                    />
                    <span className="min-h-8 min-w-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <AiOutlineFieldNumber size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="extension"
                    component="div"
                    className=" text-red-500 text-xs text-left m-0"
                  />
                </div>
              </div>
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Correo Electronico"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="email"
                  />
                  <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <LuMail size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Empresa"
                >
                  <Field
                    className="w-full h-full outline-none appearance-none cursor-pointer"
                    as="select"
                    name="contact"
                  >
                    <option value="">Selecciona una empresa</option>
                    {listEnterprises.map((enterprise) => (
                      <option key={enterprise.value} value={enterprise.value}>
                        {enterprise.label}
                      </option>
                    ))}
                  </Field>
                  <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAddressBook size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="contact"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Referencias"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="references"
                  />
                  <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPresentation size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="references"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
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
                  Enviar correo al cliente
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
                </label>
              </div>

              {loader ? (
                <div className="self-end w-64 h-11 flex items-center justify-center border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white">
                  <Spinner size="24" className="m-auto" />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Añadir Cliente
                </button>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCustomer;
