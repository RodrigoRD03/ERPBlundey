import { useUser } from "../../Contexts/UserContext";
import { LargeLogo, SmallLogo } from "../../constants";
import GlobalRoutes from "../../Routes/GlobalRoutes";
import { FiUser } from "react-icons/fi";
import { BiHome, BiLogOut } from "react-icons/bi";
import { Link } from "react-router-dom";
import Links from "./utilities/Links";
import Tasks from "../Tasks/Tasks";
import Agenda from "../Agenda/Agenda";
import { useState } from "react";

const Layout = () => {
  const { userData, logout } = useUser();
  const [componentOpen, setComponentOpen] = useState("");
  return (
    <div className="relative w-full h-screen flex font-display">
      <aside className="fixed left-0 top-0 max-w-[118px] h-screen p-0 py-4 flex flex-col justify-between bg-accent-300 text-white z-10 lg:max-w-[320px] lg:p-4">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full pt-2 px-5">
            <img
              className="w-full hidden lg:flex"
              src={LargeLogo}
              alt="Logo de Sovetec"
            />
            <img
              className="size-19 flex lg:hidden"
              src={SmallLogo}
              alt="Logo de Sovetec"
            />
          </div>
          <div className="w-full py-2 px-5 flex flex-col gap-2 ">
            <div>
              <Link
                to="/Layout/ControlPanel"
                className="w-full h-11 px-4 flex flex-row items-center justify-center gap-2 rounded-sm lg:justify-normal hover:bg-sovetec-thirty"
              >
                <span>
                  <BiHome size={20} />
                </span>
                <p className="text-[13px] hidden lg:flex">Panel de Control</p>
              </Link>
            </div>
            <div className="ml-3 lg:ml-0">
              <p className="text-zinc-500 text-sm">Menú</p>
            </div>
            {/* Archivo de los links */}
            <Links />
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-4">
          <button
            className="w-max h-11 flex flex-row gap-2 items-center px-4 bg-sovetec-primary rounded-sm cursor-pointer hover:bg-red-600 lg:w-64"
            onClick={() => logout()}
          >
            <span className=" ">
              <BiLogOut size={24} />
            </span>
            <p className="text-sm tracking-wide hidden lg:flex">
              Cerrar Sesión
            </p>
          </button>
          <div className="flex flex-row gap-2 w-full justify-center lg:justify-normal">
            <span className="w-12 h-12 bg-radial-[at_50%_75%] from-sky-500 to-indigo-900 to-90% flex justify-center items-center rounded-full">
              <FiUser size={21} />
            </span>
            <div className="hidden lg:flex lg:flex-col">
              <p className="text-lg whitespace-nowrap overflow-hidden text-ellipsis inline-block w-50">
                {userData.NombreCompleto}
              </p>
              <p className="text-xs">{userData.Roles}</p>
            </div>
          </div>
        </div>
      </aside>
      <div className="relative w-full h-screen bg-zinc-100 ml-[118px] lg:ml-[320px]">
        <GlobalRoutes />
      </div>
      <Tasks openOption={componentOpen} setOpenOption={setComponentOpen} />
      <Agenda openOption={componentOpen} setOpenOption={setComponentOpen} />
    </div>
  );
};

export default Layout;
