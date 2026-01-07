import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import requests from "./requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbSearch } from "react-icons/tb";

const MovementDetails = ({warehouseID, movementID, close }) => {
  const [dataMovement, setDataMovement] = useState([]);
  const [search, setSearch] = useState("");
  let data = dataMovement;

  const fecthMovementDetails = async () => {
    try {
      const response = await requests.getMovementDetails(movementID, warehouseID);
      console.log(response);

      setDataMovement(response);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fecthMovementDetails();
  }, []);

  const theme = useTheme([
    getTheme(),
    {
      Row: `
        &:nth-of-type(odd) {
          background-color: #f7f7f7;
          }
          
          &:nth-of-type(even) {
            background-color: #G9G9G9;
        }
      `,
    },
  ]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: dataMovement
      ?.filter((item) =>
        item?.ModeloProducto?.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Modelo
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.ModeloProducto}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Cantidad}</p>
      ),
    },

    // {
    //   label: (
    //     <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
    //       Datos
    //     </div>
    //   ),
    //   renderCell: (item) => (
    //     <div className="font-bold capitalize flex justify-center items-center gap-2">
    //       <Button
    //         variant="soft"
    //         color="lime"
    //         onClick={() => setMovementDetails(item?.ID)}
    //       >
    //         <AiOutlineFileText size={24} /> Ver Datos
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white w-120 p-5 rounded-md flex flex-col gap-2 justify-center">
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center">
            Datos del Movimiento
          </p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer  hover:bg-red-500 hover:text-white"
            onClick={() => close()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />
        <label
          htmlFor="search"
          className="w-max flex justify-between px-2 items-center bg-white border-2 border-zinc-200 rounded-full"
        >
          <input
            className="h-10 rounded-md py-2 outline-none"
            id="search"
            type="text"
            placeholder="Buscar en la tabla"
            value={search}
            onChange={handleSearch}
          />
          <span className="text-zinc-500">
            <TbSearch size={24} />
          </span>
        </label>

        {(data?.nodes?.length ?? 0) > 0 ? (
          <div className="table-Scroll relative bg-white mr-5 mb-2 rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
            <CompactTable columns={COLUMNS} data={data} theme={theme} />
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
            <div className="flex flex-col justify-center items-center">
              <span>
                <TbSearch size={30} />
              </span>
              <p className="text-xl">Sin resultados</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovementDetails;
