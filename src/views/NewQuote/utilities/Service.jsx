import { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import { TbAbc, TbClock, TbNumber123 } from "react-icons/tb";
import { Spinner } from "@radix-ui/themes";

const CustomSelect = ({ field, form, options }) => {
  return (
    <Select
      options={options}
      value={options.find((option) => option.value === field.value) || null}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      onBlur={() => form.setFieldTouched(field.name, true)}
      isSearchable
      className="w-96"
      placeholder="Selecciona el Servicio"
    />
  );
};

const Service = ({ itemID, navigateClick }) => {
  const [listServices, setListServices] = useState([]);
  const [price, setPrice] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      const response = await requests.getServicesSelect();
      setListServices(response);
    };
    fetchServices();
  }, []);

  const validationSchema = Yup.object().shape({
    longDescription: Yup.string().required(
      "La descripción larga es obligatoria."
    ),
    serviceID: Yup.string().required("El servicio es un campo obligatorio."),
    quantity: Yup.string().required("La cantidad es obligatoria."),
    deliveryTime: Yup.string().required("El tiempo de entrega es obligatorio."),
  });

  const fetchPrice = useCallback(async (serviceID) => {
    if (serviceID) {
      const response = await requests.getPriceService(serviceID);
      setPrice(response); // Asumiendo que la respuesta contiene un campo 'price'
    }
  }, []);

  const handleAddItemClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const object = {
        PartidaID: itemID,
        ServicioID: values.serviceID,
        Cantidad: values.quantity,
        PrecioUnitario: price,
        DescripcionLarga: values.longDescription,
      };
      await requests.addServiceItem(object);

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
      <p className="text-lg">Partida de Servicio</p>
      <div className="line-row" />
      <Formik
        initialValues={{
          longDescription: "",
          serviceID: "",
          quantity: "",
          deliveryTime: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleAddItemClick}
      >
        {({ isSubmitting, values }) => {
          // Hacer la petición cuando 'brandID' cambie
          useEffect(() => {
            fetchPrice(values.serviceID);
          }, [values.serviceID, fetchPrice]);
          return (
            <Form className="mt-2 flex flex-col gap-5 ">
              <div className="w-96">
                <label className="block text-sm font-semibold text-gray-600">
                  Selecciona el Servicio:
                </label>
                <Field
                  name="serviceID"
                  component={CustomSelect}
                  options={listServices || []} // Evita errores si aún no se ha cargado
                />
                <ErrorMessage
                  name="serviceID"
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
              <div>
                <label
                  className="inputs-placeholder w-96 h-36 relative  flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Descripción Larga"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    as="textarea"
                    name="longDescription"
                  />
                  <span className="min-w-10 min-h-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="longDescription"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
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
                  disabled={isSubmitting || loader}
                  className="self-end w-64 flex justify-center items-center border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  {loader ? <Spinner color="gray" /> : "Agregar"}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default Service;
