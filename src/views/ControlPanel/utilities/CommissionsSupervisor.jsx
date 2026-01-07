import React, { useEffect, useState } from "react";
import requests from "./requests";
import { useUser } from "../../../Contexts/UserContext";
import { Tooltip } from "@radix-ui/themes";

const formatCurrency = (value) => {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const SalesProgress = ({ totalVendido, meta }) => {
  const metaWidth = 596; // Ancho total cuando se alcanza la meta
  const vendidoWidth = Math.min((totalVendido / meta) * metaWidth, metaWidth); // Regla de 3
  const porcentaje = ((totalVendido / meta) * 100).toFixed(0); // Cálculo del porcentaje

  return (
    <div className="w-[596px] bg-gray-300 rounded-md relative h-8 flex mt-3">
      {vendidoWidth < 180 ? (
        <Tooltip content={`Total vendido: $${formatCurrency(totalVendido)}`}>
          <div
            className={`${
              totalVendido >= meta
                ? "bg-gradient-to-r from-lime-400 from-10% via-green-600 via-100% "
                : "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-100% "
            } relative h-8 rounded-md flex justify-center items-center text-white text-sm`}
            style={{ width: `${vendidoWidth}px` }}
          >
            <div className="absolute text-xs text-black -right-1.5 -top-4 flex flex-col justify-center items-center">
              <Tooltip content={`${porcentaje}%`}>
                <div className="size-3 bg-zinc-500 rounded-full" />
              </Tooltip>
              <div className="h-10 w-[1px] border border-zinc-500 rounded-full" />
            </div>
          </div>
        </Tooltip>
      ) : (
        <div
          className={`${
            totalVendido >= meta
              ? "bg-gradient-to-r from-lime-400 from-10% via-green-600 via-100% "
              : "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-100% "
          } relative h-8 rounded-md flex justify-center items-center text-white text-sm`}
          style={{ width: `${vendidoWidth}px` }}
        >
          Total Vendido: ${formatCurrency(totalVendido)}
          <div className="absolute text-xs text-black -right-1.5 -top-4 flex flex-col justify-center items-center">
            <Tooltip content={`${porcentaje}%`}>
              <div className="size-3 bg-zinc-500 rounded-full" />
            </Tooltip>
            <div className="h-10 w-[1px] border border-zinc-500 rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
};

const CommissionsSupervisor = () => {
  const { userData } = useUser();
  const [commissiosnData, setCommissionsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userData?.ID) return;

    setLoading(true);
    requests
      .getCommissionsSupervisor(userData.ID)
      .then((response) => {
        setCommissionsData(response);
      })
      .catch((error) => console.error("Error fetching commissions:", error))
      .finally(() => setLoading(false));
  }, [userData]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!commissiosnData) {
    return <p>No hay datos de comisiones disponibles.</p>;
  }

  return (
    <div className="w-[628px] overflow-x-hidden max-h-[616px] h-max bg-white rounded-xl border border-zinc-300 shadow-md flex flex-col pr-[5px] hover:pr-0">
      <div className=" w-[626px] border-transparent border-b border-b-zinc-300 py-2 px-4 text-zinc-600  bg-white z-10 rounded-t-xl">
        Meta y Comisiones de los vendedores.
      </div>
      <div className="max-h-[600px] flex flex-col justify-between overflow-y-scroll scroll-panel">
        {commissiosnData && (
          <>
            {commissiosnData.map((comission, index) => (
              <div key={index} className=" flex flex-col gap-1">
                <div className="px-4 py-2">
                  <div className="flex justify-between">
                    <div className="flex gap-1 items-center">
                      <p className="text-zinc-600">Vendedor:</p>{" "}
                      <p>{comission.Vendedor}</p>{" "}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400">
                        {comission.TipoVendedor}
                      </p>
                    </div>
                  </div>
                  <SalesProgress
                    key={index}
                    totalVendido={comission.TotalVendido}
                    meta={comission.Meta}
                  />
                </div>
                <div className="w-full h-23 grid grid-cols-2 gap-[1px] bg-zinc-300 border-y border-y-zinc-300">
                  <div className="w-full h-full bg-white flex flex-col justify-center items-center">
                    <p className="text-sm">Meta a alcanzar: </p>
                    <p className="text-lg font-semibold">
                      $ {formatCurrency(comission.Meta)}
                    </p>
                  </div>

                  <div className="w-full h-full bg-white flex flex-col justify-center items-center">
                    {comission.TotalVendido == 0 ? (
                      <p className="text-amber-500 text-center text-sm">
                        Sin registro de comisiones
                      </p>
                    ) : (
                      <>
                        <p className="text-sm">Total de Comisión:</p>
                        <p className="text-lg font-semibold">
                          $ {formatCurrency(comission.TotalComision)}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default CommissionsSupervisor;
