import { useEffect, useState } from "react";
import requests from "./requests";
import { GiCubes } from "react-icons/gi";
import { BlobBlue } from "../../../constants/";
import { Link } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";
import { TbBuilding } from "react-icons/tb";

const Enterprises = () => {
  const [numberEnterprises, setNumberEnterprises] = useState(0);
  const { userData } = useUser();

  useEffect(() => {
    if (
      userData.Roles == "Administrador" ||
      userData.Roles == "Desarrollador"
    ) {
      requests.getEnterprisesAdmin(userData.ID).then((response) => {
        setNumberEnterprises(response.length);
      });
    } else if (userData.Roles == "Supervisor") {
      requests.getEnterprisesSupervisor(userData.ID).then((response) => {
        setNumberEnterprises(response.length);
      });
    } else {
      requests.getEnterprisesSeller(userData.ID).then((response) => {
        setNumberEnterprises(response.length);
      });
    }
  }, []);
  return (
    <div
      className="relative w-76 h-48 bg-sovetec-primary p-4 rounded-xl overflow-hidden flex items-center shadow-md card"
    >
      <div className="absolute w-[410px] rotate-[225deg] -top-2 -left-20 z-0 blob">
        <img className="w-full h-full" src={BlobBlue} alt="" />
      </div>
      <div className="absolute top-4 left-4 size-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg flex justify-center items-center">
        <span className="text-white ">
          <TbBuilding size={24} />
        </span>
      </div>
      <div className="absolute text-white  flex z-40 bottom-8 gap-2">
        <p className="text-6xl font-semibold">{numberEnterprises}</p>
        <p className="w-20 text-sm">Total de Empresas</p>
      </div>
      <span className="absolute -bottom-8 -right-2 z-10 text-sovetec-fifty">
        <TbBuilding size={150} />.
      </span>
    </div>
  );
};

export default Enterprises;
