import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  TbBuilding,
  TbFlag,
  TbMail,
  TbMap,
  TbMapPin,
  TbNumber,
  TbNumber123,
  TbPhone,
  TbUser,
} from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import requests from "./requests";

const AddSupplier = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio."),
    company: Yup.string().required("El nombre de la empresa es obligatorio."),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "El teléfono solo debe contener números.")
      .required("El número de teléfono es obligatorio."),
    email: Yup.string()
      .email("Debe ser un correo electrónico válido.")
      .required("El correo electrónico es obligatorio."),
    address: Yup.string().required("La dirección es obligatoria."),
    colony: Yup.string().required("La colonia es obligatoria."),
    municipality: Yup.string().required("El municipio es obligatorio."),
    postalCode: Yup.string()
      .matches(/^[0-9]{5}$/, "El código postal debe tener 5 dígitos.")
      .required("El código postal es obligatorio."),
    rfc: Yup.string().required("El RFC es obligatorio."),
  });

  const handleAddSupplierClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Nombre: values.name,
        Contacto: values.company,
        Telefono: values.phone,
        CorreoElectronico: values.email,
        Estado: values.address,
        Municipio: values.municipality,
        Colonia: values.colony,
        CodigoPostal: values.postalCode,
        RFC: values.rfc,
      };

      const response = await requests.addSupplier(object);
      if (response == true) {
        navigate("/Layout/Suppliers");
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
          <Link to="/Layout/Suppliers">Proveedores</Link> /{" "}
          <b>Nuevo Preveedor</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Proveedor</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Proveedor</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: "",
            company: "",
            phone: "",
            email: "",
            address: "",
            colony: "",
            municipality: "",
            postalCode: "",
            rfc: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddSupplierClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Nombre del Contacto"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="name"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbUser size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Empresa"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="company"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbBuilding size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="company"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Telefono"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="phone"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPhone size="20" />
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
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Correo Electronico"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="email"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbMail size="20" />
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
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Dirección"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="address"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbMap size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Colonia"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="colony"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbFlag size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="colony"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Municipio"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="municipality"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbMapPin size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="municipality"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Codigo Postal"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="postalCode"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="postalCode"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="RFC"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="rfc"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="rfc"
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
                  Agregar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddSupplier;
