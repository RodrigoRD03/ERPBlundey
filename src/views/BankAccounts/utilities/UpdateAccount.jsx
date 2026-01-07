import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { TbAbc, TbNumber123 } from "react-icons/tb";

const UpdateAccount = () => {
  const { accountID } = useParams();
  const [dataAccount, setDataAccount] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getBankAccount(accountID).then((response) => {
      setDataAccount(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    bank: Yup.string().required("El nombre del banco es obligatorio."),
    account: Yup.string().required("El numero de cuenta obligatorio."),
    status: Yup.string().required("El estatus obligatorio."),
  });

  const handleUpdateeAccountClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: accountID,
        Banco: values.bank,
        NumeroCuenta: values.account,
        Estatus: values.status,
      };

      await requests.updateBankAccounts(object);
      // response && navigate("/Layout/BankAccounts");
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
          <b>Editar Cuenta</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Editar Cuenta</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Cuenta</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            ID: accountID,
            bank: dataAccount?.Banco,
            account: dataAccount?.NumeroCuenta,
            status: dataAccount?.Estatus,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateeAccountClick}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Nombre del banco"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="bank"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="bank"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Numero de la cuenta"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="account"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
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
                  data-text="Tipo de Moneda"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 border-white"
                    as="select"
                    name="status"
                  >
                    <option value="Activa">Activa</option>
                    <option value="Inactiva">Inactiva</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="status"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Actualizar Cuenta
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateAccount;
