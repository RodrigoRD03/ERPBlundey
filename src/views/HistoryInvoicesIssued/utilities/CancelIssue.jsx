import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";

const CancelIssue = ({ UID, reload, close }) => {
  console.log(UID);

  const handleCancelIsseClick = async () => {
    const response = await requests.postCancelIssue(UID);
    console.log(response);
    if (response) {
      close();
      reload();
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-3 min-w-[460px]">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Cancelar Factura.</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={close}
          >
            <RiCloseFill size={24} />
          </span>
        </div>

        <div className="line-row" />
        <div className="flex flex-col gap-2">
          <p>¿Estas seguro de Cancelar esta Factura?</p>
          <div className="flex gap-4">
            <button
              className="bg-zinc-400 py-2 w-full flex justify-center items-center rounded-sm hover:bg-zinc-600 hover:text-zinc-50"
              onClick={close}
            >
              Cancelar
            </button>
            <button
              className="bg-red-200 py-1 w-full flex justify-center items-center text-sm text-red-600 rounded-sm hover:bg-red-400 hover:text-red-50"
              onClick={handleCancelIsseClick}
            >
              Cancelar Factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelIssue;
