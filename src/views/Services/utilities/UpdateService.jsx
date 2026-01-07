import requests from "./requests";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TbAbc, TbCoins } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../../Contexts/UserContext";

const UpdateService = () => {
  const { serviceID } = useParams();
  const [serviceData, setServiceData] = useState(null);
  const navigate = useNavigate();
  const { userData } = useUser();

  useEffect(() => {
    requests.getService(serviceID).then((response) => {
      setServiceData(response);
    });
  }, [serviceID]);

  const validationSchema = Yup.object().shape({
    shortDescription: Yup.string().required(
      "La descripción corta es obligatoria."
    ),
    price: Yup.number().required("El precio es obligatorio."),
    cost: Yup.number().required("El costo es obligatorio."),
  });

  const handleAddServiceClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        DescripcionCorta: values.shortDescription,
        Precio: values.price,
        Costo: values.cost,
        ID: serviceData.ID,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Editar",
        Contenido: `Edito el servicio ${values.shortDescription}.`,
      };

      const response = await requests.updateService(object);

      if (response == true) {
        await requests.addLog(log);
        navigate("/Layout/Services");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!serviceID) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Services">Servicios</Link> / <b>Nuevo Servicio</b>
        </p>
        <p className="text-lg font-bold">Editar Servicio</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Servicio</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            shortDescription: serviceData?.DescripcionCorta || "",
            price: serviceData?.Precio || "",
            cost: serviceData?.Costo || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddServiceClick}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-32 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Descripción Corta"
                >
                  <Field
                    className="w-full h-full outline-none resize-none"
                    as="textarea"
                    name="shortDescription"
                  />
                  <span className="min-w-10 max-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="shortDescription"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Costo"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="cost"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCoins size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="cost"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Precio"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="price"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCoins size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
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

export default UpdateService;
