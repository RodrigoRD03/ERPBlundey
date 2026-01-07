import React, { useEffect, useState } from "react";
import { GoPlus } from "react-icons/go";
import { Link } from "react-router-dom";
import GlobalStyles from "../../globalStyles";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { TbCheck, TbChevronDown, TbMessage, TbSearch } from "react-icons/tb";
import { Tooltip } from "@radix-ui/themes";
import Files from "./utilities/FIles";

const GruopTasks = () => {
  const [tasksList, setTasksList] = useState([]);
  const [search, setSearch] = useState("");
  const { userData } = useUser();

  useEffect(() => {
    requests.getGroupTasks(userData.ID).then((response) => {
      setTasksList(response);
    });
  }, []);

  const handleMarkChecTasksClick = async (taskID) => {
    const response = await requests.checkGroupTask(taskID, userData.ID);
    response && window.location.reload();
  };

  const handleSearchTaskClick = async (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim() === "") {
      const taskInit = await requests.getGroupTasks(userData.ID);
      setTasksList(taskInit);
      return;
    }

    const response = await requests.getSearchTask(userData.ID, value);
    setTasksList(response);
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Tareas Compartidas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Tareas Compartidas</p>
      </div>
      <div className="line-row" />
      <Link to="/Layout/GroupTasks/Add" className={`${GlobalStyles.btnAdd}`}>
        <p className="text-sm">Nueva Tarea</p>
        <span>
          <GoPlus size={24} />
        </span>
      </Link>
      <div className="col-span-2 flex gap-2 bg-white w-max px-4 py-2 rounded-xl">
        <input
          className="h-12 px-4 w-64 outline-none border rounded-sm border-zinc-300"
          type="text"
          placeholder="Buscar tarea."
          value={search}
          onChange={handleSearchTaskClick}
        />
        <span className="size-12 flex justify-center items-center bg-zinc-300 rounded-full text-white hover:bg-zinc-500 cursor-pointer">
          <TbSearch size={24} />
        </span>
      </div>
      {tasksList.length > 0 ? (
        <div className="w-full bg-white grid grid-cols-2 gap-2 p-4 rounded shadow">
          {tasksList.map((task, index) => (
            <div
              key={index}
              className="border border-zinc-200 p-4 rounded flex flex-col gap-2 h-max"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-base">{task.Titulo}</p>
                  <p className="text-sm">{task.Descripcion}</p>
                  <div className="text-sm flex gap-1">
                    Fecha y hora de creación:{" "}
                    <p className="font-semibold">{task.Fecha}</p>
                  </div>
                </div>
                <div className="p-2 flex gap-2">
                  <Link
                    to={`/Layout/GroupTasks/Comments/${task.ID}`}
                    className="border size-12 border-green-500 rounded-full flex justify-center items-center text-green-500 hover:bg-green-500 hover:text-white cursor-pointer"
                  >
                    <TbMessage size={20} />
                  </Link>
                  {task.Estatus == "Activa" && (
                    <span
                      className="border size-12 border-amber-500 rounded-full flex justify-center items-center text-amber-500 hover:bg-amber-500 hover:text-white cursor-pointer"
                      onClick={() => handleMarkChecTasksClick(task.ID)}
                    >
                      <TbCheck size={20} />
                    </span>
                  )}
                </div>
              </div>
              <Files taskID={task.ID} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
          <div className="flex flex-col justify-center items-center">
            <span>
              <TbSearch size={30} />
            </span>
            <p className="text-xl">No se encontraron tareas en grupo.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GruopTasks;
