import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  TbAlertSmall,
  TbBox,
  TbCalendar,
  TbNumber123,
  TbQuestionMark,
  TbReload,
} from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import requests from "./requests";
import * as Yup from "yup";

const AddRegister = () => {
  const [conceptsList, setConceptsList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getConcepts().then((response) => {
      setConceptsList(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    date: Yup.date()
      .required("La fecha es obligatoria.")
      .typeError("Debe ser una fecha válida."),
    reason: Yup.string()
      .required("El motivo es obligatorio.")
      .min(3, "Debe tener al menos 3 caracteres."),
    quantity: Yup.number()
      .required("La cantidad es obligatoria.")
      .typeError("Debe ser un número válido.")
      .positive("La cantidad debe ser mayor que cero."),
    concept: Yup.string().required("Debe seleccionar un concepto."),
    otherConcept: Yup.string().when("concept", {
      is: "Otro",
      then: (schema) =>
        schema
          .required("Debe especificar el otro concepto.")
          .min(3, "Debe tener al menos 3 caracteres."),
      otherwise: (schema) => schema.notRequired(),
    }),
    delivered: Yup.string()
      .required("El campo 'Entregado por' es obligatorio.")
      .min(3, "Debe tener al menos 3 caracteres."),
  });

  const handleInsertRegisterClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Motivo: values.reason,
        Cantidad: values.quantity,
        NoFactura:
          values.concept == "Otro" ? values.otherConcept : values.concept,
        Entregado: values.delivered,
        RetiroNacionalID: "",
        Fecha: values.date,
      };

      const response = await requests.addRegister(object);
      if (response == 0) {
        window.location.reload();
      } else if (response == 1) {
        setErrorMessage("Primero debes ingresar un cheque.");
      } else if (response == 2) {
        setErrorMessage(
          "La cantidad rebasa al monto disponible, ingrese otro cheque."
        );
      } else {
        navigate("/Layout/PettyCash");
      }

      //   response && navigate("/Layout/PettyCash");
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
          <Link to="/Layout/PettyCash">Caja Chica</Link> / <b>Nuevo Regitro</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Registro</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Registro</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            date: "",
            reason: "",
            quantity: "",
            concept: "",
            delivered: "",
            otherConcept: "",
          }}
            validationSchema={validationSchema}
          onSubmit={handleInsertRegisterClick}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="date"
                    name="date"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Motivo"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="reason"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbQuestionMark size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Cantidad"
                >
                  <Field
                    className="w-full h-full outline-none"
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
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Concepto"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    as="select"
                    name="concept"
                  >
                    <option value="">Seleccione un cheque</option>
                    {conceptsList.map((check, index) => (
                      <option key={index} value={check.label}>
                        {check.label}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAlertSmall size="27" />
                  </span>
                </label>
                <ErrorMessage
                  name="concept"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {values.concept == "Otro" && (
                <div>
                  <label
                    className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Otro Concepto"
                  >
                    <Field
                      className="w-full h-full outline-none"
                      type="text"
                      name="otherConcept"
                    />
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbReload size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="otherConcept"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              )}
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Entregado por:"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="delivered"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbBox size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="delivered"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-xs text-right m-0">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Añadir Registro
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddRegister;
