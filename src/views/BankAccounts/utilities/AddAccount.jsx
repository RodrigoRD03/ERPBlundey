import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { TbAbc, TbNumber123 } from "react-icons/tb";
import requests from "./requests";

const AddAccount = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    bank: Yup.string().required("El nombre del banco es obligatorio."),
    account: Yup.string().required("El numero de cuenta obligatorio."),
    balance: Yup.string().required("El saldo es obligatorio."),
    typeCurrency: Yup.string().required("El tipo de moneda es obligatorio."),
  });

  const handleCreateAccountClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Banco: values.bank,
        NumeroCuenta: values.account,
        Saldo: values.balance,
        Tipo: values.typeCurrency,
      };

      const response = await requests.insertBankAccount(object);
      response && navigate("/Layout/BankAccounts");
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
          <b>Nueva Cuenta</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nueva Cuenta</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Cuenta</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            bank: "",
            account: "",
            balance: "",
            typeCurrency: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCreateAccountClick}
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
                    name="typeCurrency"
                  >
                    <option>Seleccione una opcion</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Dolar">Dolar</option>
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
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
                  data-text="Saldo"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="balance"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="balance"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div className="w-full flex justify-end gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Agregar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddAccount;
