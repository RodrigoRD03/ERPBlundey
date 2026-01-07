import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import TransferTable from "./TransferTable";
import { useEffect } from "react";
import { TbPlus } from "react-icons/tb";
import RelatedCFDIsTable from "./RelatedCFDIsTable";
import * as Yup from "yup";

const AddPaymentForm = ({ paymentData, paymentsMethods, onAddPayment }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [relatedCFDIList, setRelatedCFDIList] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleDeleteCDFI = (id) => {
    setRelatedCFDIList(relatedCFDIList.filter((item) => item.id !== id));
  };

  const validationSchema = Yup.object({
    paymentDateTime: Yup.string().required(
      "La fecha y hora de pago es obligatoria"
    ),
    paymentMethod: Yup.string().required("La forma de pago es obligatoria"),
    paymentCurrency: Yup.string().required("La moneda de pago es obligatoria"),
  });

  return (
    <Formik
      initialValues={{
        paymentMethod: "",
        paymentCurrency: "",
        paymentDateTime: "",
        operationNumber: "",
        relatedCfdiDocumentId: "",
        relatedCfdiCurrency: "",
        relatedCfdiDocumentCurrency: "",
        installmentNumber: "",
        amountPaid: "",
        previousBalance: "",
        remainingBalance: "",
        taxObject: "02",
        uuid: "",
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        console.log(values);
        const paymentData = {
          id: crypto.randomUUID(),
          FechaPago: values.paymentDateTime,
          FormaDePagoP: values.paymentMethod,
          MonedaP: values.paymentCurrency,
          Monto: relatedCFDIList
            .reduce((total, cfdi) => total + Number(cfdi.ImportePagado), 0)
            .toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
          NumOperacion: values.operationNumber,
          DoctoRelacionado: relatedCFDIList,
        };
        onAddPayment(paymentData);
        setRelatedCFDIList([]);
        resetForm();
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => {
        useEffect(() => {
          if (values.relatedCfdiDocumentId !== "") {
            setFieldValue(
              "uuid",
              paymentData.find(
                (cfdi) => cfdi.UID === values.relatedCfdiDocumentId
              )?.UUID || ""
            );
            setIsDisabled(true);
            setIsVisible(true);
            setFieldValue(
              "previousBalance",
              paymentData.find(
                (cfdi) => cfdi.UID === values.relatedCfdiDocumentId
              )?.SaldoPendiente || ""
            );
            setFieldValue(
              "installmentNumber",
              paymentData.find(
                (cfdi) => cfdi.UID === values.relatedCfdiDocumentId
              )?.NumParcialidad || ""
            );
          }
          if (values.amountPaid !== "" && values.previousBalance !== "") {
            if (values.previousBalance - values.amountPaid < 0) {
              setFieldValue("remainingBalance", 0);
            } else {
              setFieldValue(
                "remainingBalance",
                (values.previousBalance - values.amountPaid).toFixed(6)
              );
            }
          }
        }, [
          values.amountPaid,
          values.previousBalance,
          setFieldValue,
          values.relatedCfdiDocumentId,
        ]);

        return (
          <Form className="mt-2 flex flex-col gap-5 items-center p-4 border border-zinc-300 rounded-md w-full">
            <div className="grid grid-cols-3 gap-4 self-start">
              {/* Cantidad */}
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha de Pago y Hora de Pago"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    type="datetime-local"
                    name="paymentDateTime"
                    placeholder="Descripción del Anticipo"
                  />
                </label>
                <ErrorMessage
                  name="paymentDateTime"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  data-text="Forma de Pago"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    as="select"
                    name="paymentMethod"
                  >
                    <option value="">Selecciona una forma de pago</option>
                    {paymentsMethods.map((item, index) => (
                      <option key={index} value={item.key}>
                        {item.name}
                      </option>
                    ))}
                    {/* Map options here */}
                  </Field>
                </label>
                <ErrorMessage
                  name="paymentMethod"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  data-text="Moneda de Pago"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    as="select"
                    name="paymentCurrency"
                  >
                    <option value="">Selecciona el tipo de moneda</option>
                    <option value="MXN">MXN</option>
                    <option value="USD">USD</option>
                    {/* Map options here */}
                  </Field>
                </label>
                <ErrorMessage
                  name="paymentCurrency"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  data-text="Número de Operación"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    type="text"
                    name="operationNumber"
                    placeholder="Número de Operación"
                  />
                </label>
                <ErrorMessage
                  name="operationNumber"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
            </div>

            {/* ----------------------------------- CFDIs Relacionados -------------------------- */}
            <div className="w-full flex flex-col gap-4">
              <div>
                <p className="text-lg font">CFDIs Relacionados</p>
                <div className="line-row" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Folio del Documento"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      as="select"
                      name="relatedCfdiDocumentId"
                    >
                      <option value="">Selecciona un Folio</option>
                      {paymentData &&
                        paymentData.map((cfdi, index) => (
                          <option key={index} value={cfdi.UID}>
                            {cfdi.Folio}
                          </option>
                        ))}
                      {/* Map options here */}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="relatedCfdiDocumentId"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                {isVisible && (
                  <>
                    <div className="bg-zinc-200 rounded-lg flex justify-center items-center w-96">
                      {" "}
                      <p>
                        Total: $
                        {paymentData
                          .find(
                            (cfdi) => cfdi.UID === values.relatedCfdiDocumentId
                          )
                          ?.Total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }) || ""}
                      </p>
                    </div>
                    <div className="bg-zinc-200 rounded-lg flex justify-center items-center w-96">
                      <p>
                        Fecha de Timbrado:{" "}
                        {paymentData
                          .find(
                            (cfdi) => cfdi.UID === values.relatedCfdiDocumentId
                          )
                          ?.FechaTimbrado.toLocaleString("es-MX", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }) || ""}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <Field
                className="w-full h-full outline-none border-2 border-white hidden"
                type="text"
                name="uuid"
              ></Field>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Moneda de Documento"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      as="select"
                      name="relatedCfdiDocumentCurrency"
                    >
                      <option value="">Selecciona el tipo de moneda</option>
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                      {/* Map options here */}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="relatedCfdiDocumentCurrency"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Número de Parcialidad"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white disabled:cursor-not-allowed"
                      type="number"
                      name="installmentNumber"
                      placeholder="Número de Parcialidad"
                      disabled={isDisabled}
                    />
                  </label>
                  <ErrorMessage
                    name="installmentNumber"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Monto Pagado"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      type="number"
                      name="amountPaid"
                      placeholder="Monto Pagado"
                    />
                  </label>
                  <ErrorMessage
                    name="amountPaid"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Saldo Anterior"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white disabled:cursor-not-allowed"
                      type="number"
                      name="previousBalance"
                      placeholder="Saldo Anterior"
                      disabled={isDisabled}
                    />
                  </label>
                  <ErrorMessage
                    name="previousBalance"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Saldo Pendiente"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white disabled:cursor-not-allowed"
                      type="number"
                      name="remainingBalance"
                      placeholder="Saldo pendiente"
                      disabled={isDisabled}
                    />
                  </label>
                  <ErrorMessage
                    name="remainingBalance"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Objeto de Impuesto"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      as="select"
                      name="taxObject"
                    >
                      <option value="">Seleccionar</option>
                      <option value="01">No objeto de impuesto</option>
                      <option value="02">Sí objeto de impuesto</option>
                      <option value="03">
                        Sí objeto de impuesto y no obligado al desglose
                      </option>
                      <option value="04">
                        Sí objeto de impuesto y no causa impuesto
                      </option>
                      {/* Map options here */}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="taxObject"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              </div>
              {values.amountPaid && (
                <div className="w-full flex flex-col items-center">
                  <p className=" text-zinc-500">Traslados</p>
                  <TransferTable
                    transferData={[
                      {
                        tax: "IVA",
                        base: values.amountPaid / 1.16,
                        factor: "Tasa",
                        rate: 0.16,
                        import: values.amountPaid - values.amountPaid / 1.16,
                      },
                    ]}
                  />
                </div>
              )}
              <div className="w-full flex flex-col justify-end gap-5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  className="flex justify-center items-center gap-2 self-end px-7 py-2 bg-violet-200 rounded-lg text-violet-700 hover:bg-violet-300 duration-200"
                  onClick={() => {
                    if (
                      values.relatedCfdiDocumentId !== "" &&
                      values.installmentNumber !== "" &&
                      values.amountPaid !== "" &&
                      values.previousBalance !== "" &&
                      values.relatedCfdiDocumentCurrency !== "" &&
                      values.taxObject !== ""
                    ) {
                      const cfdiData = {
                        id: crypto.randomUUID(),
                        uuid: values.uuid,
                        FacturaUID: values.uuid,
                        MonedaDR: values.relatedCfdiDocumentCurrency,
                        NumParcialidad: values.installmentNumber,
                        ImpSaldoAnt: values.previousBalance,
                        ImportePagado: values.amountPaid,
                        ImpSaldoInsoluto: values.remainingBalance,
                        taxObject: values.taxObject,
                      };

                      setRelatedCFDIList([...relatedCFDIList, cfdiData]);

                      setFieldValue("relatedCfdiDocumentId", "");
                      setFieldValue("relatedCfdiDocumentCurrency", "");
                      setFieldValue("installmentNumber", "");
                      setFieldValue("amountPaid", "");
                      setFieldValue("previousBalance", "");
                      setFieldValue("remainingBalance", "");
                      setFieldValue("taxObject", "02");
                    }
                  }}
                >
                  <span>
                    <TbPlus size={20} />
                  </span>
                  <p>Agregar CFDI</p>
                </button>
                {errorMessage && (
                  <div className="text-red-500 text-sm self-end max-w-116 text-right">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
            {relatedCFDIList.length > 0 && (
              <RelatedCFDIsTable
                relatedCFDIsList={relatedCFDIList}
                onDeleteCDFI={handleDeleteCDFI}
              />
            )}
            {/* ----------------------------------- End CFDIs Relacionados -------------------------- */}

            <div className="line-row" />
            <div className="w-full flex flex-col justify-end gap-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center gap-2 self-end px-7 py-2 bg-sovetec-sixty rounded-lg text-sovetec-secundary hover:bg-sovetec-thirty hover:text-white duration-200"
              >
                <span>
                  <TbPlus size={20} />
                </span>
                <p>Agregar Pago</p>
              </button>
              {errorMessage && (
                <div className="text-red-500 text-sm self-end max-w-116 text-right">
                  {errorMessage}
                </div>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default AddPaymentForm;
