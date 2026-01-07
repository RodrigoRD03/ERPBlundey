import { useEffect, useRef } from "react";
import { ErrorMessage, Field, Form, Formik, useFormikContext } from "formik";
import { TbAbc } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import requests from "./requests";
import { IoClose } from "react-icons/io5";
import { RxBoxModel } from "react-icons/rx";
import { FiBox } from "react-icons/fi";

const ModelWatcher = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const fetchModel = async () => {
      try {
        if (values.model && values.model.trim().length >= 2) {
          const res = await requests.getModel(values.model.trim());
          console.log("Resultado búsqueda:", res);

          if (res?.Success === true && res?.Producto?.Descripcion) {
            setFieldValue("description", res.Producto.Descripcion);
          } else {
            setFieldValue("description", "");
          }
        }
      } catch (err) {
        console.error("Error buscando modelo:", err);
      }
    };

    fetchModel();
  }, [values.model, setFieldValue]);

  return null;
};

const AddProduct = ({ barcode, onProductAdded, close }) => {
  const navigate = useNavigate();
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const validationSchema = Yup.object().shape({
    model: Yup.string()
      .required("El modelo es obligatorio")
      .min(2, "Debe tener al menos 2 caracteres"),
    description: Yup.string()
      .required("La descripción es obligatoria")
      .min(5, "Debe tener al menos 5 caracteres"),
    state: Yup.string().required("El estado es obligatorio"),
  });

  const handleAddProductClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        CodigoBarras: barcode,
        Modelo: values.model,
        Descripcion: values.description,
        CantidadDisponible: 0,
        Estado: values.state,
        Estatus: "Activo",
      };

      const response = await requests.insertProducts(object);
      console.log(response);

      if (response?.Success && onProductAdded) {
        // Aquí notificamos al padre con los datos completos
        onProductAdded(response.ProductoID);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2 justify-center">
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center">
            Registrar Producto
          </p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer  hover:bg-red-500 hover:text-white"
            onClick={() => close()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{
            model: "",
            description: "",
            state: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddProductClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              {/* Observador de cambios en "model" */}
              <ModelWatcher />

              {/* Campo Modelo */}
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Modelo"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="model"
                    innerRef={firstInputRef}
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <RxBoxModel size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="model"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              {/* Campo Descripción */}
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Descripción"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="description"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Estado"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white"
                    as="select"
                    name="state"
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Nuevo Abierto">Nuevo Abierto</option>
                    <option value="Usado">Usado</option>
                  </Field>

                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <FiBox size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              {/* Botón */}
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

export default AddProduct;
