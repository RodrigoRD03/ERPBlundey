import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TbKey, TbMail, TbPhone, TbUser } from "react-icons/tb";

const UpdateUser = () => {
  const [userData, setUserData] = useState({}); // ⬅ Cambié de `[]` a `{}`.
  const navigate = useNavigate();
  const { userID } = useParams();

  useEffect(() => {
    if (userID) {
      requests.getUser(userID).then((response) => {
        setUserData(response || {}); // ⬅ Evita `null` o `undefined`.
      });
    }
  }, [userID]); // ⬅ Se agregó la dependencia.

  const handleUpdateUserClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: userData.ID,
        NombreCompleto: `${values.abbreviation} ${values.name}`,
        Correo: values.email,
        Telefono: values.phone,
        Contrasena: values.password,
      };

      const response = await requests.updateUser(object);
      response && navigate("/Layout/Users");
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
          <Link to="/Layout/Users">Usuarios</Link> / <b>Actualizar Usuario</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Actualizar Usuario</p>
        <div className="line-row" />
        <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
          <p className="text-lg">Datos del Usuario</p>
          <div className="line-row" />
          {userData?.NombreCompleto ? ( // ⬅ Evita renderizar Formik antes de tener datos.
            <Formik
              initialValues={{
                abbreviation: userData?.NombreCompleto?.split(".")[0] + ".",
                name: userData?.NombreCompleto?.split(".")[1]?.trim() || "",
                email: userData?.Correo || "",
                phone: userData?.Telefono || "",
                password: userData?.Contrasena || "",
              }}
              onSubmit={handleUpdateUserClick}
              enableReinitialize
            >
              {({ isSubmitting }) => (
                <Form className="mt-2 flex flex-col gap-5 items-center">
                  <div className="flex gap-4">
                    <div>
                      <label className="inputs-placeholder w-22 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm">
                        <Field
                          className="w-full outline-none resize-none border-1 border-white"
                          as="select"
                          name="abbreviation"
                        >
                          <option value="Ing.">Ing.</option>
                          <option value="Lic.">Lic.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Dra.">Dra.</option>
                          <option value="Tec.">Tec.</option>
                          <option value="Sr.">Sr.</option>
                          <option value="Sra.">Sra.</option>
                        </Field>
                      </label>
                      <ErrorMessage
                        name="abbreviation"
                        component="div"
                        className="text-red-500 text-xs text-right m-0"
                      />
                    </div>
                    <div>
                      <label
                        className="inputs-placeholder w-70 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                        data-text="Nombre"
                      >
                        <Field
                          className="w-full outline-none resize-none"
                          type="text"
                          name="name"
                        />
                        <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                          <TbUser size="20" />
                        </span>
                      </label>
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-xs text-right m-0"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Correo Electronico"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="text"
                        name="email"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbMail size="20" />
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
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Telefono"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="number"
                        name="phone"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbPhone size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Contraseña"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="text"
                        name="password"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbKey size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div className="w-full flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                    >
                      Actualizar
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <p className="text-center text-gray-500">Cargando datos...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
