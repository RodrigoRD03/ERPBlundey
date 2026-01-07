import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import { MdOutlineEmail, MdOutlineLockReset } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { Waves, LargeLogo } from "../../constants";
import requests from "./utilities/requests";
import * as Yup from "yup";
import { useUser } from "../../Contexts/UserContext";

const ForgotPassword = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { setUserData } = useUser();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("El nombre de usuario es obligatorio."),
  });

  const handleRecoveredPasswordClick = async (values, { setSubmitting }) => {
    try {
      const response = await requests.recoverPassword(values.email);

        if (response != null) {
          const accessToken = response.AccessToken;
          const refreshToken = response.RefreshToken;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          setUserData(response);

          navigate("/Login");
        } else {
          setErrorMessage("Contraseña incorrectos.");
        }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center">
      <div className="w-full h-screen">
        <img className="h-full" src={Waves} alt="" />
      </div>
      <div className="absolute right-0 w-6/12 flex justify-center items-center">
        <div className="w-lg h-[550px] bg-white flex flex-col justify-center  shadow-lg rounded-md">
          <div className="m-5 px-4">
            <img src={LargeLogo} alt="" />
          </div>
          <div className="line-row" />
          <p className="text-end font-bold text-2xl mx-6 mt-4">
            Recupera tu contraseña
          </p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleRecoveredPasswordClick}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-5 m-5 px-2">
                <p className="text-end font-semibold text-normal text-zinc-500">
                  Ingresa tu Correo Electrónico
                </p>
                <div>
                  <label
                    className="inputs-placeholder relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Correo Electrónico"
                  >
                    <Field
                      className="w-full h-full outline-none"
                      type="text"
                      name="email"
                    />
                    <span className="size-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <MdOutlineEmail size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                {errorMessage && (
                  <p className="text-red-600 text-xs text-end">
                    {errorMessage}
                  </p>
                )}
                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-48 h-12 bg-sovetec-primary flex justify-center items-center gap-2 rounded-sm text-white font-semibold cursor-pointer duration-75 hover:bg-sovetec-secundary"
                  >
                    Recuperar
                    <span>
                      <MdOutlineLockReset size={20} />
                    </span>
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
