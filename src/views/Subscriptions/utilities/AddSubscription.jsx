import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { TbCalendar, TbEyeSearch, TbNumber } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineDocumentCurrencyDollar } from "react-icons/hi2";
import requests from "./requests";
import { RiExchangeDollarLine } from "react-icons/ri";
import { BsBank } from "react-icons/bs";
import { MdCreditCard } from "react-icons/md";
import * as Yup from "yup";

const AddSubscription = () => {
  const [nationalBankAccounts, setNationalBankAccounts] = useState([]);
  const [dollarBankAccounts, setDollarBankAccounts] = useState([]);
  const [conceptsNational, setConceptsNational] = useState([]);
  const [conceptsDollar, setConceptsDollar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getBankAccountsSelect("Nacional").then((response) => {
      setNationalBankAccounts(response);
    });
    requests.getBankAccountsSelect("Dolar").then((response) => {
      setDollarBankAccounts(response);
    });
    requests.paymentConceptSelectNational().then((response) => {
      setConceptsNational(response);
    });
    requests.paymentConceptSelectDolar().then((response) => {
      setConceptsDollar(response);
    });
  }, []);

  const validationSchema = Yup.object({
    date: Yup.string().required("Campo requerido"),
    type: Yup.string().required("Campo requerido"),
    account: Yup.string().required("Campo requerido"),
    document: Yup.string().required("Campo requerido"),
    quantity: Yup.number()
      .positive("Debe ser positivo")
      .required("Campo requerido"),
    remarks: Yup.string().required("Campo requerido"),
  });

  const handleInsertSubscriptionClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Documento: values.document,
        Concepto:
          values.concept != "Otro"
            ? values.concept.toUpperCase()
            : values.otherConcept.toUpperCase(),
        Observaciones: values.remarks,
        Abono: values.quantity,
        CuentaBancariaID: values.account,
        Fecha: values.date,
      };

      if (values.type === "Nacional") {
        const response = await requests.insertPaymentNational(object);

        if (response == true) {
          navigate("/Layout/Subscriptions");
        }
      } else if (values.type === "Dolar") {
        const response = await requests.insertPaymentDollar(object);

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
          <Link to="/Layout/Subscriptions">Abonos</Link> / <b>Nuevo Abono</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Abono</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Abono</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            date: "",
            type: "",
            account: "",
            document: "",
            concept: "",
            remarks: "",
            quantity: "",
            otherConcept: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertSubscriptionClick}
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
                  data-text="Tipo"
                >
                  <Field
                    className="w-full h-full outline-none border-2 border-white"
                    as="select"
                    name="type"
                  >
                    <option>Seleccione una opción</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Dolar">Dolar</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <MdCreditCard size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {values.type != "" && (
                <>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Cuenta"
                    >
                      <Field
                        className="w-full h-full outline-none border-2 border-white"
                        as="select"
                        name="account"
                      >
                        <option>Seleccione una opción</option>
                        {values.type === "Nacional"
                          ? nationalBankAccounts.map((account, index) => (
                              <option key={index} value={account.value}>
                                {account.label}
                              </option>
                            ))
                          : values.type === "Dolar"
                          ? dollarBankAccounts.map((account, index) => (
                              <option key={index} value={account.value}>
                                {account.label}
                              </option>
                            ))
                          : null}
                      </Field>
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <BsBank size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="account"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
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
                        <option value="Transferencia">Transferencia</option>
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
                        className="w-full h-full outline-none border-2 border-white"
                        as="select"
                        name="concept"
                      >
                        <option>Seleccione una opción</option>
                        {values.type === "Nacional"
                          ? conceptsNational.map((account, index) => (
                              <option key={index} value={account.label}>
                                {account.label}
                              </option>
                            ))
                          : conceptsDollar.map((account, index) => (
                              <option key={index} value={account.label}>
                                {account.label}
                              </option>
                            ))}
                      </Field>
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
                  {values.concept == "Otro" && (
                    <div>
                      <label
                        className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                        data-text="Concepto"
                      >
                        <Field
                          className="w-full h-full outline-none"
                          type="text"
                          name="otherConcept"
                        />
                        <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                          <HiOutlineDocumentCurrencyDollar size="20" />
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
                      data-text="Cantidad del Abono"
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
                </>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Añadir Abono
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddSubscription;
