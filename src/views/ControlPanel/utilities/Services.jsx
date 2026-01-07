import { useEffect, useState } from "react";
import requests from "./requests";
import { BlobBlue } from "../../../constants/";
import { Link } from "react-router-dom";
import { TbTool } from "react-icons/tb";

const Services = () => {
  const [numberServices, setNumberServices] = useState(0);
  useEffect(() => {
    requests.getServices().then((response) => {
      setNumberServices(response.length);
    });
  }, []);

  return (
    <Link
      to="/Layout/Services"
      className="relative w-76 h-48 bg-sovetec-primary p-4 rounded-xl overflow-hidden flex items-center shadow-md card"
    >
      <div className="absolute w-[410px] rotate-[64deg] -top-2 -left-20 z-0 blob">
        <img className="w-full h-full" src={BlobBlue} alt="" />
      </div>
      <div className="absolute top-4 left-4 size-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg flex justify-center items-center">
        <span className="text-white ">
          <TbTool size={24} />
        </span>
      </div>
      <div className="absolute text-white  flex z-40 bottom-8 gap-2">
        <p className="text-6xl font-semibold">{numberServices}</p>
        <p className="w-20 text-sm">Total de Servicios</p>
      </div>
      <span className="absolute -bottom-7 -right-1 z-10 text-sovetec-fifty">
        <TbTool size={140} />.
      </span>
    </Link>
  );
};

export default Services;
