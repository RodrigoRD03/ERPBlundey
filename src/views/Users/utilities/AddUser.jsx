import { useEffect, useState } from "react";
import requests from "./requests";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { TbKey, TbMail, TbPhone, TbUser } from "react-icons/tb";

const AddUser = () => {
  const [adminList, setAdminList] = useState([]);
  const [supervisorList, setSupervisorList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const navigate = useNavigate();
  // const [userID, setUserID] = useState("");

  useEffect(() => {
    requests.getAllUsers().then((response) => {
      setSupervisorList(
        response.filter((usuario) => usuario.Rol === "Supervisor")
      );
      setAdminList(
        response.filter((usuario) => usuario.Rol === "Administrador")
      );
    });
    requests.getAllRoles().then((response) => {
      setRolesList(response);
    });
  }, []);

  const handleAddUserClick = async (values, { setSubmitting }) => {
    try {
      const userObject = {
        NombreCompleto: `${values.abbreviation} ${values.name}`,
        Correo: values.email,
        Telefono: values.phone,
        Contrasena: values.password,
        role: values.role,
      };

      const userID = await requests.addNewUser(userObject);
      const updatedIDs = { UsuarioID: userID, RolID: values.role };
      const updatedUserRolID = await requests.addNewUserRol(updatedIDs);
      if (values.role !== "1") {
        const hierarchyObject = {
          UsuarioRolPadreID: values.boss,
          UsuarioRolHijoID: updatedUserRolID,
        };
        const response = await requests.addNewRolJerarquia(hierarchyObject);
        response && navigate("/Layout/Users");
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
          <Link to="/Layout/Users">Usuarios</Link> / <b>Nuevo Usuario</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Usuario</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Usuario</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            abbreviation: "Ing.",
            name: "",
            email: "",
            phone: "",
            role: "",
            password: "",
            boss: "",
          }}
          // validationSchema={validationSchema}
          onSubmit={handleAddUserClick}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div className="flex gap-4">
                <div>
                  <label className="inputs-placeholder w-22 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm">
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
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
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
                  data-text="Rol"
                >
                  <Field
                    className="w-full outline-none resize-none border-1 border-white"
                    as="select"
                    name="role"
                  >
                    <option value="">Seleccione un rol</option>´
                    {rolesList.map((role, index) => (
                      <option key={index} value={role.ID}>
                        {role.Nombre}
                      </option>
                    ))}
                  </Field>
                </label>
                <ErrorMessage
                  name="role"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {values.role == "2" && (
                <div>
                  <label
                    className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Jefe - Administrador"
                  >
                    <Field
                      className="w-full outline-none resize-none border-1 border-white"
                      as="select"
                      name="boss"
                    >
                      <option value="">Seleccione un Jefe</option>
                      {adminList.map((user, index) => (
                        <option key={index} value={user.ID}>
                          {user.UsuarioNombre}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="boss"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              )}
              {values.role > "2" && (
                <div>
                  <label
                    className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Jefe - Supervisor"
                  >
                    <Field
                      className="w-full outline-none resize-none border-1 border-white"
                      as="select"
                      name="boss"
                    >
                      <option value="">Seleccione un Jefe</option>
                      {supervisorList.map((user, index) => (
                        <option key={index} value={user.ID}>
                          {user.UsuarioNombre}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="boss"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              )}
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

export default AddUser;
