import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect } from "react";
import { RiCloseFill } from "react-icons/ri";
import { TbCards, TbCategory, TbPercentage } from "react-icons/tb";
import requests from "./requests";
import { useState } from "react";
import * as Yup from "yup";

const UpdatePrices = ({ close }) => {
  const [listCategories, setListCategories] = useState([]);
  const [listBrands, setListBrands] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    requests.getCategories().then((response) => {
      setListCategories(response);
    });
    requests.getBrands().then((response) => {
      setListBrands(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    brandID: Yup.string().required("La marca es obligatoria"),

    categoryID: Yup.string().required("La categoría es obligatoria"),

    percentage: Yup.number()
      .typeError("Debe ser un número")
      .required("El porcentaje es obligatorio")
      .min(-100, "El porcentaje no puede ser menor a -100")
      .max(1000, "El porcentaje no puede ser mayor a 1000"),
  });

  const handleUpdatePricesClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        brandID: values.brandID,
        categoryID: values.categoryID,
        percentage: values.percentage,
      };

      console.log(object);

      const response = await requests.updatePrices(object);

      console.log(response);

      if (response == true) {
        window.location.reload();
      } else {
        setErrorMessage("Error al actualizar los precios");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Actualizar Precios</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{
            brandID: "",
            categoryID: "",
            percentage: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdatePricesClick}
        >
          {({ isSubmitting, setFieldValue, setTouched }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className=" w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Marca *"
                  htmlFor="#brandID"
                >
                  <Field
                    className="w-full outline-none resize-none appearance-none cursor-pointer"
                    as="select"
                    name="brandID"
                    id="brandID"
                  >
                    <option value="">Selecciona una marca</option>
                    {listBrands.map((brand, index) => (
                      <option key={index} value={brand.ID}>
                        {brand.NombreCompleto}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCards size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="brandID"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Categoria *"
                  htmlFor="#categoryID"
                >
                  <Field
                    className="w-full outline-none resize-none appearance-none cursor-pointer"
                    as="select"
                    name="categoryID"
                    id="brandID"
                  >
                    <option value="">Selecciona una Categoria</option>
                    {listCategories.map((category, index) => (
                      <option key={index} value={category.ID}>
                        {category.Nombre}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCategory size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="categoryID"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Porcentaje *"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="percentage"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPercentage size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="percentage"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white duration-300"
              >
                Cambiar Precios
              </button>
              {errorMessage && (
                <div className=" text-red-500 text-xs text-right m-0 flex self-end">
                  <p>{errorMessage}</p>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdatePrices;
