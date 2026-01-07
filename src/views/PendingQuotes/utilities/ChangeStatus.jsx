import { Button, Spinner } from "@radix-ui/themes";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";
import { TbPresentation } from "react-icons/tb";
import { useUser } from "../../../Contexts/UserContext";

const ChangeStatus = ({ ID, close }) => {
  const [sendEmail, setSendMail] = useState(false);
  const [cancelQuote, setCancelQuote] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userData } = useUser();

  const validationSchema = Yup.object().shape({
    reason: Yup.string().required("El motivo obligatorio."),
  });

  const handleAcceptQuoteClick = async () => {
    setLoading(true);
    const object = {
      ID: ID,
    };

    if (userData.Roles != "Supervisor") {
      const response = await requests.acceptQuote(object);
      if (response) {
        window.location.reload();
      }
    } else {
      const response = await requests.acceptQuoteSupervisor(sendEmail, object);
      if (response) {
        window.location.reload();
      }
    }
  };

  const handleCancelQuoteClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: ID,
        MotivoEstatus: values.reason,
      };
      const response = await requests.cancelQuote(object);
      if (response) {
        window.location.reload();
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
          <p className="text-lg font-bold">Cambiar Estatus</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="w-72 flex flex-col gap-3">
          <p className="font-bold text-3xl">¡Atención!</p>
          <p className="font-bold">¿Desea cancelar o aceptar la cotización?</p>
          <ul className="list-disc pl-5 text-sm">
            <li>
              Para cancelar la cotización: Haga clic en el botón "Cancelar
              cotización"
            </li>

            <li>
              {userData.Roles != "Supervisor"
                ? "Al aceptar, la cotización quedará en espera de aprobación por parte del supervisor. Una vez aprobada, se enviará automáticamente al cliente."
                : "Al aceptar, la cotización se enviará directamente al cliente. Asegúrate de revisar que todo esté correcto antes de continuar."}
            </li>
          </ul>
        </div>

        <div className="line-row" />
        {!cancelQuote ? (
          <div className="flex flex-col gap-3 justify-center items-center">
            <button
              className="w-full h-10 bg-red-500 text-white rounded-sm text-sm"
              onClick={() => setCancelQuote(true)}
            >
              Cancelar Cotización
            </button>
            {loading ? (
              <div className="w-10 h-10 bg-sovetec-primary flex justify-center items-center rounded-full text-white">
                <Spinner />
              </div>
            ) : (
              <button
                className="w-full h-10 bg-lime-500 text-white rounded-sm text-sm"
                onClick={() => handleAcceptQuoteClick()}
              >
                Aceptar Cotización
              </button>
            )}
          </div>
        ) : (
          <Formik
            initialValues={{
              reason: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleCancelQuoteClick}
          >
            {({ isSubmitting }) => (
              <Form className="mt-2 flex flex-col gap-5">
                <div>
                  <label
                    className="inputs-placeholder relative w-72 h-38 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Motivo"
                  >
                    <Field
                      className="w-full h-full outline-none resize-none"
                      as="textarea"
                      name="reason"
                    />
                    <span className="size-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbPresentation size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="reason"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                {loading ? (
                  <div className="w-10 h-10 bg-sovetec-primary flex justify-center items-center rounded-full text-white">
                    <Spinner />
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="self-end w-64 border-2 border-red-700 px-3 py-2 text-red-500 rounded-lg font-bold tracking-wide cursor-pointer hover:bg-red-700 hover:text-white"
                  >
                    Cancelar
                  </button>
                )}
              </Form>
            )}
          </Formik>
        )}
        {!cancelQuote && userData.Roles == "Supervisor" && (
          <div className="flex items-center justify-end gap-2">
            <label
              htmlFor="sendEmail"
              className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
            >
              <input
                type="checkbox"
                name="sendEmail"
                className="hidden peer"
                id="sendEmail"
                checked={sendEmail}
                onChange={() => setSendMail(!sendEmail)}
              />
              Enviar correo al cliente
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
        )}
      </div>
    </div>
  );
};

export default ChangeStatus;
