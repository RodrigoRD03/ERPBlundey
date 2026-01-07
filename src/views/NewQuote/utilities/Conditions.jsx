import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { FaRegCreditCard } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import requests from "./requests";
import { TbCalendar, TbPencil, TbTruck } from "react-icons/tb";
import { Spinner } from "@radix-ui/themes";

const Conditions = ({ quoteID, close }) => {
  const [conditionsDelivery, setConditionsDelivery] = useState([]);
  const [conditionsPayment, setConditionsPayment] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    requests.getConditionsDelivery().then((response) => {
      setConditionsDelivery(response);
    });
    requests.getCondtionsPayment().then((response) => {
      setConditionsPayment(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    deliveryCondition: Yup.string().required(
      "Las condiciones de entrega son obligatorios."
    ),
    paymentCondition: Yup.string().required(
      "Las condiciones de pago son obligatorios."
    ),
    expiration: Yup.string().required("La expiración es obligatoria."),
  });

  const handleAddConditionsClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const object = {
        ID: quoteID,
        TipoPago:
          values.paymentCondition != "Other"
            ? values.paymentCondition
            : values.otherPayment,
        TipoEnvio:
          values.deliveryCondition != "Other"
            ? values.deliveryCondition
            : values.otherDelivery,
        Vencimiento: `${values.expiration}`,
        Nota: values.notes,
      };

      const response = await requests.addComercialConditions(object);

      if (response == true) {
        window.location.reload();
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
            Condiciones Comerciales.
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
            deliveryCondition: "",
            otherDelivery: "",
            paymentCondition: "",
            otherPayment: "",
            expiration: "",
            notes: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddConditionsClick}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Condiciones de Entrega"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white cursor-pointer"
                    as="select"
                    name="deliveryCondition"
                  >
                    <option>Seleccione una opción</option>
                    {conditionsDelivery.map((item, index) => (
                      <option key={index} value={item.Descripcion}>
                        {item.Descripcion}
                      </option>
                    ))}
                    <option value="Other">Otra</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbTruck size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="deliveryCondition"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {values.deliveryCondition == "Other" && (
                <div>
                  <label
                    className="inputs-placeholder w-96 relative  flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Otra Condicion de Entrega"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      type="text"
                      name="otherDelivery"
                    />
                    <span className="min-w-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbPencil size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="otherDelivery"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              )}

              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Condiciones de Pago"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white cursor-pointer"
                    as="select"
                    name="paymentCondition"
                  >
                    <option>Seleccione una opción</option>
                    {conditionsPayment.map((item, index) => (
                      <option key={index} value={item.Descripcion}>
                        {item.Descripcion}
                      </option>
                    ))}
                    <option value="Other">Otra</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <FaRegCreditCard size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="paymentCondition"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {values.paymentCondition == "Other" && (
                <div>
                  <label
                    className="inputs-placeholder w-96 relative  flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Otra Condicion de Pago"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      type="text"
                      name="otherPayment"
                    />
                    <span className="min-w-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbPencil size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="otherPayment"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              )}
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Vencimiento"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="expiration"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="expiration"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-36 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Notas"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    as="textarea"
                    name="notes"
                  />
                  <span className="min-w-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPencil size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="notes"
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
                  {loader ? <Spinner color="gray" /> : <>Agregar</>}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Conditions;
