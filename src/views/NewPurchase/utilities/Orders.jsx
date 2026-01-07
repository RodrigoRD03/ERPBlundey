import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import requests from "./requests";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbArrowRight } from "react-icons/tb";
import Prices from "./Prices";
import Finish from "./Finish";

const Orders = () => {
  const { quoteID, orderPurchaseID } = useParams();
  const [itemsList, setItemsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [type, setType] = useState("");
  const [prices, setPrices] = useState(null);
  const [search, setSearch] = useState("");
  const [finish, setFinish] = useState(null);

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
    
    requests.getProductsServices(quoteID).then((response) => {
      setItemsList(response);

      // Separar productos y servicios
      const products = response.flatMap((item) => item.Productos);
      const services = response.flatMap((item) => item.Servicios);

      setProductsList(products);
      setServicesList(services);
    });
  }, [quoteID]);

  const dataProducts = {
    nodes: productsList
      .filter(
        (item) =>
          item.Producto &&
          item.Producto.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const dataServices = {
    nodes: servicesList
      .filter(
        (item) =>
          item.Servicio &&
          item.Servicio.toLowerCase().includes(search.toLowerCase())
      )
      .map((item) => ({ ...item, id: item.ID })),
  };

  const ColumnsProducts = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Producto
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.Producto}>
          <p className="font-bold">{item.Producto}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Modelo
        </div>
      ),
      renderCell: (item) => <p className="font-bold">{item.Modelo}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Seleccionar
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Button
            variant="soft"
            color="lime"
            onClick={() => {
              setPrices(item.ID), setType("Producto");
            }}
          >
            Seleccionar <TbArrowRight size={24} />
          </Button>
        </div>
      ),
    },
  ];

  const ColumnsServices = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Servicio
        </div>
      ),
      renderCell: (item) => (
        <Tooltip content={item.Servicio}>
          <p className="font-bold">{item.Servicio}</p>
        </Tooltip>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Seleccionar
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Button
            variant="soft"
            color="lime"
            onClick={() => {
              setPrices(item.ID), setType("Servicio");
            }}
          >
            Seleccionar <TbArrowRight size={24} />
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
          <Link to="/Layout/NewPurchase">Nueva Compra</Link> / <b>Ordenes</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Ordenes</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-5 p-5 rounded-md shadow-md ">
        <div className="flex gap-8">
          <div className="flex flex-col gap-2.5">
            <p className="text-lg">Lista de Productos</p>
            <div className="line-row" />
            {productsList.length != 0 ? (
              <div className="table-Scroll relative bg-white mb-2 rounded-md overflow-hidden border border-zinc-300 pb-2 max-h-[720px] max-w-[600px] overflow-y-scroll">
                <div className="">
                  <CompactTable
                    columns={ColumnsProducts}
                    data={dataProducts}
                    theme={theme}
                    layout={{ fixedHeader: true }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-96 h-32 bg-zinc-100 rounded-sm flex justify-center items-center text-zinc-400">
                <p>Sin Productos.</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2.5">
            <p className="text-lg">Lista de Servicios</p>
            <div className="line-row" />
            {servicesList.length != 0 ? (
              <div className="table-Scroll relative bg-white mb-2  rounded-md overflow-hidden border border-zinc-300 pb-2 max-h-[720px] max-w-[600px] overflow-y-scroll">
                <div className="">
                  <CompactTable
                    columns={ColumnsServices}
                    data={dataServices}
                    theme={theme}
                    layout={{ fixedHeader: true }}
                  />
                </div>
              </div>
            ) : (
              <div className="w-96 h-32 bg-zinc-100 rounded-sm flex justify-center items-center text-zinc-400">
                <p>Sin servicios.</p>
              </div>
            )}
          </div>
        </div>
        <div className="line-row" />
        <div className="flex justify-end gap-3">
          <Button
            className="!w-48"
            variant="soft"
            color="blue"
            onClick={() => setFinish(true)}
          >
            Finalizar
          </Button>
        </div>
      </div>
      {finish && (
        <Finish supplierID={orderPurchaseID} close={() => setFinish(null)} />
      )}
      {prices && (
        <Prices
          orderID={prices}
          supplierID={orderPurchaseID}
          type={type}
          quoteID={quoteID}
          close={() => setPrices(null)}
        />
      )}
    </div>
  );
};

export default Orders;
