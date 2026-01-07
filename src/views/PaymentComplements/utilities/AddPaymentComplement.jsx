import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AddPaymentForm from "./AddPaymentForm";
import { Callout, Spinner } from "@radix-ui/themes";
import { LuBadgeAlert } from "react-icons/lu";
import { TbCheck } from "react-icons/tb";
import PaymentsTable from "./PaymentsTable";
import requests from "./requests";
import { useEffect } from "react";
import * as Yup from "yup";

const AddPaymentComplement = () => {
  const [clientsData, setClientsData] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [generalData, setGeneralData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [disabledGeneral, setDisabledGeneral] = useState(false);
  const [sustitutesComplements, setSustitutesComplements] = useState([]);
  const [paymentsMethods, setPaymentsMethods] = useState([]);
  const [isLoader, setIsLoader] = useState(false);
  const navigate = useNavigate();

  const fetchClientsData = async () => {
    try {
      const data = await requests.getDataClients();
      setClientsData(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching clients data:", error);
    }
  };

  useEffect(() => {
    fetchClientsData();
  }, []);

  const validationSchema = Yup.object({
    client: Yup.string().required("El cliente es obligatorio"),
    dateCFDI: Yup.string().required("La fecha del CFDI es obligatoria"),
    substituteComplement: Yup.string().required(
      "El complemento a sustituir es obligatorio"
    ),
    dataComplementToSubstitute: Yup.string().when(
      "substituteComplement",
      (subValue, schema) => {
        return subValue === "Si"
          ? schema.required("El complemento a sustituir es obligatorio")
          : schema;
      }
    ),
  });

  const handleAddPayment = (paymentData) => {
    setPaymentsList([...paymentsList, paymentData]);
    console.log("Pago agregado:", paymentData);
  };

  const handleDeletePayment = (paymentId) => {
    console.log("Eliminar pago con ID:", paymentId);
    setPaymentsList(paymentsList.filter((payment) => payment.id !== paymentId));
  };

  const handleCreateGeneralData = async (values, { setSubmitting }) => {
    const generalDataObject = {
      client: values.client,
      dateCFDI: values.dateCFDI,
      substituteComplement: values.substituteComplement,
      dataComplementToSubstitute: values.dataComplementToSubstitute,
    };
    // console.log("Datos generales del complemento de pago:", generalDataObject);
    setGeneralData(generalDataObject);
    setIsVisible(true);
    setDisabledGeneral(true);
    setSubmitting(false);
  };

  const handleCreatePaymentComplement = async (values, { setSubmitting }) => {
    setIsLoader(true);
    const object = {
      FechaFromAPI: generalData.dateCFDI,
      ReceptorUID: generalData.client,
      Pagos: paymentsList,
      CfdiRelacionado: generalData.substituteComplement == "Si" ? generalData.dataComplementToSubstitute : "",
      EnviarCorreo: values.sendEmail,
    };

    console.log(object);

    const response = await requests.createPaymentComplement(object);
    console.log(response);
    if (response.Success != null) {
      navigate("/Layout/PaymentComplements");
    } else {
      setErrorMessage(response.Error.message.message);
    }
    setIsLoader(false);
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/PaymentComplements">Complementos de Pago</Link> /{" "}
          <b>Nuevo Complemento</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Complemento</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md mb-12">
        <Formik
          initialValues={{
            client: "",
            dateCFDI: "",
            substituteComplement: "No",
            dataComplementToSubstitute: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCreateGeneralData}
        >
          {({ isSubmitting, values }) => {
            useEffect(() => {
              const fetchData = async () => {
                if (values.client !== "") {
                  const response = await requests.getDatapaymentForms(
                    values.client
                  );
                  setPaymentsMethods(response.formasPago);
                  setPaymentData(response.cdfisRelacionados);
                  console.log(response);
                  if (response.complementosSustitutos.length !== 0) {
                    setIsDisabled(false);
                    setSustitutesComplements(response.complementosSustitutos);
                  }
                }
              };

              fetchData();
            }, [values.client]);
            return (
              <Form className="mt-2 flex flex-col gap-5 items-center">
                <div className="w-full ">
                  <p className="text-lg font">Datos Generales</p>
                  <div className="line-row" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {/* Cantidad */}
                  <div>
                    <label
                      className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                      data-text="Cliente"
                    >
                      <Field
                        className="w-full h-full outline-none border-2 border-white disabled:cursor-not-allowed"
                        as="select"
                        name="client"
                        disabled={disabledGeneral}
                      >
                        <option value="">Selecciona un cliente</option>
                        {clientsData.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                        {/* Map options here */}
                      </Field>
                    </label>
                    <ErrorMessage
                      name="client"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                      data-text="Fecha de CFDI"
                    >
                      <Field
                        as="select"
                        name="dateCFDI"
                        className="w-full h-full outline-none border-2 border-white disabled:cursor-not-allowed"
                        disabled={disabledGeneral}
                      >
                        <option value="">Selecciona una fecha</option>
                        <option value="0">Timbrar con fecha actual</option>
                        <option value="1">Timbrar con fecha de ayer</option>
                        <option value="2">
                          Timbrar con fecha de hace dos días
                        </option>
                        <option value="3">
                          Timbrar con fecha de hace tres días
                        </option>
                      </Field>
                    </label>
                    <ErrorMessage
                      name="dateCFDI"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                      data-text="¿Este complemento sustituye a otro?"
                    >
                      <Field
                        as="select"
                        name="substituteComplement"
                        className="w-full h-full outline-none border-2 border-white disabled:cursor-not-allowed"
                        disabled={disabledGeneral}
                      >
                        <option value="No">No</option>
                        <option value="Si">Sí</option>
                      </Field>
                    </label>
                    <ErrorMessage
                      name="substituteComplement"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                </div>
                {values.substituteComplement === "Si" && (
                  <div className="grid grid-cols-3 gap-4">
                    {/* Cantidad */}
                    <div>
                      <label
                        className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                        data-text="Complemento a sustituir"
                      >
                        <Field
                          className="w-full h-full outline-none border-2 border-white"
                          as="select"
                          name="dataComplementToSubstitute"
                          disabled={isDisabled}
                        >
                          <option value="">Seleccione el CFDI cancelado</option>
                          {sustitutesComplements.map((item, index) => (
                            <option key={index} value={item.value}>
                              {item.label}
                            </option>
                          ))}
                          {/* Map options here */}
                        </Field>
                      </label>
                      <ErrorMessage
                        name="dataComplementToSubstitute"
                        component="div"
                        className="text-red-500 text-xs text-right m-0"
                      />
                    </div>
                  </div>
                )}
                {paymentsMethods.length != 0 ? (
                  <div className="w-full flex flex-col justify-end gap-5">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex justify-center items-center gap-2 self-end px-7 py-2 bg-emerald-200 rounded-lg text-emerald-800 hover:bg-emerald-300 duration-200"
                    >
                      <span>
                        <TbCheck size={20} />
                      </span>
                      <p>Aceptar</p>
                    </button>
                  </div>
                ) : (
                  <div
                    disabled={isSubmitting}
                    className="w-32 h-12 flex justify-center items-center gap-2 self-end px-7 py-2 bg-zinc-200 rounded-lg text-zinc-800 hover:bg-zinc-300 duration-200"
                  >
                    <Spinner />
                  </div>
                )}
              </Form>
            );
          }}
        </Formik>
        {isVisible && (
          <div className="w-full flex flex-col gap-2">
            <p className="text-lg font">Agregar Pago</p>
            <div className="line-row" />
            <Callout.Root className="self-start flex" color="amber">
              <p className="self-start text-xs w-full flex gap-2 items-center">
                <LuBadgeAlert size={22} /> Por favor ingresa la información
                correspondiente al pago que deseas agregar, incluyendo los CFDI
                s relacionados, posteriormente haz clic en Agregar pago .
              </p>
            </Callout.Root>
            <AddPaymentForm
              paymentData={paymentData}
              paymentsMethods={paymentsMethods}
              onAddPayment={handleAddPayment}
            />
          </div>
        )}

        {paymentsList.length > 0 && (
          <PaymentsTable
            paymentsList={paymentsList}
            onDeletePayment={handleDeletePayment}
          />
        )}
        <Formik
          initialValues={{
            sendEmail: false,
          }}
          // validationSchema={validationSchema}
          onSubmit={handleCreatePaymentComplement}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center w-full items-start">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Adicional</p>
                <div>
                  <label htmlFor="sendEmail" className="flex gap-2">
                    <Field name="sendEmail">
                      {({ field }) => (
                        <input
                          className="checkbox"
                          {...field}
                          type="checkbox"
                          id="sendEmail"
                          checked={field.value}
                        />
                      )}
                    </Field>
                    Enviar por correo electrónico
                  </label>
                </div>
              </div>
              <div className="w-full flex justify-between ">
                <div className="flex flex-col gap-2">
                  <p>Concepto complemento</p>
                  <div className="w-full h-[2px] bg-sovetec-primary"></div>
                  <div className="w-full bg-zinc-200 grid grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-md">
                    {[
                      ["Clave producto o servicio", "84111506"],
                      ["Cantidad", "1"],
                      ["Clave Unidad", "ACT - Actividad"],
                      ["Descripción", "Pago"],
                      ["Precio unitario", "$ 0.00"],
                      ["Importe", "$ 0.00"],
                    ].map(([label, value], index) => (
                      <>
                        <p className="font-medium  text-zinc-700">{label}</p>
                        <p className=" text-zinc-900 ">{value}</p>
                      </>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p>Generar complemento</p>
                  <div className="w-full h-[2px] bg-sovetec-primary"></div>
                  <Callout.Root className="self-start flex" color="amber">
                    <p className="self-start text-sm max-w-124 flex gap-2 items-center ">
                      <span className="w-12">
                        <LuBadgeAlert size={22} />
                      </span>
                      Por favor verifica que los datos que ingresaste sean
                      correctos y posteriormente haz clic en Generar pago.
                    </p>
                  </Callout.Root>
                </div>
              </div>

              <div className="w-full flex flex-col justify-end gap-5">
                {isLoader ? (
                  <div className="w-32 h-12 flex justify-center items-center gap-2 self-end px-7 py-2 bg-sovetec-primary rounded-lg text-white">
                    <Spinner />
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex justify-center items-center gap-2 self-end px-10 py-3 bg-sovetec-primary rounded-lg text-white hover:bg-sovetec-secundary duration-200"
                  >
                    <p className="text-lg">Generar Pago</p>
                    <TbCheck size={25} />
                  </button>
                )}

                {errorMessage && (
                  <div className="text-red-500 text-sm self-end max-w-116 text-right">
                    {errorMessage}
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddPaymentComplement;
