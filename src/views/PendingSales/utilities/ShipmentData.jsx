import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { RiCloseFill } from "react-icons/ri";
import { TbCalendar, TbNumber123 } from "react-icons/tb";
import { LuBox } from "react-icons/lu";
import requests from "./requests";

const ShipmentData = ({ ID, close }) => {
  const validationSchema = Yup.object().shape({
    dateShipment: Yup.string().required("La Fecha de envio es obligatoria."),
    deliveryDate: Yup.string().required("La fecha de entrega es obligatoria."),
  });

  const handleShipmentDataClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: ID,
        FechaEnvio: values.dateShipment,
        FechaEntregaReal: values.deliveryDate,
        NumeroGuia: values.parcel,
        EmpresaEnvio: values.trackingNumber,
      };
      await requests.addShipmentData(object);
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
          <p className="text-lg font-bold">Datos del Envío </p>
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
            dateShipment: "",
            deliveryDate: "",
            shippingParcel: false,
            parcel: "",
            trackingNumber: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleShipmentDataClick}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha de Envío"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="dateShipment"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="dateShipment"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha de Entrega"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="deliveryDate"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="deliveryDate"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div className="flex items-center justify-end gap-2 w-full">
                <label
                  htmlFor="shippingParcel"
                  className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
                >
                  <Field
                    type="checkbox"
                    name="shippingParcel"
                    className="hidden peer"
                    id="shippingParcel"
                  />
                  Envio por paqueteria
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
                </label>
              </div>
              {values.shippingParcel && (
                <>
                  <div>
                    <label
                      className="inputs-placeholder relative w-96 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Paqueteria"
                    >
                      <Field
                        className="w-full h-full outline-none"
                        type="text"
                        name="parcel"
                      />
                      <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <LuBox size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="parcel"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder relative w-96 h-12 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Numero de guía"
                    >
                      <Field
                        className="w-full h-full outline-none"
                        type="text"
                        name="name"
                      />
                      <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbNumber123 size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                </>
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

export default ShipmentData;
