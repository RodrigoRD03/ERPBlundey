import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import requests from "./utilities/requests";
import { useUser } from "../../Contexts/UserContext";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { TbArrowRight, TbSearch } from "react-icons/tb";
import { Button } from "@radix-ui/themes";
import InitPurchase from "./utilities/InitPurchase";

const NewPurchase = () => {
  const [listOrders, setListOrders] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [quoteID, setQuoteID] = useState("");
  const [purchaseID, setPurchaseID] = useState("");
  const [orderID, setOrderID] = useState("");
  const [initPurchase, setInitPurchase] = useState(null);
  const { userData } = useUser();

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
    requests.getPurchaseOrders(userData.ID).then((response) => {
      setListOrders(response);
    });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleInitPurchaseClick = async (quoteID, purchaseID) => {
    setQuoteID(quoteID);
    setPurchaseID(purchaseID);
    const object = {
      UsuarioID: userData.ID,
      CotizacionID: quoteID,
    };
    const response = await requests.insertPurchaseOrder(object);
    setOrderID(response);
    setInitPurchase(true);
  };

  const data = {
    nodes: listOrders.filter((item) =>
      item.Empresa.toLowerCase().includes(search.toLowerCase())
    ).map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Empresa
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">{item.Empresa}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          OC del cliente
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.ClienteOrdenCompra}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Versión
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          {item.CotizacionVersion}
        </p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal text-sm capitalize">
          ${item.Subtotal.toLocaleString("en-US")}
        </p>
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
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Button
            variant="soft"
            color="green"
            onClick={() => handleInitPurchaseClick(item.CotizacionID, item.ID)}
          >
            <p>Iniciar Orden</p>{" "}
            <span>
              <TbArrowRight size={18} />
            </span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> / <b>Nueva Compra</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nueva Compra</p>
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
      {data.nodes.length > 0 ? (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl  rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
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
            <p className="text-xl">Sin resultados</p>
          </div>
        </div>
      )}
      {initPurchase && (
        <InitPurchase
          orderID={orderID}
          purchaseID={purchaseID}
          quoteID={quoteID}
          close={() => setInitPurchase(null)}
        />
      )}
    </div>
  );
};

export default NewPurchase;
