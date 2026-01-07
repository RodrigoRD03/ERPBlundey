import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbCheck, TbQuestionMark, TbSearch } from "react-icons/tb";
import { Button, IconButton, Tooltip, Spinner } from "@radix-ui/themes";
import { useUser } from "../../../Contexts/UserContext";

const Addresses = () => {
  const { enterpriseID, customerID } = useParams();
  const [addressesList, setAddressesList] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [priceDollarUI, setPriceDollarUI] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const { userData } = useUser();
  let data = addressesList;

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

  useEffect(() => {
    requests.getAddresses(enterpriseID).then((response) => {
      setAddressesList(response);
    });
    requests.getDollarPrice().then((response) => {
      const length = response.bmx.series[0].datos.length;
      setPriceDollarUI(response.bmx.series[0].datos[length - 2].dato);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  data = {
    nodes: addressesList
      .filter((item) =>
        item.Direccion.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleStartQuoteClick = async (addressID) => {
    let priceDollar = 0;
    const response = await requests.getDollarPrice();
    const length = response.bmx.series[0].datos.length;
    priceDollar = response.bmx.series[0].datos[length - 1].dato;
    setLoader(true);
    const object = {
      UsuarioID: userData.ID,
      ClienteID: customerID,
      LibretaDireccionID: addressID,
      Dolar: isChecked,
      PrecioDolar: priceDollar,
    };
    requests.startQuote(object).then((response) => {
      navigate(
        `/Layout/NewQuote/Quote/${enterpriseID}/${customerID}/${addressID}/${response.ID}`
      );
    });
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          #
        </div>
      ),
      renderCell: (item) => <p className="font-normal capitalize">{item.ID}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Dirección
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Direccion}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Codigo Postal
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.CodigoPostal}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-normal capitalize flex justify-center items-center">
          <Button
            variant="soft"
            color="lime"
            disabled={loader}
            onClick={() => handleStartQuoteClick(item.ID)}
          >
            {!loader ? (
              <>
                Seleccionar <TbCheck size={18} />
              </>
            ) : (
              <Spinner />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/NewQuote">Nueva Cotización</Link> /{" "}
          <b>Lista de Direcciones</b>
        </p>
        <p className="text-lg font-bold">Lista de Direcciones</p>
        <div className="line-row" />
        <div className="max-w-[1280px] flex justify-between items-center">
          <label
            htmlFor="search"
            className=" w-64 flex items-center bg-white border-2 border-zinc-200 rounded-full"
          >
            <input
              className="h-10 rounded-md py-2 px-3 outline-none"
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
          <div className="flex items-center gap-6">
            <p className="text-sm">
              Precio del Dolar Actualmente: $ {priceDollarUI}
            </p>
            <label
              htmlFor="sendEmail"
              className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
            >
              <input
                type="checkbox"
                name="sendEmail"
                id="sendEmail"
                className="hidden peer"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition peer-checked:bg-blue-500 peer-checked:border-blue-500">
                {isChecked && (
                  <svg
                    className="w-4 h-4 text-white scale-100 transition-transform duration-200"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.586l10.293-10.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              Cotización en Dólares
            </label>
            <Tooltip
              content="Selecciona una Dirección, si la cotización es en dolares, selecciona la casilla de aun lado para que el sistema lo tome en cuenta"
              width="200px"
            >
              <IconButton
                variant="solid"
                color="sky"
                radius="full"
                className="font-bold"
              >
                <TbQuestionMark size={18} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {data.nodes.length > 0 ? (
          <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl rounded-md overflow-hidden border border-zinc-300 pb-2 max-h-[720px] overflow-y-scroll">
            <div className="">
              <CompactTable
                columns={COLUMNS}
                data={data}
                theme={theme}
                layout={{ fixedHeader: true }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500 bg-white rounded-sm flex justify-center items-center gap-2">
            <div className="flex flex-col justify-center items-center">
              <span>
                <TbSearch size={30} />
              </span>
              <p className="text-xl">No se encontraron cotizaciones.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;
