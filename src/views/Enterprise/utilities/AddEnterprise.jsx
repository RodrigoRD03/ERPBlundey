import { useUser } from "../../../Contexts/UserContext";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TbAbc, TbNumber123 } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const AddEnterprise = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio."),
    rfc: Yup.mixed().required("El RFC es obligatorio."),
  });

  const handleAddEnterpriseClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Nombre: values.name,
        RFC: values.rfc,
        Estatus: "Activo",
        UsuarioID: userData.ID,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Crear",
        Contenido: `Añadio la empresa ${values.name}.`,
      };

      const response = await requests.addEnterprises(object);

      if (response) {
        await requests.addLog(log);
        navigate("/Layout/Enterprises");
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
          <Link to="/Layout/Enterprises">Empresas</Link> / <b>Nueva Empresa</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nueva Empresa</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Empresa</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: "",
            rfc: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddEnterpriseClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Nombre"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="name"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
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
              <div className="w-full flex justify-end">
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

export default AddEnterprise;
