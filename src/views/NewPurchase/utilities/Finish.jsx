import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { RiCloseFill } from "react-icons/ri";
import { TbAbc, TbCalendar, TbCreditCard, TbTruck } from "react-icons/tb";
import requests from "./requests";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Finish = ({ supplierID, close }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);

  const validationSchema = Yup.object().shape({
    typeDeparture: Yup.string().required("El tipo de envio es obligatorio."),
    typePament: Yup.mixed().required("El tipo de pago es obligatorio."),
    dateDelivery: Yup.mixed().required(
      "La fecha estimada de entrega es obligatoria."
    ),
  });

  const handleAddComercialConditionsClick = async (
    values,
    { setSubmitting }
  ) => {
    try {
      const object = {
        ID: supplierID,
        TipoPago: values.typePament,
        TipoEnvio: values.typeDeparture,
        FechaEstimadaEntrega: values.dateDelivery,
      };

      const response = await requests.addComercialConditions(object);

      if (response.Exitoso) {
        navigate("/Layout/NewPurchase");
      } else {
        setErrorMessage(response.Mensaje);
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
          <p className="text-lg font-bold">Condiciones Comerciales</p>
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
            typeDeparture: "",
            typePament: "",
            dateDelivery: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddComercialConditionsClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tipo de Envio"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="typeDeparture"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbTruck size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="typeDeparture"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tipo de Pago"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="typePament"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCreditCard size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="typePament"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha Estimada de Entrega"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="dateDelivery"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="dateDelivery"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-xs text-right m-0">
                  {errorMessage}
                </div>
              )}
              <div className="w-full flex justify-end gap-5">
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

export default Finish;
