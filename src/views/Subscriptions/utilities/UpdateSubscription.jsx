import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TbEyeSearch, TbNumber } from "react-icons/tb";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import { RiExchangeDollarLine } from "react-icons/ri";
import * as Yup from "yup";

const UpdateSubscription = () => {
  const { subscriptionID, type } = useParams();
  const [subscriptionData, setSubscriptionData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "Nacional") {
      requests.getPaymentNational(subscriptionID).then((response) => {
        setSubscriptionData(response);
      });
    }
    if (type === "Dolar") {
      requests.getPaymentDollar(subscriptionID).then((response) => {
        setSubscriptionData(response);
      });
    }
  }, []);

  const validationSchema = Yup.object({
    document: Yup.string().required("Seleccione un tipo de acción"),
    concept: Yup.string().required("Ingrese un concepto"),
    remarks: Yup.string(),
    quantity: Yup.number()
      .required("Ingrese una cantidad")
      .min(1, "Debe ser mayor a 0"),
  });

  const handleInsertSubscriptionClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: subscriptionData.ID,
        Documento: values.document,
        Concepto: values.concept,
        Observaciones: values.remarks,
        Abono: values.quantity,
        CuentaBancariaID: subscriptionData.CuentaBancariaID,
      };

      if (type === "Nacional") {
        const response = await requests.updateSubscriptionNational(object);

        if (response == true) {
          navigate("/Layout/Subscriptions");
        }
      } else if (type === "Dolar") {
        const response = await requests.updateSubscriptionDollar(object);

        if (response == true) {
          navigate("/Layout/Subscriptions");
        }
      } else {
        console.log("Tipo de pago no válido");
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
          <Link to="/Layout/Subscriptions">Abonos</Link> /{" "}
          <b>Actualizar Abono</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Actualizar Abono</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Abono</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            document: subscriptionData.Documento,
            concept: subscriptionData.Concepto,
            remarks: subscriptionData.Observaciones,
            quantity: subscriptionData.Abono,
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertSubscriptionClick}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tipo de Accion"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    as="select"
                    name="document"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Transferecia">Transferecia</option>
                    <option value="Deposito">Deposito</option>
                    <option value="Devolución">Devolución</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <RiExchangeDollarLine size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="document"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Concepto"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="concept"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <HiOutlineDocumentCurrencyDollar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="concept"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Observaciones"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="remarks"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbEyeSearch size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="remarks"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Canntidad del Abono"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="number"
                    name="quantity"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Actualizar Abono
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateSubscription;
