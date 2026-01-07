import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@radix-ui/themes";
import {
  TbAbc,
  TbCheck,
  TbChecklist,
  TbFileAnalytics,
  TbFileUpload,
  TbReload,
} from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { ErrorMessage, Field, Form, Formik } from "formik";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import * as Yup from "yup";
import Files from "./utilities/Files";
import UploadFiles from "./utilities/UploadFiles";

const Tasks = ({ openOption, setOpenOption }) => {
  const { userData } = useUser();
  const [tasksHigh, setTasksHigh] = useState([]);
  const [tasksHalf, setTasksHalf] = useState([]);
  const [tasksLow, setTasksLow] = useState([]);
  const [uploadFiles, setUploadFiles] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    requests.getTasks(userData.ID).then((response) => {
      setTasksHigh(response.filter((item) => item.Importancia == "Alta"));
      setTasksHalf(response.filter((item) => item.Importancia == "Media"));
      setTasksLow(response.filter((item) => item.Importancia == "Baja"));
    });
  }, []);

  useEffect(() => {
    if (openOption == "Agenda") {
      setOpen(false);
    }
  }, [openOption]);

  const validationSchema = Yup.object().shape({
    task: Yup.string().required("La descripcion es obligatora."),
    importance: Yup.string().required("La importancia es obligatoria."),
  });

  const handleInsertTaskClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        UsuarioID: userData.ID,
        Contenido: values.task,
        Importancia: values.importance,
      };

      await requests.insertTasks(object);

      await requests.getTasks(userData.ID).then((response) => {
        setTasksHigh(response.filter((item) => item.Importancia == "Alta"));
        setTasksHalf(response.filter((item) => item.Importancia == "Media"));
        setTasksLow(response.filter((item) => item.Importancia == "Baja"));
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const completeTaskActivity = async (ID) => {
    const response = await requests.completeTask(ID);
    if (response) {
      await requests.getTasks(userData.ID).then((response) => {
        setTasksHigh(response.filter((item) => item.Importancia == "Alta"));
        setTasksHalf(response.filter((item) => item.Importancia == "Media"));
        setTasksLow(response.filter((item) => item.Importancia == "Baja"));
      });
    }
  };

  return (
    <div className="absolute top-0 right-20 bg-white flex justify-center items-center shadow-lg overflow-hidden rounded-b-lg z-30">
      {!open && openOption != "Tasks" ? (
        <div
          className="w-20 h-12 flex justify-center items-center bg-orange-400 text-white cursor-pointer"
          onClick={() => {
            setOpen(true);
            setOpenOption("Tasks");
          }}
        >
          <TbChecklist size={20} />
        </div>
      ) : (
        <div className="w-[500px]  relative z-30">
          <div
            className="w-full h-12 flex justify-center items-center bg-orange-400 hover:bg-orange-600 text-white cursor-pointer"
            onClick={() => {
              setOpen(false);
              setOpenOption(null);
            }}
          >
            <TbChecklist size={20} />
          </div>
          <div className="h-10 flex text-black gap-[1px] bg-zinc-300 border border-zinc-300">
            <p className="w-full flex justify-center items-center bg-white font-semibold">
              Tareas Individuales
            </p>
          </div>
          <div className="min-h-[400px] border border-transparent border-b-zinc-300 border-r-zinc-300 border-l-zinc-300 rounded-b-lg p-2 flex flex-col gap-2  max-h-[600px] overflow-y-scroll  scroll-task">
            <Formik
              initialValues={{
                task: "",
                importance: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleInsertTaskClick}
            >
              {({ isSubmitting }) => (
                <Form className="w-full border border-dashed border-zinc-300 p-2 rounded-lg flex flex-col gap-2">
                  <p>Añadir Tarea</p>
                  <div className="flex gap-2">
                    <div>
                      <label className="inputs-placeholder w-full relative h-12 flex flex-rowd gap-2 p-2 border border-zinc-300 rounded-sm">
                        <Field
                          className="w-full outline-none resize-none"
                          type="text"
                          name="task"
                        />
                        <span className="min-w-8 min-h-8 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                          <TbAbc size="20" />
                        </span>
                      </label>
                      <ErrorMessage
                        name="task"
                        component="div"
                        className="text-red-500 text-xs text-right m-0"
                      />
                    </div>
                    <div>
                      <label className="inputs-placeholder w-64 relative h-12 flex flex-rowd gap-2 p-2 border border-zinc-300 rounded-sm">
                        <Field
                          className="w-full outline-none resize-none border-2 border-white"
                          as="select"
                          name="importance"
                        >
                          <option value="">Importancia</option>
                          <option value="Alta">Alta</option>
                          <option value="Media">Media</option>
                          <option value="Baja">Baja</option>
                        </Field>
                      </label>
                      <ErrorMessage
                        name="importance"
                        component="div"
                        className="text-red-500 text-xs text-right m-0"
                      />
                    </div>
                  </div>
                  <Button
                    variant="surface"
                    color="green"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Añadir
                    <GoPlus size={20} />
                  </Button>
                </Form>
              )}
            </Formik>
            <div className="p-2 flex flex-col gap-2">
              {tasksHigh.length != 0 && (
                <div className="flex flex-col gap-2 border-2 border-red-400 p-2 rounded-lg">
                  {tasksHigh.map((item) => (
                    <div
                      key={item.ID}
                      className="bg-zinc-100 px-2 py-1 rounded-sm border border-zinc-300 flex flex-col gap-1.5"
                    >
                      <div className="w-full flex justify-between items-center">
                        <p className="w-64">{item.Contenido}</p>
                        <div className="flex gap-2">
                          <Tooltip content="Subir archivos">
                            <span
                              className="size-8 border border-blue-600 rounded-full flex justify-center items-center text-blue-600 hover:bg-blue-600 hover:text-white"
                              onClick={() => setUploadFiles(item.ID)}
                            >
                              <TbFileUpload />
                            </span>
                          </Tooltip>

                          <Tooltip content="Marcar como completa">
                            <button
                              className="size-8 border border-green-600 rounded-full flex justify-center items-center text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => completeTaskActivity(item.ID)}
                            >
                              <TbCheck size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <Files taskID={item.ID} />
                    </div>
                  ))}
                </div>
              )}
              {tasksHalf.length != 0 && (
                <div className="flex flex-col gap-2 border-2 border-amber-400 p-2 rounded-lg">
                  {tasksHalf.map((item) => (
                    <div
                      key={item.ID}
                      className="bg-zinc-100 px-2 py-1 rounded-sm border border-zinc-300 flex flex-col gap-1.5"
                    >
                      <div className="w-full flex justify-between items-center">
                        <p>{item.Contenido}</p>
                        <div className="flex gap-2">
                          <Tooltip content="Subir archivos">
                            <span
                              className="size-8 border border-blue-600 rounded-full flex justify-center items-center text-blue-600 hover:bg-blue-600 hover:text-white"
                              onClick={() => setUploadFiles(item.ID)}
                            >
                              <TbFileUpload />
                            </span>
                          </Tooltip>
                          <Tooltip content="Marcar como completa">
                            <button
                              className="size-8 border border-green-600 rounded-full flex justify-center items-center text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => completeTaskActivity(item.ID)}
                            >
                              <TbCheck size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <Files taskID={item.ID} />
                    </div>
                  ))}
                </div>
              )}
              {tasksLow.length != 0 && (
                <div className="flex flex-col gap-2 border-2 border-green-400 p-2 rounded-lg">
                  {tasksLow.map((item) => (
                    <div
                      key={item.ID}
                      className="bg-zinc-100 px-2 py-1 rounded-sm border border-zinc-300 flex flex-col gap-1.5"
                    >
                      <div className="w-full flex justify-between items-center">
                        <p>{item.Contenido}</p>
                        <div className="flex gap-2">
                          <Tooltip content="Subir archivos">
                            <span
                              className="size-8 border border-blue-600 rounded-full flex justify-center items-center text-blue-600 hover:bg-blue-600 hover:text-white"
                              onClick={() => setUploadFiles(item.ID)}
                            >
                              <TbFileUpload />
                            </span>
                          </Tooltip>
                          <Tooltip content="Marcar como completa">
                            <button
                              className="size-8 border border-green-600 rounded-full flex justify-center items-center text-green-600 hover:bg-green-600 hover:text-white"
                              onClick={() => completeTaskActivity(item.ID)}
                            >
                              <TbCheck size={16} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                      <Files taskID={item.ID} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {uploadFiles && (
            <UploadFiles
              taskID={uploadFiles}
              close={() => setUploadFiles(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Tasks;
