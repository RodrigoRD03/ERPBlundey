import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { TbCards } from "react-icons/tb";
import { Link, useParams } from "react-router-dom";
import requests from "./requests";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";

const UpdateCategorie = () => {
  const { categorieID } = useParams();
  const [categorieData, setCategorie] = useState(null);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getCategorie(categorieID).then((response) => {
      setCategorie(response);
    });
  }, [categorieID]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre de la categoria es obligario."),
  });

  const handleAddCategorieClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: categorieData.ID,
        Nombre: values.name,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Editar",
        Contenido: `Edito la categoria ${values.name}.`,
      };

      const response = await requests.updateCategorie(object);

      if (response == true) {
        await requests.addLog(log);
        navigate("/Layout/Categories");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Asegúrate de que brandData esté disponible antes de renderizar el formulario
  if (!categorieID) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Categories">Categorias</Link> /{" "}
          <b>Editar Categoria</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Editar Categoria</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Categoria</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: categorieData?.Nombre || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddCategorieClick}
          enableReinitialize={true}
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
              </div>{" "}
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Actualizar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateCategorie;
