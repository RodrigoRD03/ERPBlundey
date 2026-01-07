import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Waves, LargeLogo } from "../../constants";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import * as Yup from "yup";
import { ErrorMessage, Field, Formik, Form } from "formik";
import { MdOutlineEmail } from "react-icons/md";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { FiLogIn } from "react-icons/fi";
import { Spinner } from "@radix-ui/themes";

const Login = () => {
  const [viewPassword, setViewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const { setUserData } = useUser();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("El nombre de usuario es obligatorio."),
    password: Yup.string().required("La contraseña es obligatoria."),
  });

  const handleLoginClick = async (values, { setSubmitting }) => {
    try {
      setLoader(true);

      const object = {
        Correo: values.email,
        Contrasena: values.password,
      };

      const response = await requests.Login(object);

      if (response != null) {
        const accessToken = response.AccessToken;
        const refreshToken = response.RefreshToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUserData(response);

        navigate("/Layout");
      } else {
        setLoader(false);
        setErrorMessage("Correo o Contraseña incorrectos.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center font-display">
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
            ¡Bienvenido de Vuelta!
          </p>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLoginClick}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col gap-5 m-5 px-2">
                <p className="text-end font-semibold text-lg">Inicia Sesión</p>
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
                <div>
                  <label
                    className="inputs-placeholder relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Contraseña"
                  >
                    <Field
                      className="w-full h-full outline-none"
                      type={!viewPassword ? "password" : "text"}
                      name="password"
                    />
                    <span
                      className="size-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary cursor-pointer"
                      onClick={() => setViewPassword(!viewPassword)}
                    >
                      {!viewPassword ? (
                        <LuEye size="20" />
                      ) : (
                        <LuEyeClosed size="20" />
                      )}
                    </span>
                  </label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                  <Link
                    to="/ForgotPassword"
                    className="text-sovetec-primary text-xs flex justify-end mt-1"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
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
                    {!loader ? (
                      <>
                        Entrar
                        <span>
                          <FiLogIn size={20} />
                        </span>
                      </>
                    ) : (
                      <Spinner />
                    )}
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

export default Login;
