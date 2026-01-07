import { useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { RiCloseFill } from "react-icons/ri";
import { TbCalendar, TbNumber123 } from "react-icons/tb";
import requests from "./requests";

const StartOrder = ({ quoteID, close }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const validationSchema = Yup.object().shape({
    deliveryTime: Yup.string().required("La fecha de entrega es obligatoria"),
    identifierOC: Yup.string().required("El identificador es obligatorio."),
  });

  const handleStartOrderClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        CotizacionID: quoteID,
        FechaEntregaEstimada: values.deliveryTime,
        ClienteOrdenCompra: values.identifierOC,
      };

      const response = await requests.addSaleOrder(object);

      if (response.success) {
        window.location.reload();
      } else {
        setErrorMessage(response.message);
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
          <p className="text-lg font-bold">Iniciar Orden</p>
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
            deliveryTime: "",
            identifierOC: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleStartOrderClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha de Entrega Aproximada"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="deliveryTime"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="deliveryTime"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative  flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Identificador de O.C Cliente"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="identifierOC"
                  />
                  <span className="min-w-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="identifierOC"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {errorMessage && (
                <div className="self-end text-red-500 text-xs text-right m-0 w-64">
                  {errorMessage}
                </div>
              )}
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
          )}
        </Formik>
      </div>
    </div>
  );
};

export default StartOrder;
