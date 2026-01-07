import React from "react";
import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";

const DeleteQuote = ({ ID, close }) => {
  const handleDeleteQuoteClick = async () => {
    const response = await requests.deleteQuote(ID);
    response && window.location.reload();
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Eliminar Cotización.</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="w-72">
          <p>¿Estas seguro de eliminar esta cotización?</p>
        </div>
        <div className="w-full flex gap-3">
          <button
            className="h-10 bg-zinc-300 w-full rounded-sm hover:bg-zinc-500 hover:text-white"
            onClick={() => close()}
          >
            Cancelar
          </button>
          <button
            className="h-10 bg-red-500 w-full rounded-sm text-white hover:bg-red-700"
            onClick={() => handleDeleteQuoteClick()}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteQuote;
