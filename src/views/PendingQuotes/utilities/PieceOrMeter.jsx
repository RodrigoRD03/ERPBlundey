import { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import { TbClock, TbNumber123 } from "react-icons/tb";

const CustomSelect = ({ field, form, options }) => {
  return (
    <Select
      options={options}
      value={options.find((option) => option.value === field.value) || null}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      onBlur={() => form.setFieldTouched(field.name, true)}
      isSearchable
      className="w-96"
      placeholder="Selecciona un Producto"
    />
  );
};

const PieceOrMeter = ({ itemID, navigateClick }) => {
  const [listProducts, setListProducts] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await requests.getProductsSelect();
      setListProducts(response);
    };
    fetchProducts();
  }, []);

  const validationSchema = Yup.object().shape({
    productID: Yup.string().required("El producto es un campo obligatorio."),
    quantity: Yup.string().required("La cantidad es obligatoria."),
    deliveryTime: Yup.string().required("El tiempo de entrega es obligatorio."),
  });

  const fetchPrice = useCallback(async (productID) => {
    if (productID) {
      const response = await requests.getPriceProduct(productID);
      setPrice(response);
    }
  }, []);

  const handleAddItemClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        PartidaID: itemID,
        ProductoID: values.productID,
        Cantidad: values.quantity,
        PrecioUnitario: price,
        DescripcionLarga: values.useLongDescription,
      };

      await requests.addProductItem(object);
      const deliveryResponse = await requests.dateDelivery(
        itemID,
        values.deliveryTime
      );

      if (deliveryResponse == true) {
        navigateClick();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
      <p className="text-lg">Partida de Producto o Metro</p>
      <div className="line-row" />
      <Formik
        initialValues={{
          useLongDescription: false,
          price: "",
          productID: "",
          quantity: "",
          deliveryTime: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddItemClick}
      >
        {({ isSubmitting, values }) => {
          // Hacer la petición cuando 'brandID' cambie
          useEffect(() => {
            fetchPrice(values.productID);
          }, [values.productID, fetchPrice]);

          return (
            <Form className="mt-2 flex flex-col gap-5 ">
              <div className="w-96">
                <label className="block text-sm font-semibold text-gray-600">
                  Selecciona el producto:
                </label>
                <Field
                  name="productID"
                  component={CustomSelect}
                  options={listProducts || []} // Evita errores si aún no se ha cargado
                />
                <ErrorMessage
                  name="productID"
                  component="div"
                  className="text-red-500 text-xs text-right"
                />
              </div>
              <div className="w-full flex justify-between">
                <div>
                  <label
                    className="inputs-placeholder w-36 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Cantidad"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      type="number"
                      name="quantity"
                    />
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbNumber123 size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                {price && (
                  <div className="">
                    <p className="text-sm text-gray-600">
                      Precio Unitario: $ {price.toLocaleString("en-US")}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-end gap-2">
                <label
                  htmlFor="useLongDescription"
                  className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
                >
                  <Field
                    type="checkbox"
                    name="useLongDescription"
                    className="hidden peer"
                    id="useLongDescription"
                  />
                  <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition peer-checked:bg-blue-500 peer-checked:border-blue-500">
                    <svg
                      className="w-4 h-4 bg-r text-white scale-100 transition-transform duration-200"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.586l10.293-10.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  Usar la descripcion larga.
                </label>
              </div>
              <div className="line-row" />
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tiempo de Entrega de la Partida"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="deliveryTime"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbClock size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="deliveryTime"
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
          );
        }}
      </Formik>
    </div>
  );
};

export default PieceOrMeter;
