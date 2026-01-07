import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TbAbc, TbMap } from "react-icons/tb";
import * as Yup from "yup";

const UpdateWarehouse = () => {
  const { warehouseID } = useParams();
  const [warehouseData, setWarehouseData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (warehouseData) {
      requests.getWarehouse(warehouseID).then((response) => {
        setWarehouseData(response || {}); // ⬅ Evita `null` o `undefined`.
      });
    }
  }, [warehouseID]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("El nombre del almacén es obligatorio")
      .min(3, "Debe tener al menos 3 caracteres"),
    address: Yup.string()
      .required("La ubicación es obligatoria")
      .min(3, "Debe tener al menos 3 caracteres"),
  });

  const handleUpdateWarehouseClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: warehouseData?.ID,
        Nombre: values.name,
        Ubicacion: values.address,
      };

      console.log(object);

      const response = await requests.updateWarehouse(object);
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
          <Link to="/Layout/Warehouses">Almacenes</Link> /{" "}
          <b>Actualizar Almacen</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Actualizar Almacen</p>
        <div className="line-row" />
      </div>{" "}
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Almacen</p>
        <div className="line-row" />
        {warehouseData?.Nombre ? ( // ⬅ Evita renderizar Formik antes de tener datos.
          <Formik
            initialValues={{
              name: warehouseData?.Nombre,
              address: warehouseData?.Ubicacion,
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdateWarehouseClick}
            enableReinitialize
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
                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                  >
                    Actualizar
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <p className="text-center text-gray-500">Cargando datos...</p>
        )}
      </div>
    </div>
  );
};

export default UpdateWarehouse;
