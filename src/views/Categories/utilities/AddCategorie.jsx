import { ErrorMessage, Field, Formik, Form } from "formik";
import * as Yup from "yup";
import requests from "./requests";
import { TbCards } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";

const AddCategorie = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre de la categoria es obligario."),
  });

  const handleAddCategorieClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Nombre: values.name,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Crear",
        Contenido: `Añadio la categotia ${values.name}.`,
      };

      const response = await requests.addCategorie(object);

      if (response) {
        await requests.addLog(log);
        navigate("/Layout/Categories");
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
          <Link to="/Layout/Brands">Categorias</Link> / <b>Nueva Categoria</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nueva Categoria</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Categoria</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddCategorieClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Nombre de la Categoria"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="name"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCards size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Aceptar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCategorie;
