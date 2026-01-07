import { useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";
import { useUser } from "../../../Contexts/UserContext";

const DeleteProduct = ({ productID, close }) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const { userData } = useUser();

  const handleDeleteProductClick = async () => {
    const log = {
      UsuarioID: userData.ID,
      Accion: "Eliminar",
      Contenido: `Elimino un producto.`,
    };

    const response = await requests.deleteProduct(productID);
    if (response) {
      await requests.addLog(log);
      window.location.reload();
    } else {
      setErrorMessage(
        "No se pudo eliminar el producto por que tiene partidas creadas."
      );
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Eliminar Producto</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="flex flex-col gap-2">
          <p className="w-96">¿Estas seguro de eliminar el Producto?</p>
          <div className="flex gap-3">
            <button
              className="w-full h-10 bg-zinc-200 rounded-md text-zinc-500 text-sm font-bold"
              onClick={() => close()}
            >
              Cancelar
            </button>
            <button
              className="w-full h-10 bg-red-600 rounded-md text-white text-sm font-bold"
              onClick={handleDeleteProductClick}
            >
              Aceptar
            </button>
          </div>
          {errorMessage && <p className="text-red-400 w-96">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default DeleteProduct;
