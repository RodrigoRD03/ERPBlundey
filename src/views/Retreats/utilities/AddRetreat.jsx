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

const AddRetreat = () => {
  const [nationalBankAccounts, setNationalBankAccounts] = useState([]);
  const [dollarBankAccounts, setDollarBankAccounts] = useState([]);
  const [conceptsNational, setConceptsNational] = useState([]);
  const [conceptsDollar, setConceptsDollar] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getBankAccounts("Nacional").then((response) => {
      setNationalBankAccounts(response);
    });
    requests.getBankAccounts("Dolar").then((response) => {

      setDollarBankAccounts(response);
    });
    requests.getConceptsNational().then((response) => {
      setConceptsNational(response);
    });
    requests.getConceptsDollar().then((response) => {
      setConceptsDollar(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    date: Yup.string().required("La fecha es obligatoria"),
    type: Yup.string()
      .oneOf(["Nacional", "Dolar"], "Seleccione un tipo válido")
      .required("El tipo es obligatorio"),
    account: Yup.string().required("La cuenta es obligatoria"),
    document: Yup.string()
      .oneOf(
        ["Transferecia", "Cargo", "Check"],
        "Seleccione un documento válido"
      )
      .required("El tipo de acción es obligatorio"),
    numberCheck: Yup.string().when("document", {
      is: (val) => val === "Check",
      then: (schema) =>
        schema
          .required("El número de cheque es obligatorio")
          .matches(/^\d+$/, "Debe ser un número válido"),
      otherwise: (schema) => schema.notRequired(),
    }),
    remarks: Yup.string().max(100, "Máximo 100 caracteres"),
    quantity: Yup.number()
      .typeError("Debe ser un número")
      .positive("Debe ser mayor a 0")
      .required("La cantidad es obligatoria"),
  });

  const handleInsertRetreatClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Documento:
          values.document == "Check"
            ? `${values.document}#${values.numberCheck}`
            : values.document,
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
        const response = await requests.insertRetreatNational(object);

        if (response == true) {
          navigate("/Layout/Retreats");
        }
      } else if (values.type === "Dolar") {
        const response = await requests.insertRetreatDollar(object);

        if (response == true) {
          navigate("/Layout/Retreats");
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
          <Link to="/Layout/Retreats">Retiros</Link> / <b>Nuevo Retiro</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Retiro</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Retiro</p>
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
            numberCheck: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleInsertRetreatClick}
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
                        <option value="Transferecia">Transferecia</option>
                        <option value="Cargo">Cargo</option>
                        <option value="Check">Cheque</option>
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
                  {values.document == "Check" && (
                    <div>
                      <label
                        className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                        data-text="Número de Cheque"
                      >
                        <Field
                          className="w-full h-full outline-none"
                          type="number"
                          name="numberCheck"
                        />
                        <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                          <TbNumber size="20" />
                        </span>
                      </label>
                      <ErrorMessage
                        name="numberCheck"
                        component="div"
                        className="text-red-500 text-xs text-right m-0"
                      />
                    </div>
                  )}
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
                      data-text="Cantidad a retirar"
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
                Añadir Retiro
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddRetreat;
