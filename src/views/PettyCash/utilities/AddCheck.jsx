import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { TbBox, TbCalendar } from "react-icons/tb";
import requests from "./requests";
import * as Yup from "yup";

const AddCheck = () => {
  const [checksList, setChecksList] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getChecks().then((response) => {
      setChecksList(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    date: Yup.date()
      .required("La fecha es obligatoria.")
      .typeError("Debe ser una fecha válida."),
    check: Yup.string()
      .required("Debe seleccionar un cheque.")
      .min(1, "Debe seleccionar un cheque válido."),
    delivered: Yup.string()
      .required("El campo 'Entregado por' es obligatorio.")
      .min(3, "Debe tener al menos 3 caracteres."),
  });

  const handleInsertCheckClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Motivo: "",
        Cantidad: "",
        NoFactura: "",
        Entregado: values.delivered,
        RetiroNacionalID: values.check,
        Fecha: values.date,
      };
      const response = await requests.addCheck(object);
      if (!response) {
        setErrorMessage("La cantidad rebasa al monto disponible.");
      } else {
        navigate("/Layout/PettyCash");
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
          <Link to="/Layout/PettyCash">Caja Chica</Link> / <b>Nuevo Cheque</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Cheque</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Cheque</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            date: "",
            check: "",
            delivered: "",
          }}
            validationSchema={validationSchema}
          onSubmit={handleInsertCheckClick}
        >
          {({ isSubmitting }) => (
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
                  data-text="Cheque"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    as="select"
                    name="check"
                  >
                    <option value="">Seleccione un cheque</option>
                    {checksList.map((check, index) => (
                      <option key={index} value={check.value}>
                        {check.label}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbCalendar size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="check"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
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
                Añadir Cheque
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddCheck;
