import { ErrorMessage, Field, Form, Formik } from "formik";
import { TbAbc, TbMap } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import requests from "./requests";
import { useEffect, useState } from "react";

const UpdateProduct = () => {
  const { ID } = useParams();
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getProduct(ID).then((response) => {
      console.log(response);
      setProductData(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    model: Yup.string()
      .required("El modelo es obligatorio")
      .min(2, "Debe tener al menos 2 caracteres"),
    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(5, "Debe tener al menos 5 caracteres"),
    quantity: Yup.number()
      .typeError("La cantidad debe ser un número")
      .required("La cantidad es obligatoria")
      .integer("Debe ser un número entero")
      .min(1, "Debe ser mayor que 0"),
  });

  const handleAddProductClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: productData.ID,
        CodigoBarras: values.code,
        Modelo: values.model,
        Descripcion: values.description,
        Estatus: "Activo",
      };

      console.log(object);

      const response = await requests.updateProduct(object);
      console.log(response);

      if (response) {
        navigate("/Layout/ProductsInventory");
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
          <Link to="/Layout/ProductsInventory">Productos</Link> /{" "}
          <b>Nuevo Producto</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Producto</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Producto</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            code: productData.CodigoBarras,
            model: productData.Modelo,
            description: productData.Descripcion,
            quantity: productData.CantidadDisponible,
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddProductClick}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Modelo"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="model"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="model"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Descripción"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="description"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="description"
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

export default UpdateProduct;
