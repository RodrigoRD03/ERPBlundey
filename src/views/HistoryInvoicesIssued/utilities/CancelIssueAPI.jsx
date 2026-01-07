import { useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import requests from "./requests";
import { TbPlus } from "react-icons/tb";

const validationSchema = Yup.object().shape({
  replacementReason: Yup.string().required(
    "Debes seleccionar un motivo de sustitución."
  ),
  UID: Yup.string().when("replacementReason", {
    is: "01",
    then: (schema) =>
      schema.required("Debes seleccionar la factura que sustituye."),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const CancelIssueAPI = ({ UID, reload, close }) => {
  const [replacementInvoices, setReplacementInvoices] = useState({
    motivos: [],
    facturasSustitutas: [],
  });
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchReplacementInvoices = async () => {
    try {
      const response = await requests.replacementInvoices(UID);
      console.log(response);
      setReplacementInvoices(response);
    } catch (error) {
      console.error("Error fetching replacement invoices:", error);
    }
  };

  useEffect(() => {
    fetchReplacementInvoices();
  }, [UID]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const response = await requests.postCancelIssueAPI(
      UID,
      values.replacementReason,
      values.UID
    );
    console.log(response);
    if (response.IsSuccess === false) {
      setErrorMessage(response.Error.message);
      setSubmitting(false);
    } else {
      setErrorMessage(null);
      setSubmitting(false);
      close();
      reload();
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-3 min-w-[460px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Cancelar Factura.</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={close}
          >
            <RiCloseFill size={24} />
          </span>
        </div>

        <div className="line-row" />

        <Formik
          initialValues={{
            replacementReason: "",
            UID: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5">
              {/* MOTIVO */}
              <div>
                <label
                  className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Motivo de Sustitución"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white"
                    as="select"
                    name="replacementReason"
                  >
                    <option value="">Selecciona un motivo</option>
                    {replacementInvoices?.motivos?.map((invoice) => (
                      <option key={invoice.key} value={invoice.key}>
                        {invoice.name}
                      </option>
                    ))}
                  </Field>
                </label>
                <ErrorMessage
                  name="replacementReason"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              {/* UID - SOLO SI EL MOTIVO ES 01 */}
              {values.replacementReason === "01" && (
                <div>
                  <label
                    className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Factura Sustituta (UID)"
                  >
                    <Field
                      className="w-full outline-none border-2 border-white"
                      as="select"
                      name="UID"
                    >
                      <option value="">Selecciona una factura</option>
                      {replacementInvoices?.facturasSustitutas?.map(
                        (invoice) => (
                          <option key={invoice.key} value={invoice.key}>
                            {invoice.name}
                          </option>
                        )
                      )}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="UID"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              )}
              {errorMessage && (
                <div className="max-w-96 text-red-500 text-xs text-right">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Cancelar Factura
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CancelIssueAPI;
