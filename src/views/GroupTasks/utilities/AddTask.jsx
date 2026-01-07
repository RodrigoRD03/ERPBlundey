import { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import requests from "./requests";
import {
  TbAbc,
  TbFileTypePdf,
  TbTextCaption,
  TbTrash,
  TbUser,
} from "react-icons/tb";
import { useUser } from "../../../Contexts/UserContext";
import * as Yup from "yup";

const AddTask = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getListUsers(userData.ID).then((response) => {
      setAllUsers(response);
      setUsersList(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("El título es obligatorio"),
    description: Yup.string().required("La descripción es obligatoria"),
  });

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);

    for (const file of selectedFiles) {
      const base64 = await convertToBase64(file);
      const fileData = {
        id: Date.now().toString() + Math.random().toString(36).substring(2),
        Nombre: file.name.replace(/\.pdf$/i, ""),
        Archivo: base64,
      };

      setFiles((prev) => [...prev, fileData]);
    }

    // Limpiar el input para permitir subir el mismo archivo de nuevo si se desea
    event.target.value = "";
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleRemoveFile = (id) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const handleSelectChange = (e) => {
    const selectedValue = parseInt(e.target.value);

    if (!selectedUsers.includes(selectedValue)) {
      setSelectedUsers((prev) => [...prev, selectedValue]);

      setUsersList((prev) => prev.filter((u) => u.value !== selectedValue));
    }

    e.target.value = "";
  };

  const handleAddGroupTaskClick = async (values, { setSubmitting }) => {
    try {
      const response = await requests.addNewGroupTask({
        Titulo: values.title,
        Descripcion: values.description,
        Importancia: "Alta",
      });

      const taskID = response;

      const listUser = selectedUsers.concat(userData.ID);

      listUser.map(async (user) => {
        const group = await requests.addPeopleGroupTask({
          UsuarioID: parseInt(user),
          ActividadesCompartidasID: taskID,
        });
      });

      files.map(async (file) => {
        const document = await requests.addFilesGroupTask({
          Archivo: file.Archivo,
          NombreArchivo: file.Nombre,
          ActividadesCompartidasID: taskID,
        });
      });

      if (response) {
        navigate("/Layout/GroupTasks");
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
          <Link to="/Layout/GroupTasks">Tareas Compartidas</Link> /{" "}
          <b>Nueva Tarea</b>
        </p>
        <p className="text-lg font-bold">Nueva Tarea</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la tarea</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            title: "",
            description: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, formikHelpers) => {
            if (selectedUsers.length === 0) {
              setErrorMessage("Debe seleccionar al menos un usuario.");
              formikHelpers.setSubmitting(false);
              return;
            }

            handleAddGroupTaskClick(values, formikHelpers);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Titulo"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="title"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbTextCaption size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              <div>
                <label
                  className="relative inputs-placeholder w-96 h-36 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Descripción"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    as="textarea"
                    name="description"
                  />
                  <span className="min-w-10 h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              <div>
                <label
                  className="relative inputs-placeholder w-96 h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Usuarios"
                >
                  <select
                    className="w-full outline-none resize-none h-full border-2 border-white"
                    onChange={handleSelectChange}
                    defaultValue=""
                  >
                    <option disabled value="">
                      Seleccione los usuarios
                    </option>
                    {usersList.map((user) => (
                      <option key={user.ID} value={user.value}>
                        {user.label}
                      </option>
                    ))}
                  </select>
                  <span className=" min-w-10 h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbUser size="20" />
                  </span>
                </label>
              </div>

              {selectedUsers.length > 0 && (
                <div className="text-sm text-zinc-700">
                  <p className="font-semibold">Usuarios seleccionados:</p>
                  <div className="flex flex-col gap-2 p-2">
                    {selectedUsers.map((userId, index) => {
                      const user = allUsers.find((u) => u.value === userId);
                      return (
                        <div
                          key={index}
                          className="group bg-zinc-100 px-2 py-1 rounded hover:bg-red-200 cursor-pointer flex justify-between"
                          onClick={() => {
                            setSelectedUsers((prev) =>
                              prev.filter((id) => id !== userId)
                            );

                            const userToRestore = allUsers.find(
                              (u) => u.value === userId
                            );
                            if (userToRestore) {
                              setUsersList((prev) => [...prev, userToRestore]);
                            }
                          }}
                        >
                          <p>{user?.label || "Usuario no encontrado"}</p>
                          <span className="text-zinc-100 group-hover:text-red-500">
                            <TbTrash size={20} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="w-full">
                <label className="w-76 border border-zinc-300 border-dashed flex p-2 rounded-md items-center gap-2 hover:bg-zinc-200 cursor-pointer">
                  <input
                    name="pdf"
                    className="hidden"
                    type="file"
                    accept=".pdf"
                    multiple
                    onChange={handleFileChange}
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbFileTypePdf size="20" />
                  </span>
                  <p className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
                    Selecciona archivos PDF
                  </p>
                </label>
                <ErrorMessage
                  name="pdf"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              {files.length > 0 && (
                <div className="w-full max-h-36 overflow-y-scroll text-sm p-1 border border-dashed border-zinc-300 rounded flex flex-col gap-1">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="bg-zinc-100 flex justify-between items-center p-2 rounded"
                    >
                      <span className="truncate max-w-[200px]">
                        {file.Nombre}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-red-500 text-xs hover:underline"
                      >
                        <TbTrash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {errorMessage && (
                <div className="text-red-500 text-xs text-right m-0">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Añadir Tarea
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddTask;
