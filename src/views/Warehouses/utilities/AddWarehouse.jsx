import { ErrorMessage, Field, Form, Formik } from "formik";
import { TbAbc, TbKey, TbMap } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import requests from "./requests";

const AddWarehouse = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("El nombre del almacén es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres"),
    address: Yup.string()
      .required("La ubicación es obligatoria")
      .min(3, "Debe tener al menos 3 caracteres"),
  });

  const handleAddWarehouseClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Nombre: values.name,
        Ubicacion: values.address,
      };

      console.log(object);

      const response = await requests.insertWarehouse(object);
      console.log(response);

      if (response) {
        navigate("/Layout/Warehouses");
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
          <Link to="/Layout/Warehouses">Almacenes</Link> / <b>Nuevo Almacen</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Almacen</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Almacen</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: "",
            address: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddWarehouseClick}
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
                  data-text="Ubicación"
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Agregar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddWarehouse;
