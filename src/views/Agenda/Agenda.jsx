import { TbCalendar, TbExclamationMark, TbSubtask } from "react-icons/tb";
import { useEffect, useState } from "react";
import requests from "./utilities/requests";
import { TbCheck } from "react-icons/tb";
import { GoPlus } from "react-icons/go";
import { useUser } from "../../Contexts/UserContext";
import Calendar from "react-calendar";
import { es } from "date-fns/locale";
import { isSameDay } from "date-fns";
import "./utilities/styles.css";
import { Button } from "@radix-ui/themes";
import { RiCloseFill } from "react-icons/ri";

const AddTask = ({ date, update, change, close }) => {
  const [activity, setActivity] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState(false);
  const { userData } = useUser();

  const config = {
    headers: {
      Authorization: `Bearer ${userData.JWT}`,
    },
  };

  const handleActivityChange = (event) => {
    setActivity(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const requestAddActivity = (event) => {
    event.preventDefault();
    if (!activity || !time) {
      setError(true);
    } else {
      setError(false);
      const newObject = {
        Contenido: activity,
        Fecha: new Date(date).toISOString().split("T")[0],
        UsuarioID: userData.ID,
        Tiempo: time,
      };

      requests.addNewTaskDiary(newObject, config).then((returned) => {
        if (returned) {
          change();
        }
        update();
        close();
      });
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Añadir Actividad</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />

        <div className="line-row" />
        <form className=" flex flex-col gap-5" onSubmit={requestAddActivity}>
          <div>
            <label
              className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
              data-text="Descripción"
            >
              <input
                className="w-full outline-none resize-none"
                type="text"
                value={activity}
                onChange={handleActivityChange}
              />
              <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                <TbSubtask size="20" />
              </span>
            </label>
          </div>
          <div>
            <label
              className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
              data-text="Hora"
            >
              <input
                className="w-full"
                type="time"
                value={time}
                onChange={handleTimeChange}
              />
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-xs text-right m-0">
              <p>Complete todos los campos.</p>
            </div>
          )}
          <button
            type="submit"
            className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
          >
            Añadir
          </button>
        </form>
      </div>
    </div>
  );
};

const Agenda = ({ openOption, setOpenOption }) => {
  const [important, setImportant] = useState(false);
  const [markedDays, setMarkedDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [addTask, setAddTask] = useState(null);
  const [open, setOpen] = useState(false);
  const { userData } = useUser();
  const [isTodayImportant, setIsTodayImportant] = useState(false);

  useEffect(() => {
    setImportant(userData.Agenda);
    const fetchImportantDays = async () => {
      try {
        const returned = await requests.getImportantDays(userData.ID);
        const newMarkedDays = returned.map((item) => ({
          date: new Date(item.Anio, item.Mes - 1, item.Dia),
          tasks: item.Content.map((i) => ({
            id: i.ID,
            label: i.Label,
            time: i.Tiempo,
          })),
        }));

        setMarkedDays(newMarkedDays);
      } catch (error) {
        console.log(error);
      }
    };

    fetchImportantDays();
  }, [userData.ID]);

  useEffect(() => {
    if (openOption == "Tasks") {
      setOpen(false);
    }
  }, [openOption]);

  useEffect(() => {
    const today = new Date();
    const result = markedDays.some((markedDay) =>
      isSameDay(markedDay.date, today)
    );
    setIsTodayImportant(result);
  }, [markedDays]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const markedDay = markedDays.find((markedDay) =>
        isSameDay(markedDay.date, date)
      );
      return markedDay ? "marked-day" : null;
    }
    return null;
  };

  const getTasksForDay = (date) => {
    const markedDay = markedDays.find((markedDay) =>
      isSameDay(markedDay.date, date)
    );
    return markedDay
      ? markedDay.tasks
      : [{ id: null, label: null, time: null }];
  };

  const RequestCompleteTask = (ID) => {
    requests
      .markCompleteTask(ID)
      .then((returned) => {
        if (!returned) {
          setImportant(false);
        }
        const fetchImportantDays = async () => {
          try {
            const returned = await requests.getImportantDays(userData.ID);

            const newMarkedDays = returned.map((item) => ({
              date: new Date(item.Anio, item.Mes - 1, item.Dia),
              tasks: item.Content.map((i) => ({
                id: i.ID,
                label: i.Label,
                time: i.Tiempo,
              })),
            }));

            setMarkedDays(newMarkedDays);
          } catch (error) {
            console.error("Error fetching important days:", error);
          }
        };

        fetchImportantDays();
      })
      .catch((error) => {
        console.error("Error completing task:", error);
      });
  };

  const updateList = () => {
    const fetchImportantDays = async () => {
      try {
        const returned = await requests.getImportantDays(userData.ID);

        const newMarkedDays = returned.map((item) => ({
          date: new Date(item.Anio, item.Mes - 1, item.Dia),
          tasks: item.Content.map((i) => ({
            id: i.ID,
            label: i.Label,
            time: i.Tiempo,
          })),
        }));

        setMarkedDays(newMarkedDays);
      } catch (error) {
        console.error("Error fetching important days:", error);
      }
    };

    fetchImportantDays();
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    let formattedHour = hour % 12 || 12;
    let period = hour >= 12 ? "PM" : "AM";
    return `${formattedHour}:${minute} ${period}`;
  };

  const changeImportantDay = () => {
    setImportant(true);
  };

  return (
    <div className="absolute top-0 right-45 bg-white flex justify-center items-center shadow-lg rounded-b-lg z-10">
      {!open && openOption != "Agenda" ? (
        <div
          className="relative w-20 h-12 flex justify-center items-center bg-blue-400 text-white cursor-pointer rounded-b-lg z-10"
          onClick={() => {
            setOpen(true);
            setOpenOption("Agenda");
          }}
        >
          <TbCalendar size={20} />
          {isTodayImportant && (
            <div className="absolute bg-red-400 -bottom-3 -left-2 rounded-full size-6 flex justify-center items-center important-day">
              <TbExclamationMark size={20} />
            </div>
          )}
        </div>
      ) : (
        <div className="w-[500px]  relative z-10">
          <div
            className="w-full h-12 flex justify-center items-center bg-blue-400 hover:bg-blue-600 text-white cursor-pointer"
            onClick={() => {
              setOpen(false);
              setOpenOption(null);
            }}
          >
            <TbCalendar size={20} />
          </div>
          <div className="h-10 flex text-black gap-[1px] bg-zinc-300 border border-zinc-300">
            <p className="w-full flex justify-center items-center bg-white font-semibold">
              Agenda
            </p>
          </div>
          <div className="p-2 flex flex-col gap-2">
            <Calendar
              className="app__Notes-Calendar"
              locale={es}
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={tileClassName}
            />
            <div className="flex flex-col gap-2">
              {selectedDate && (
                <>
                  <div>
                    <Button
                      variant="soft"
                      color="green"
                      onClick={() => setAddTask(selectedDate)}
                    >
                      Agregar
                      <GoPlus size={20} />
                    </Button>
                  </div>
                  <div className="">
                    <table className=" border-zinc-500 text-center min-w-full border-collapse overflow-hidden rounded ">
                      <thead>
                        <tr className="border border-zinc-300">
                          <th className="bg-sovetec-primary text-white text-sm p-1.5">
                            No
                          </th>
                          <th className="bg-sovetec-primary text-white text-sm p-1.5">
                            Actividad
                          </th>
                          <th className="bg-sovetec-primary text-white text-sm p-1.5">
                            Hora
                          </th>
                          <th className="bg-sovetec-primary text-white text-sm p-1.5">
                            Marcar
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDate &&
                          getTasksForDay(selectedDate).map((task, index) => (
                            <tr key={index}>
                              {task.label == null ? (
                                <td
                                  className="border border-zinc-300 p-1"
                                  colSpan={4}
                                >
                                  No hay actividades en la agenda.
                                </td>
                              ) : (
                                <>
                                  <td className="border border-zinc-300 p-1 bg-zinc-100">
                                    {index + 1}
                                  </td>

                                  <td className="border border-zinc-300 p-1 bg-zinc-100">
                                    <p>{task.label}</p>
                                  </td>
                                  <td className="border border-zinc-300 p-1 bg-zinc-100">
                                    <p>{formatTime(task.time)}</p>
                                  </td>

                                  {task.id && (
                                    <td
                                      className="border border-zinc-300 p-1 bg-zinc-100 cursor-pointer"
                                      onClick={() =>
                                        RequestCompleteTask(task.id)
                                      }
                                    >
                                      <span className="w-full flex justify-center text-green-600">
                                        <TbCheck size={24} />
                                      </span>
                                    </td>
                                  )}
                                </>
                              )}
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>
          {addTask && (
            <AddTask
              date={addTask}
              update={updateList}
              change={changeImportantDay}
              close={() => setAddTask(null)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Agenda;
