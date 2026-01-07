import React from "react";
import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";

const ChangeStatus = ({ ID, close }) => {
  
  const handleCancelOrderClick = async () => {
    const response = await requests.cancelOrder({
      ID: ID,
    });
    response && window.location.reload();
  };

  const handleAcceptOrderClick = async () => {
    const response = await requests.acceptOrder(ID);
    response && window.location.reload();
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Cambiar Estatus</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="flex flex-col gap-2 max-w-67">
          <p className="text-2xl font-bold">¡Atención!</p>
          <p className="font-bold text-sm">
            ¿Estas seguro de cancelar o aceptar la orden?
          </p>
          <ul className="list-disc ml-7 text-">
            {/* <li>
              Para cancelar la Orden: Haga clic en el botón "Cancelar la Orden"
            </li> */}

            <li>
              Al finalizar la orden debera continuar en el modúlo facturación.
            </li>
          </ul>
        </div>
        <div className="line-row" />
        <div className="flex flex-col gap-2.5">
          <button
            className="w-full h-10 bg-red-600 text-white text-sm rounded-sm hover:bg-red-700"
            onClick={() => handleCancelOrderClick()}
          >
            Cancelar Orden
          </button>
          <button
            className="w-full h-10 bg-lime-500 text-white text-sm rounded-sm hover:bg-lime-600"
            onClick={() => handleAcceptOrderClick()}
          >
            Finalizar Orden
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatus;
