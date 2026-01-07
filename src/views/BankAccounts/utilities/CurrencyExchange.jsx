import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import requests from "./requests";
import { TbAbc, TbNumber123 } from "react-icons/tb";
import * as Yup from "yup";

const CurrencyExchange = () => {
  const [nationalAccounts, setNationalAccounts] = useState([]);
  const [dollarAccounts, setDollarAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getBankAccountsSelect("Nacional").then((response) => {
      setNationalAccounts(response);
    });
    requests.getBankAccountsSelect("Dolar").then((response) => {
      setDollarAccounts(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    typeCurrency: Yup.string().required("El tipo de moneda es obligatorio."),
    nationalAccount: Yup.string().required(
      "La cuenta nacional es obligatoria."
    ),
    dollarAccount: Yup.string().required(
      "La cuenta en dólares es obligatoria."
    ),
    concept: Yup.string()
      .required("El concepto es obligatorio.")
      .min(3, "El concepto debe tener al menos 3 caracteres."),
    amount: Yup.number()
      .typeError("La cantidad debe ser un número.")
      .positive("La cantidad debe ser mayor que cero.")
      .required("La cantidad es obligatoria."),
    exchangeRate: Yup.number()
      .typeError("La tasa debe ser un número.")
      .positive("La tasa debe ser mayor que cero.")
      .required("La tasa de cambio es obligatoria."),
  });

  const handleCurrencyExchangeClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        CuentaBancariaNacionalID: values.nationalAccount,
        CuentaBancariaDolarID: values.dollarAccount,
        Tipo: values.typeCurrency, //Si es de dolar a peso tipo = 1 si es de peso a dolar = 2
        Concepto: values.concept,
        CantidadDolares: values.amount,
        TasaCambio: values.exchangeRate,
      };
      
      const response = await requests.addCurrencyExchange(object);
      response == null && navigate("/Layout/BankAccounts");
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
          <Link to="/Layout/BankAccounts">Cuentas Bancarias</Link> /{" "}
          <b>Cambio de Divisas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Cambio de Divisas</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Cambio.</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            typeCurrency: "",
            nationalAccount: "",
            dollarAccount: "",
            concept: "",
            amount: "",
            exchangeRate: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCurrencyExchangeClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tipo de Cambio"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white"
                    as="select"
                    name="typeCurrency"
                  >
                    <option value="1">Dolar a Nacional</option>
                    <option value="2">Nacional a Dolar</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <PiCurrencyCircleDollarBold size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="typeCurrency"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white"
                    as="select"
                    name="nationalAccount"
                  >
                    <option>Seleccione la cuenta nacional</option>
                    {nationalAccounts.map((account, index) => (
                      <option key={index} value={account.value}>
                        {account.label}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <PiCurrencyCircleDollarBold size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="nationalAccount"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white"
                    as="select"
                    name="dollarAccount"
                  >
                    <option>Seleccione la cuenta de dolar</option>
                    {dollarAccounts.map((account, index) => (
                      <option key={index} value={account.value}>
                        {account.label}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <PiCurrencyCircleDollarBold size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="dollarAccount"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Concepto (casa de moneda)"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="concept"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
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
                  data-text="Cantidad de dolares"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="amount"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="amount"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tasa de cambio"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="exchangeRate"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="exchangeRate"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Agregar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CurrencyExchange;
